import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";
import * as Sentry from "@sentry/tanstackstart-react";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "#/lib/db";
import { appUsers } from "#/lib/db/schema";

import type { CurrentUser } from "./session";

type SessionData = {
    username?: string;
    exp?: number;
};

const SESSION_COOKIE_NAME = "drawy-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_LENGTH = 16;

function getSessionSecret(): string {
    const password = process.env.SESSION_SECRET;
    if (!password) throw new Error("SESSION_SECRET is not set");
    return password;
}

function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: SESSION_MAX_AGE,
    };
}

function toBase64Url(buf: Buffer): string {
    return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(value: string): Buffer {
    let s = value.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return Buffer.from(s, "base64");
}

function signSession(data: SessionData): string {
    const payload = {
        ...data,
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    };
    const body = toBase64Url(Buffer.from(JSON.stringify(payload), "utf8"));
    const sig = toBase64Url(createHmac("sha256", getSessionSecret()).update(body).digest());
    return `${body}.${sig}`;
}

function verifySession(signed: string): SessionData | null {
    const parts = signed.split(".");
    if (parts.length !== 2) return null;
    const [body, sig] = parts;

    const expected = toBase64Url(createHmac("sha256", getSessionSecret()).update(body).digest());
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    try {
        const json = fromBase64Url(body).toString("utf8");
        const data = JSON.parse(json) as SessionData;
        if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function hashPassword(password: string, salt = randomBytes(PASSWORD_SALT_LENGTH).toString("hex")) {
    const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH);
    return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
    const parts = storedHash.split("$");
    if (parts.length !== 3 || parts[0] !== "scrypt") {
        return false;
    }
    const [, salt, keyHex] = parts;

    const derivedKey = scryptSync(password, salt, keyHex.length / 2) as Buffer;
    const expected = Buffer.from(keyHex, "hex");

    if (expected.length !== derivedKey.length) {
        return false;
    }

    return timingSafeEqual(expected, derivedKey);
}

function validateCredentials(username: string, _password: string): void {
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        throw new Error("Username can only contain letters, numbers, underscores, and hyphens.");
    }
}

async function loadCurrentUser(): Promise<CurrentUser | null> {
    const raw = getCookie(SESSION_COOKIE_NAME);
    if (!raw) {
        Sentry.setUser(null);
        return null;
    }

    const session = verifySession(raw);
    const username = session?.username;
    if (!username) {
        Sentry.setUser(null);
        return null;
    }

    try {
        const [user] = await db
            .select({ username: appUsers.username })
            .from(appUsers)
            .where(eq(appUsers.username, username))
            .limit(1);

        if (!user) {
            Sentry.setUser(null);
            return null;
        }
        // Keep Sentry's user context in sync with the authenticated session so
        // Agent Tracing conversations can attribute AI spans to this user.
        Sentry.setUser({ username: user.username });
        return { username: user.username };
    } catch (err) {
        // A database outage must not crash beforeLoad: the visitor is treated
        // as signed out instead. The cause carries the useful detail (timeout,
        // too many connections, DNS), the message alone does not.
        const cause = (err as { cause?: { code?: string; message?: string } }).cause;
        console.error(
            "[session] loadCurrentUser failed:",
            (err as Error).message,
            cause ? `(${cause.code ?? "unknown"}: ${cause.message ?? "no detail"})` : "",
        );
        Sentry.setUser(null);
        return null;
    }
}

export async function resolveCurrentUserServer(): Promise<CurrentUser | null> {
    return loadCurrentUser();
}

export async function signInServer(username: string, _password: string): Promise<CurrentUser> {
    validateCredentials(username, _password);

    const [user] = await db
        .select({
            username: appUsers.username,
            passwordHash: appUsers.passwordHash,
        })
        .from(appUsers)
        .where(eq(appUsers.username, username))
        .limit(1);

    if (!user) {
        throw new Error("Invalid username or password.");
    }

    const matches = verifyPassword(_password, user.passwordHash);

    if (!matches) {
        throw new Error("Invalid username or password.");
    }

    const token = signSession({ username: user.username });
    setCookie(SESSION_COOKIE_NAME, token, cookieOptions());

    return { username: user.username };
}

export async function signUpServer(username: string, password: string): Promise<CurrentUser> {
    validateCredentials(username, password);

    const [existing] = await db
        .select({ username: appUsers.username })
        .from(appUsers)
        .where(eq(appUsers.username, username))
        .limit(1);

    if (existing) {
        throw new Error("Username already exists.");
    }

    const passwordHash = hashPassword(password);

    const [created] = await db
        .insert(appUsers)
        .values({
            username,
            passwordHash,
        })
        .returning({ username: appUsers.username });

    if (!created) {
        throw new Error("Failed to create account.");
    }

    const token = signSession({ username: created.username });
    setCookie(SESSION_COOKIE_NAME, token, cookieOptions());

    return { username: created.username };
}

export async function logoutServer(): Promise<{ ok: true }> {
    deleteCookie(SESSION_COOKIE_NAME, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return { ok: true };
}
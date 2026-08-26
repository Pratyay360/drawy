import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { clearSession, getSession, updateSession } from "@tanstack/react-start/server";

import { createSupabaseAdminClient } from "#/utils/server-supabase";

import type { CurrentUser } from "./session";

type SessionData = {
    username?: string;
};

const SESSION_COOKIE_NAME = "drawy-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_LENGTH = 16;

function getSessionConfig() {
    const password = process.env.SESSION_SECRET;
    if (!password || password.length < 32) {
        throw new Error("SESSION_SECRET must be set and at least 32 characters long.");
    }

    return {
        name: SESSION_COOKIE_NAME,
        password,
        maxAge: SESSION_MAX_AGE,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            path: "/",
        },
    };
}

function hashPassword(password: string, salt = randomBytes(PASSWORD_SALT_LENGTH).toString("hex")) {
    const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH) as Buffer;
    return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
    const [scheme, salt, keyHex] = storedHash.split("$");
    if (scheme !== "scrypt" || !salt || !keyHex) return false;

    const derivedKey = scryptSync(password, salt, keyHex.length / 2) as Buffer;
    const expected = Buffer.from(keyHex, "hex");
    if (expected.length !== derivedKey.length) return false;

    return timingSafeEqual(expected, derivedKey);
}

const DUMMY_PASSWORD_HASH = hashPassword("drawy-dummy-password");

async function loadCurrentUser(): Promise<CurrentUser | null> {
    const session = await getSession<SessionData>(getSessionConfig());
    const username = session.data.username;
    if (!username) return null;

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("app_users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

    if (error || !data) return null;
    return { username: data.username };
}

export async function resolveCurrentUserServer(): Promise<CurrentUser | null> {
    return loadCurrentUser();
}

export async function signInServer(username: string, password: string): Promise<CurrentUser> {
    const supabase = createSupabaseAdminClient();
    const { data: user, error } = await supabase
        .from("app_users")
        .select("username,password_hash")
        .eq("username", username)
        .maybeSingle();

    if (error) throw new Error(error.message);

    const passwordHash = user?.password_hash ?? DUMMY_PASSWORD_HASH;
    const matches = verifyPassword(password, passwordHash);
    if (!user || !matches) {
        throw new Error("Invalid username or password.");
    }

    await updateSession<SessionData>(getSessionConfig(), {
        username: user.username,
    });

    return { username: user.username };
}

export async function signUpServer(username: string, password: string): Promise<CurrentUser> {
    const supabase = createSupabaseAdminClient();
    const { data: existing, error: existingError } = await supabase
        .from("app_users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

    if (existingError) throw new Error(existingError.message);
    if (existing) throw new Error("Username already exists.");

    const passwordHash = hashPassword(password);
    const { data: created, error } = await supabase
        .from("app_users")
        .insert({
            username,
            password_hash: passwordHash,
        })
        .select("username")
        .single();

    if (error || !created) throw new Error(error?.message ?? "Failed to create account.");

    await updateSession<SessionData>(getSessionConfig(), {
        username: created.username,
    });

    return { username: created.username };
}

export async function logoutServer(): Promise<{ ok: true }> {
    await clearSession(getSessionConfig());
    return { ok: true };
}
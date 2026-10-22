import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";

import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

/**
 * TanStack Start removed its built-in `useSession`/`getSession`/`updateSession`/
 * `clearSession` API in `@tanstack/start-server-core@1.169.41` (upstream PR #7588).
 * The session is now owned by the app, so this module re-implements it on top of the
 * supported cookie primitives (`getCookie`/`setCookie`/`deleteCookie`).
 *
 * The cookie value is sealed with AES-256-GCM using a key derived from
 * `SESSION_SECRET`, so the payload stays confidential and unforgeable — a client
 * cannot mint its own session cookie.
 */

export interface SessionData {
    username?: string;
}

type SealedSession = SessionData & {
    /** Expiry timestamp in milliseconds since the epoch. */
    exp: number;
};

const SESSION_COOKIE_NAME = "drawy-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const SESSION_COOKIE_VERSION = "v1";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_INFO = "drawy-session-cookie-v1";

function getSessionSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET is not set");
    return secret;
}

function deriveKey(secret: string): Buffer {
    return Buffer.from(
        hkdfSync(
            "sha256",
            Buffer.from(secret, "utf8"),
            Buffer.from(SESSION_COOKIE_NAME, "utf8"),
            Buffer.from(KEY_INFO, "utf8"),
            KEY_LENGTH,
        ),
    );
}

function sealSession(data: SessionData): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv("aes-256-gcm", deriveKey(getSessionSecret()), iv);
    const payload: SealedSession = {
        ...data,
        exp: Date.now() + SESSION_MAX_AGE * 1000,
    };
    const ciphertext = Buffer.concat([
        cipher.update(JSON.stringify(payload), "utf8"),
        cipher.final(),
    ]);

    return [
        SESSION_COOKIE_VERSION,
        iv.toString("base64url"),
        cipher.getAuthTag().toString("base64url"),
        ciphertext.toString("base64url"),
    ].join(".");
}

function unsealSession(token: string): SessionData | null {
    const parts = token.split(".");
    if (parts.length !== 4) return null;

    const [version, ivRaw, tagRaw, dataRaw] = parts;
    if (version !== SESSION_COOKIE_VERSION) return null;

    const iv = Buffer.from(ivRaw, "base64url");
    const tag = Buffer.from(tagRaw, "base64url");
    if (iv.length !== IV_LENGTH || tag.length !== AUTH_TAG_LENGTH) return null;

    try {
        const decipher = createDecipheriv("aes-256-gcm", deriveKey(getSessionSecret()), iv);
        decipher.setAuthTag(tag);
        const plaintext = Buffer.concat([
            decipher.update(Buffer.from(dataRaw, "base64url")),
            decipher.final(),
        ]);
        const payload = JSON.parse(plaintext.toString("utf8")) as SealedSession;

        if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return null;

        return typeof payload.username === "string" ? { username: payload.username } : {};
    } catch {
        // Tampered, truncated, or sealed with a different secret.
        return null;
    }
}

/** Read the current request's session. Returns an empty session when absent or invalid. */
export function readSession(): SessionData {
    const token = getCookie(SESSION_COOKIE_NAME);
    if (!token) return {};
    return unsealSession(token) ?? {};
}

/** Write the session and set the session cookie on the outgoing response. */
export function writeSession(data: SessionData): void {
    setCookie(SESSION_COOKIE_NAME, sealSession(data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    });
}

/** Expire the session cookie on the outgoing response. */
export function destroySession(): void {
    deleteCookie(SESSION_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}
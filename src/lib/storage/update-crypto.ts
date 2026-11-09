import { createCipheriv, createDecipheriv, createHash } from "node:crypto";

const IV_SIZE = 12;
const TAG_SIZE = 16;

function getSecret(): Buffer {
    const s = process.env.SESSION_SECRET;
    if (!s) throw new Error("SESSION_SECRET is not set");
    return createHash("sha256").update(s).digest();
}

function encryptUpdate(update: Uint8Array): string {
    const key = getSecret();
    const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const enc = Buffer.concat([cipher.update(update), cipher.final()]);
    const tag = cipher.getAuthTag();
    const combined = Buffer.concat([Buffer.from(iv), tag, enc]);
    return combined.toString("base64");
}

function decryptUpdate(b64: string): Uint8Array {
    const key = getSecret();
    const buf = Buffer.from(b64, "base64");
    const iv = buf.subarray(0, IV_SIZE);
    const tag = buf.subarray(IV_SIZE, IV_SIZE + TAG_SIZE);
    const data = buf.subarray(IV_SIZE + TAG_SIZE);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return new Uint8Array(dec);
}

/**
 * Encrypt a Yjs update for at-rest storage. If keying fails the update is
 * written as plain base64 instead, so callers must treat the output as
 * possibly unencrypted.
 */
export function encodeStoredUpdate(update: Uint8Array): string {
    try {
        return encryptUpdate(update);
    } catch {
        return Buffer.from(update).toString("base64");
    }
}

/** Inverse of {@link encodeStoredUpdate}; also reads legacy plain base64. */
export function decodeStoredUpdate(stored: string): Uint8Array {
    try {
        return decryptUpdate(stored);
    } catch {
        return new Uint8Array(Buffer.from(stored, "base64"));
    }
}
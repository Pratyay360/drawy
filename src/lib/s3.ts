import { createHash } from "node:crypto";

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
  const { createCipheriv } = require("node:crypto") as typeof import("node:crypto");
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
  const { createDecipheriv } = require("node:crypto") as typeof import("node:crypto");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return new Uint8Array(dec);
}

export function encodeStoredUpdate(update: Uint8Array): string {
  try {
    return encryptUpdate(update);
  } catch {
    return Buffer.from(update).toString("base64");
  }
}

export function decodeStoredUpdate(stored: string): Uint8Array {
  try {
    return decryptUpdate(stored);
  } catch {
    return new Uint8Array(Buffer.from(stored, "base64"));
  }
}

export async function s3Upload(body: Buffer): Promise<string> {
  const {
    s3Enabled: _enabledAnon,
    s3PutObject,
    s3PublicUrl,
    attachmentKey,
  } = await import("#/lib/storage/s3");
  void _enabledAnon;
  const hash = createHash("sha1").update(body).digest("hex");
  const key = attachmentKey("legacy", hash);
  const res = await s3PutObject(key, new Uint8Array(body), "application/octet-stream");
  if (res.enabled && s3PublicUrl(key)) return s3PublicUrl(key)!;
  const UPLOAD_ENDPOINT = "https://imgcdn.dev/api/1/upload";
  const API_KEY = "5386e05a3562c7a8f984e73401540836";
  const form = new FormData();
  form.set("key", API_KEY);
  form.set("source", body.toString("base64"));
  form.set("format", "json");
  const response = await fetch(UPLOAD_ENDPOINT, { method: "POST", body: form });
  const raw = await response.text();
  const result = JSON.parse(raw) as {
    image?: { url?: string; display_url?: string };
    url?: string;
    error?: { message?: string };
  };
  if (!response.ok)
    throw new Error(`upload failed (${response.status}): ${result.error?.message ?? raw}`);
  const url = result.image?.url ?? result.image?.display_url ?? result.url;
  if (!url) throw new Error(`response missing url: ${raw}`);
  return url;
}

export function isS3Enabled(): boolean {
  return Boolean(
    process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
  );
}

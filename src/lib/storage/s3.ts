import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type S3Env = {
  S3_BUCKET?: string;
  S3_REGION?: string;
  S3_ENDPOINT?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
  S3_PUBLIC_URL?: string;
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_ENDPOINT_URL_S3?: string;
  AWS_SESSION_TOKEN?: string;
  S3_FORCE_PATH_STYLE?: string;
  S3_SESSION_TOKEN?: string;
};

function readS3Env(env: S3Env = process.env as S3Env) {
  const bucket = env.S3_BUCKET || process.env.S3_BUCKET || process.env.AWS_BUCKET || "";
  const region =
    env.S3_REGION || env.AWS_REGION || process.env.S3_REGION || process.env.AWS_REGION || "auto";
  const endpoint =
    env.S3_ENDPOINT ||
    env.AWS_ENDPOINT_URL_S3 ||
    process.env.S3_ENDPOINT ||
    process.env.AWS_ENDPOINT_URL_S3 ||
    undefined;
  const accessKeyId =
    env.S3_ACCESS_KEY_ID ||
    env.AWS_ACCESS_KEY_ID ||
    process.env.S3_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID ||
    undefined;
  const secretAccessKey =
    env.S3_SECRET_ACCESS_KEY ||
    env.AWS_SECRET_ACCESS_KEY ||
    process.env.S3_SECRET_ACCESS_KEY ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    undefined;
  const sessionToken = process.env.S3_SESSION_TOKEN || process.env.AWS_SESSION_TOKEN || undefined;
  const publicUrl = env.S3_PUBLIC_URL || process.env.S3_PUBLIC_URL || undefined;
  const forcePathStyle =
    env.S3_FORCE_PATH_STYLE === "true" || process.env.S3_FORCE_PATH_STYLE === "true";
  if (!bucket) return null;
  if (!accessKeyId || !secretAccessKey) return null;
  return {
    bucket,
    region,
    endpoint,
    accessKeyId,
    secretAccessKey,
    sessionToken,
    publicUrl,
    forcePathStyle,
  };
}

let cached: S3Client | null = null;
let cachedKey = "";

function getClient(env: S3Env): S3Client | null {
  const cfg = readS3Env(env);
  if (!cfg) return null;
  const key = `${cfg.bucket}|${cfg.region}|${cfg.endpoint ?? ""}|${cfg.forcePathStyle}|${cfg.accessKeyId}`;
  if (cached && cachedKey === key) return cached;
  const clientConfig: S3ClientConfig = {
    region: cfg.region,
    credentials: {
      accessKeyId: cfg.accessKeyId!,
      secretAccessKey: cfg.secretAccessKey!,
      ...(cfg.sessionToken ? { sessionToken: cfg.sessionToken } : {}),
    },
    ...(cfg.endpoint ? { endpoint: cfg.endpoint } : {}),
    ...(cfg.forcePathStyle ? { forcePathStyle: true } : {}),
  };
  cached = new S3Client(clientConfig);
  cachedKey = key;
  return cached;
}

export function s3Enabled(env: S3Env = process.env as S3Env): boolean {
  return Boolean(readS3Env(env));
}

export const snapshotKey = (roomId: string, version: number) =>
  `documents/${roomId}/snapshots/${version}.bin`;
export const attachmentKey = (roomId: string, attachmentId: string) =>
  `documents/${roomId}/attachments/${attachmentId}`;
export const exportKey = (roomId: string, exportId: string, ext = "png") =>
  `documents/${roomId}/exports/${exportId}.${ext}`;

export async function s3PutObject(
  key: string,
  body: Uint8Array | ArrayBuffer | string,
  contentType: string,
  env: S3Env = process.env as S3Env,
): Promise<{ enabled: false } | { enabled: true; etag?: string }> {
  const client = getClient(env);
  const cfg = readS3Env(env);
  if (!client || !cfg) return { enabled: false };
  const buf =
    body instanceof Uint8Array
      ? body
      : body instanceof ArrayBuffer
        ? new Uint8Array(body)
        : new TextEncoder().encode(body);
  const res = await client.send(
    new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: buf, ContentType: contentType }),
  );
  return { enabled: true, etag: res.ETag };
}

export async function s3GetObject(
  key: string,
  env: S3Env = process.env as S3Env,
): Promise<Uint8Array | null> {
  const client = getClient(env);
  const cfg = readS3Env(env);
  if (!client || !cfg) return null;
  try {
    const res = await client.send(new GetObjectCommand({ Bucket: cfg.bucket, Key: key }));
    if (!res.Body) return null;
    const bytes = await res.Body.transformToByteArray();
    return bytes;
  } catch {
    return null;
  }
}

export async function s3DeleteObject(
  key: string,
  env: S3Env = process.env as S3Env,
): Promise<boolean> {
  const client = getClient(env);
  const cfg = readS3Env(env);
  if (!client || !cfg) return false;
  try {
    await client.send(new DeleteObjectCommand({ Bucket: cfg.bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

export async function s3CreatePresignedPutUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 900,
  env: S3Env = process.env as S3Env,
): Promise<string | null> {
  const client = getClient(env);
  if (!client) return null;
  const url = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: readS3Env(env)!.bucket, Key: key, ContentType: contentType }),
    { expiresIn: expiresInSeconds },
  );
  return url;
}

export async function s3CreatePresignedGetUrl(
  key: string,
  expiresInSeconds = 3600,
  env: S3Env = process.env as S3Env,
): Promise<string | null> {
  const client = getClient(env);
  if (!client) return null;
  return getSignedUrl(client, new GetObjectCommand({ Bucket: readS3Env(env)!.bucket, Key: key }), {
    expiresIn: expiresInSeconds,
  });
}

export function s3PublicUrl(key: string, env: S3Env = process.env as S3Env): string | null {
  const cfg = readS3Env(env);
  if (!cfg?.publicUrl) return null;
  const base = cfg.publicUrl.replace(/\/$/, "");
  return `${base}/${key.replace(/^\//, "")}`;
}

export async function putSnapshot(
  roomId: string,
  version: number,
  snapshot: Uint8Array,
  env: S3Env = process.env as S3Env,
) {
  if (!s3Enabled(env)) return { enabled: false as const, key: snapshotKey(roomId, version) };
  const key = snapshotKey(roomId, version);
  const res = await s3PutObject(key, snapshot, "application/octet-stream", env);
  const verified = res.enabled ? await s3GetObject(key, env) : null;
  const ok = Boolean(verified && verified.byteLength === snapshot.byteLength);
  return { enabled: true as const, key, verified: ok };
}

export async function getSnapshot(
  roomId: string,
  versionOrKey: number | string,
  env: S3Env = process.env as S3Env,
): Promise<Uint8Array | null> {
  const key = typeof versionOrKey === "number" ? snapshotKey(roomId, versionOrKey) : versionOrKey;
  return s3GetObject(key, env);
}

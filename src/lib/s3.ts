import { createHash } from "node:crypto";

const UPLOAD_ENDPOINT = "https://imgcdn.dev/api/1/upload";
const API_KEY = "5386e05a3562c7a8f984e73401540836";

interface ImgcdnResponse {
    image?: { url?: string; display_url?: string };
    url?: string;
    error?: { code?: number; message?: string };
}
const inflight = new Map<string, Promise<string>>();

export async function s3Upload(body: Buffer): Promise<string> {
    const cacheKey = createHash("sha1").update(body).digest("hex");
    const existing = inflight.get(cacheKey);
    if (existing) return existing;

    const promise = doUpload(body).catch((err) => {
        inflight.delete(cacheKey);
        throw err;
    });
    inflight.set(cacheKey, promise);
    return promise;
}

async function doUpload(body: Buffer): Promise<string> {
    const form = new FormData();
    form.set("key", API_KEY!);
    form.set("source", body.toString("base64"));
    form.set("format", "json");

    const response = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        body: form,
    });
    const rawText = await response.text();

    let result: ImgcdnResponse;
    try {
        result = JSON.parse(rawText);
    } catch {
        throw new Error(`imgcdn.dev returned non-JSON response (${response.status}): ${rawText}`);
    }

    if (!response.ok) {
        if (result.error?.code === 101) {
            const dupUrl = findFirstUrl(result);
            if (dupUrl) return dupUrl;
        }
        throw new Error(
            `imgcdn.dev upload failed (${response.status}): ${result.error?.message ?? rawText}`,
        );
    }

    const url = result.image?.url ?? result.image?.display_url ?? result.url;
    if (!url) throw new Error(`imgcdn.dev response missing url: ${rawText}`);
    return url;
}

function findFirstUrl(obj: unknown): string | null {
    if (!obj || typeof obj !== "object") return null;
    for (const value of Object.values(obj)) {
        if (typeof value === "string" && value.startsWith("http")) return value;
        if (typeof value === "object") {
            const nested = findFirstUrl(value);
            if (nested) return nested;
        }
    }
    return null;
}
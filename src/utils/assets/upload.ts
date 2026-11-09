import type { BinaryFileData, BinaryFiles } from "@excalidraw/excalidraw/types";
import { compressDataUrl } from "./compression";

/**
 * Files whose upload is already running. Excalidraw fires onChange constantly,
 * and each call re-offers every still-pending file — on a slow uplink that
 * meant several duplicate copies of the same image competing with the save
 * request, so nothing finished.
 */
const inFlightUploads = new Set<string>();

export async function uploadPendingAssets(
    canvasId: string,
    files: BinaryFiles,
    uploadFn: (
        canvasId: string,
        fileId: string,
        mimeType: string,
        base64Data: string,
    ) => Promise<{ fileId: string; url: string; mimeType: string }>,
): Promise<{ updatedFiles: BinaryFiles; hasNewUploads: boolean }> {
    if (!files || Object.keys(files).length === 0) {
        return { updatedFiles: files || {}, hasNewUploads: false };
    }

    const updated: BinaryFiles = { ...files };
    let hasNewUploads = false;

    const entries = Object.entries(files).filter(
        ([id, file]) =>
            file?.dataURL?.startsWith("data:") && !inFlightUploads.has(`${canvasId}:${id}`),
    );

    const results = await Promise.all(
        entries.map(async ([id, file]) => {
            const key = `${canvasId}:${id}`;
            inFlightUploads.add(key);
            try {
                const { dataURL, mimeType } = await compressDataUrl(file.dataURL!, file.mimeType);
                const res = await uploadFn(canvasId, id, mimeType, dataURL);
                return { id, file, res };
            } catch {
                return null;
            } finally {
                inFlightUploads.delete(key);
            }
        }),
    );

    for (const result of results) {
        if (!result?.res?.url) continue;
        const { id, file, res } = result;
        updated[id] = {
            ...file,
            dataURL: res.url as BinaryFileData["dataURL"],
            mimeType: res.mimeType as BinaryFileData["mimeType"],
        };
        hasNewUploads = true;
    }

    return { updatedFiles: updated, hasNewUploads };
}
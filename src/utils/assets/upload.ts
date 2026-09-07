import type { BinaryFileData, BinaryFiles } from "@excalidraw/excalidraw/types";
import { compressDataUrl } from "./compression";

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

    const entries = Object.entries(files).filter(([, file]) => file?.dataURL?.startsWith("data:"));

    // Compress all pending images in parallel, then upload in parallel.
    const results = await Promise.all(
        entries.map(async ([id, file]) => {
            try {
                const { dataURL, mimeType } = await compressDataUrl(file.dataURL!, file.mimeType);
                const res = await uploadFn(canvasId, id, mimeType, dataURL);
                return { id, file, res };
            } catch (err) {
                console.error(`Failed to upload asset ${id} to Supabase storage:`, err);
                return null;
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
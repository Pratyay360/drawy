import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";

export function pruneUnusedFiles(
    files: BinaryFiles | undefined,
    elements: readonly ExcalidrawElement[],
): BinaryFiles {
    if (!files || Object.keys(files).length === 0) return {};
    const usedFileIds = new Set<string>();
    for (const el of elements) {
        if (el.type === "image" && "fileId" in el && el.fileId) {
            usedFileIds.add(el.fileId);
        }
    }
    const pruned: BinaryFiles = {};
    for (const [id, file] of Object.entries(files)) {
        if (usedFileIds.has(id)) {
            pruned[id] = file;
        }
    }
    return pruned;
}
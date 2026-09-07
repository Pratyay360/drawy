import type { LibraryItem } from "@excalidraw/excalidraw/types";

export function getItemName(
    item: LibraryItem | undefined,
    index: number,
    itemNames: string[],
): string {
    return item?.name?.trim() || itemNames?.[index]?.trim() || `Item ${index + 1}`;
}

export function getItemSearchText(
    item: LibraryItem | undefined,
    index: number,
    itemNames: string[],
): string {
    const parts: string[] = [];
    if (item?.name?.trim()) parts.push(item.name);
    if (itemNames?.[index]?.trim()) parts.push(itemNames[index]);
    if (Array.isArray(item?.elements)) {
        for (const element of item.elements) {
            if (element?.type === "text" && element?.text) {
                parts.push(element.text);
            } else if (element?.type === "arrow" && element?.label?.text) {
                parts.push(element.label.text);
            }
        }
    }
    return parts.join(" ").toLowerCase();
}
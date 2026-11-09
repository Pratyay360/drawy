import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type * as Y from "yjs";

const ELEMENTS_KEY = "elements";

function elementsArray(doc: Y.Doc) {
    return doc.getArray<string>(ELEMENTS_KEY);
}

export function applyElementsToDoc(
    doc: Y.Doc,
    elements: readonly ExcalidrawElement[],
    origin: unknown = null,
) {
    const yArr = elementsArray(doc);
    doc.transact(() => {
        const incoming = new Map(elements.map((e) => [e.id, e]));
        yArr.forEach((s: string, idx: number) => {
            try {
                const e = JSON.parse(s) as ExcalidrawElement;
                const next = incoming.get(e.id);
                if (next) {
                    yArr.delete(idx, 1);
                    yArr.insert(idx, [JSON.stringify(next)]);
                    incoming.delete(e.id);
                }
            } catch {}
        });
        if (incoming.size > 0) yArr.push([...incoming.values()].map((e) => JSON.stringify(e)));
    }, origin);
}

export function hydrateElements(doc: Y.Doc): ExcalidrawElement[] {
    const out: ExcalidrawElement[] = [];
    for (const s of elementsArray(doc).toArray()) {
        try {
            out.push(JSON.parse(s) as ExcalidrawElement);
        } catch {}
    }
    return out;
}
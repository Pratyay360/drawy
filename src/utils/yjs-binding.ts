import * as Y from "yjs";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";

export const Y_MAP_ELEMENTS = "elements";
export const Y_MAP_META = "meta";

function ensureMaps(doc: Y.Doc) {
  return {
    elements: doc.getArray<string>(Y_MAP_ELEMENTS),
    meta: doc.getMap(Y_MAP_META),
  };
}

export function serializeElements(elements: readonly ExcalidrawElement[]): string[] {
  return elements.map((e) => JSON.stringify(e));
}

export function deserializeElements(strs: string[]): ExcalidrawElement[] {
  const out: ExcalidrawElement[] = [];
  for (const s of strs) {
    try { out.push(JSON.parse(s) as ExcalidrawElement); } catch {}
  }
  return out;
}

export function applyElementsToDoc(doc: Y.Doc, elements: readonly ExcalidrawElement[], origin: unknown = null) {
  const { elements: yArr } = ensureMaps(doc);
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

export function removeElementFromDoc(doc: Y.Doc, id: string) {
  const { elements: yArr } = ensureMaps(doc);
  const toDelete: number[] = [];
  yArr.forEach((s: string, idx: number) => { try { if ((JSON.parse(s) as ExcalidrawElement).id === id) toDelete.push(idx); } catch {} });
  for (const idx of [...toDelete].reverse()) yArr.delete(idx, 1);
}

export function clearDoc(doc: Y.Doc) {
  const { elements: yArr } = ensureMaps(doc);
  doc.transact(() => { if (yArr.length > 0) yArr.delete(0, yArr.length); });
}

export function hydrateElements(doc: Y.Doc): ExcalidrawElement[] {
  return deserializeElements(ensureMaps(doc).elements.toArray());
}

export function setMeta(doc: Y.Doc, key: string, value: unknown) {
  ensureMaps(doc).meta.set(key, value as never);
}

export function getMeta<T>(doc: Y.Doc, key: string): T | undefined {
  return ensureMaps(doc).meta.get(key) as T | undefined;
}

export function elementsToYArray(elements: readonly ExcalidrawElement[]): string[] {
  return serializeElements(elements);
}

export function diffDocForExcalidraw(doc: Y.Doc, localElements: readonly ExcalidrawElement[], _localFiles?: BinaryFiles) {
  // Returns elements to be passed to excalidrawAPI.updateScene if different
  void _localFiles;
  const remote = hydrateElements(doc);
  if (remote.length === 0) return null;
  const byId = new Map(remote.map((e) => [e.id, e] as const));
  for (const e of localElements) byId.set(e.id, e);
  return [...byId.values()];
}

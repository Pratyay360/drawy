import { File } from "node:buffer";

if ("File" in globalThis && globalThis.File === undefined) {
    // SAFETY: Node's `buffer` File is API-compatible with the browser File constructor.
    globalThis.File = File as any;
}
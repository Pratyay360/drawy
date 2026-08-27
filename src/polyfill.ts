import { File } from "node:buffer";

if ("File" in globalThis && globalThis.File === undefined) {
	globalThis.File = File as any;
}

/**
 * Detects client-disconnect errors (browser navigated away / cancelled the
 * request mid-flight). Node aborts the incoming stream (`abortIncoming`,
 * `ECONNRESET`) and the framework surfaces it as a 500 — but there is nothing
 * to fix, so callers should skip logging these.
 */
export function isClientDisconnect(error: unknown): boolean {
	const candidates: unknown[] = [error];
	if (typeof error === "object" && error !== null && "cause" in error) {
		candidates.push((error as { cause?: unknown }).cause);
	}
	return candidates.some((candidate) => {
		if (typeof candidate !== "object" || candidate === null) return false;
		const record = candidate as Record<string, unknown>;
		return (
			record.code === "ECONNRESET" ||
			record.name === "AbortError" ||
			record.message === "aborted"
		);
	});
}

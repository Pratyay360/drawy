export interface UpdateInfo {
	version: string;
	notes?: string;
}

/**
 * The web build ships from the server, so there is no auto-updater.
 * These stubs keep the (optional) update prompt wired up without
 * ever firing; a native/desktop build can implement them for real.
 */
export function onUpdateAvailable(
	_callback: (info: UpdateInfo) => void,
): () => void {
	return () => {};
}

export async function installUpdate(_version: string): Promise<void> {}

export async function skipUpdate(_version: string): Promise<void> {}

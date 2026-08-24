const USERNAME_RE = /^[a-z0-9_-]+$/;

export function normalizeUsername(username: string): string {
	return username.trim().toLowerCase();
}

export function usernameError(username: string): string | null {
	const normalized = normalizeUsername(username);
	if (normalized.length < 3 || normalized.length > 32) {
		return "Username must be 3–32 characters.";
	}
	if (!USERNAME_RE.test(normalized)) {
		return "Username may only contain letters, numbers, underscores, and dashes.";
	}
	return null;
}

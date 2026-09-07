const USERNAME_RE = /^[a-z0-9_-]+$/;

export function normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
}

export function usernameError(username: string): string | null {
    const normalized = normalizeUsername(username);
    if (!USERNAME_RE.test(normalized)) {
        return "Username may only contain letters, numbers, underscores, and dashes.";
    }
    return null;
}
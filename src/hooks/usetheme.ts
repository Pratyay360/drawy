import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "drawy-theme";

const SERVER_THEME: Theme = "light";

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "light";

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	return prefersDark ? "dark" : "light";
}

function applyTheme(theme: Theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.dataset.theme = theme;
	root.style.colorScheme = theme;
}

// Module-level store shared by every useTheme() consumer, so toggling the
// theme from one place (e.g. the sidebar) re-renders all others (e.g. the
// canvas) and keeps them in sync.
let currentTheme: Theme = getInitialTheme();
const listeners = new Set<() => void>();

applyTheme(currentTheme);

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function setThemeInternal(next: Theme) {
	if (next === currentTheme) return;
	currentTheme = next;
	applyTheme(next);
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Ignore storage errors (e.g. private browsing).
	}
	for (const listener of listeners) {
		listener();
	}
}

export function useTheme() {
	const theme = useSyncExternalStore(
		subscribe,
		() => currentTheme,
		// The server has no localStorage/matchMedia, so it always renders
		// SERVER_THEME. Returning the same value here keeps the hydration pass in
		// agreement with the server HTML; React re-checks the client snapshot
		// right after hydration and re-renders if the real theme differs.
		() => SERVER_THEME,
	);

	const setTheme = useCallback((next: Theme) => {
		setThemeInternal(next);
	}, []);

	const toggleTheme = useCallback(() => {
		setThemeInternal(currentTheme === "dark" ? "light" : "dark");
	}, []);

	return { theme, setTheme, toggleTheme };
}

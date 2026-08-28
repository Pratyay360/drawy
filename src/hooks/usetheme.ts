import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "drawy-theme";

const SERVER_THEME: Theme = "light";

function getInitialTheme(): Theme {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "light" || stored === "dark") {
			return stored;
		}

		const prefersDark = matchMedia
			? matchMedia("(prefers-color-scheme: dark)").matches
			: false;
		return prefersDark ? "dark" : "light";
	} catch {
		return SERVER_THEME;
	}
}

function applyTheme(theme: Theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.dataset.theme = theme;
	root.style.colorScheme = theme;
}

let currentTheme: Theme;

function getCurrentTheme(): Theme {
	if (currentTheme === undefined) {
		currentTheme = getInitialTheme();
	}
	return currentTheme;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function setThemeInternal(next: Theme) {
	if (next === getCurrentTheme()) return;
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
		getCurrentTheme,
		() => SERVER_THEME,
	);

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		setThemeInternal(next);
	}, []);

	const toggleTheme = useCallback(() => {
		setThemeInternal(getCurrentTheme() === "dark" ? "light" : "dark");
	}, []);

	return { theme, setTheme, toggleTheme };
}

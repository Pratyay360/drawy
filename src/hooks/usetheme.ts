import { useCallback, useEffect, useSyncExternalStore } from "react";
import { isThemeName, type ThemeName, themeRegistry } from "../themes/index.ts";

export type ColorMode = "light" | "dark";
/** Persisted preference — "system" follows the OS and resolves to light/dark. */
export type ModePreference = ColorMode | "system";

const STORAGE_KEY = "drawy-theme";

const SERVER_THEME: ThemeName = "butter";
const SERVER_MODE: ModePreference = "light";

/**
 * Resolves a mode preference against the selected theme.
 * Dark-only themes (gothic) force dark regardless of the preference, so the
 * persisted preference survives switching back to a theme with both modes.
 */
function getEffectiveMode(name: ThemeName, preference: ModePreference): ColorMode {
    if (themeRegistry[name]?.darkOnly) return "dark";
    if (preference === "system") {
        const prefersDark = matchMedia ? matchMedia("(prefers-color-scheme: dark)").matches : false;
        return prefersDark ? "dark" : "light";
    }
    return preference;
}

function applyDocumentState(name: ThemeName, mode: ColorMode) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.dataset.theme = mode;
    root.dataset.appTheme = name;
    root.style.colorScheme = mode;
}

function readStoredName(): ThemeName {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return SERVER_THEME; // legacy value — ignore
        if (isThemeName(stored)) return stored;
    } catch {
        // Ignore storage errors (e.g. private browsing).
    }
    return SERVER_THEME;
}

function readStoredMode(): ModePreference {
    try {
        const stored = localStorage.getItem(`${STORAGE_KEY}-mode`);
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }
    } catch {
        // Ignore storage errors (e.g. private browsing).
    }
    return "system";
}

interface ThemeState {
    name: ThemeName;
    modePreference: ModePreference;
}

let state: ThemeState = {
    name: SERVER_THEME,
    modePreference: SERVER_MODE,
};

let initialized = false;

function ensureInitialized() {
    if (initialized) return;
    initialized = true;
    state = {
        name: readStoredName(),
        modePreference: readStoredMode(),
    };
}

function getSnapshot(): ThemeState {
    ensureInitialized();
    return state;
}

function getServerSnapshot(): ThemeState {
    return { name: SERVER_THEME, modePreference: SERVER_MODE };
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, state.name);
        localStorage.setItem(`${STORAGE_KEY}-mode`, state.modePreference);
    } catch {
        // Ignore storage errors (e.g. private browsing).
    }
}

function setStateInternal(next: Partial<ThemeState>) {
    const merged = { ...getSnapshot(), ...next };
    if (merged.name === state.name && merged.modePreference === state.modePreference) {
        return;
    }
    state = merged;
    persist();
    applyDocumentState(state.name, getEffectiveMode(state.name, state.modePreference));
    for (const listener of listeners) {
        listener();
    }
}

/**
 * Tracks the selected app theme name and color-mode preference.
 * The Astryx `<Theme>` provider consumes both via AppThemeProvider.
 */
export function useTheme() {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Keep the document attributes in sync on the client.
    useEffect(() => {
        applyDocumentState(snapshot.name, getEffectiveMode(snapshot.name, snapshot.modePreference));
    }, [snapshot.name, snapshot.modePreference]);

    const setThemeName = useCallback((name: ThemeName) => {
        setStateInternal({ name });
    }, []);

    const setMode = useCallback((mode: ModePreference) => {
        setStateInternal({ modePreference: mode });
    }, []);

    const toggleMode = useCallback(() => {
        const current = getEffectiveMode(getSnapshot().name, getSnapshot().modePreference);
        setStateInternal({ modePreference: current === "dark" ? "light" : "dark" });
    }, []);

    return {
        themeName: snapshot.name,
        modePreference: snapshot.modePreference,
        /** Effective color mode after applying dark-only themes and "system". */
        mode: getEffectiveMode(snapshot.name, snapshot.modePreference),
        setThemeName,
        setMode,
        toggleMode,
    };
}

// Re-render + re-apply document state when the OS preference flips while
// the user's preference is "system".
if (typeof matchMedia !== "undefined") {
    const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener?.("change", () => {
        if (state.modePreference !== "system") return;
        applyDocumentState(state.name, getEffectiveMode(state.name, state.modePreference));
        for (const listener of listeners) {
            listener();
        }
    });
}
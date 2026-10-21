import type { DefinedTheme } from "@astryxdesign/core/theme";
import { matchaTheme } from "@astryxdesign/theme-matcha";
import { neutralTheme } from "@astryxdesign/theme-neutral";
import { stoneTheme } from "@astryxdesign/theme-stone";
import { y2kTheme } from "@astryxdesign/theme-y2k";
import { butterTheme } from "./butter/butterTheme";
import { gothicTheme } from "./gothic/gothicTheme";

export interface ThemeEntry {
    label: string;
    description: string;
    /** True when the theme only looks right in dark mode. */
    darkOnly: boolean;
    theme: DefinedTheme;
}

/**
 * Selectable app themes, keyed by the name persisted to localStorage.
 * Gothic is dark-only — the mode is forced to "dark" for it
 * (see getEffectiveMode in hooks/usetheme.ts).
 */
export const themeRegistry = {
    butter: {
        label: "Butter",
        description: "Warm, golden surfaces with blue accents",
        darkOnly: false,
        theme: butterTheme,
    },
    neutral: {
        label: "Neutral",
        description: "Muted, minimal warm grays",
        darkOnly: false,
        theme: neutralTheme,
    },
    matcha: {
        label: "Matcha",
        description: "Earthy greens with a calm, organic feel",
        darkOnly: false,
        theme: matchaTheme,
    },
    stone: {
        label: "Stone",
        description: "Warm stone and slate, understated",
        darkOnly: false,
        theme: stoneTheme,
    },
    y2k: {
        label: "Y2K",
        description: "Hot pinks and lime — bubbly retro pop",
        darkOnly: false,
        theme: y2kTheme,
    },
    gothic: {
        label: "Gothic",
        description: "Dark-only, atmospheric ink & manuscript",
        darkOnly: true,
        theme: gothicTheme,
    },
} satisfies Record<string, ThemeEntry>;

export type ThemeName = keyof typeof themeRegistry;

export const themeNames = Object.keys(themeRegistry) as ThemeName[];

export function isThemeName(value: string | null | undefined): value is ThemeName {
    return typeof value === "string" && value in themeRegistry;
}
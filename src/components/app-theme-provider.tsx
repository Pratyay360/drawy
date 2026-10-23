import { Theme } from "@astryxdesign/core";
import { useTheme } from "../hooks/usetheme";
import { themeRegistry } from "../themes/index";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const { themeName, modePreference } = useTheme();
    const entry = themeRegistry[themeName];
    return (
        <Theme theme={entry.theme} mode={entry.darkOnly ? "dark" : modePreference}>
            {children}
        </Theme>
    );
}
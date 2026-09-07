import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { Icon } from "@astryxdesign/core/Icon";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "../hooks/usetheme";
import { type ThemeName, themeNames, themeRegistry } from "../themes/index.ts";

/**
 * Theme picker: switches the app theme (Butter / Neutral / Gothic) and the
 * color mode (light / dark / system) from the sidebar footer.
 */
export function ThemeToggle() {
    const { themeName, modePreference, setThemeName, setMode } = useTheme();
    const current = themeRegistry[themeName];

    const checkFor = (selected: boolean) =>
        selected ? <Icon icon={Check} size="sm" /> : undefined;

    return (
        <DropdownMenu
            button={{
                label: "Theme",
                tooltip: "Theme",
                icon: <Icon icon={Palette} size="sm" />,
                variant: "ghost",
                isIconOnly: true,
                size: "sm",
            }}
            hasChevron={false}
            placement="above"
            menuWidth={240}
            items={[
                {
                    type: "section",
                    title: "Theme",
                    id: "theme",
                    items: themeNames.map((name: ThemeName) => {
                        const entry = themeRegistry[name];
                        return {
                            id: name,
                            label: entry.label,
                            description: entry.description,
                            onClick: () => setThemeName(name),
                            endContent: checkFor(name === themeName),
                        };
                    }),
                },
                {
                    type: "section",
                    title: "Mode",
                    id: "mode",
                    items: [
                        {
                            id: "light",
                            label: "Light",
                            icon: <Icon icon={Sun} size="sm" />,
                            onClick: () => setMode("light"),
                            isDisabled: current.darkOnly,
                            endContent: checkFor(modePreference === "light"),
                        },
                        {
                            id: "dark",
                            label: "Dark",
                            icon: <Icon icon={Moon} size="sm" />,
                            onClick: () => setMode("dark"),
                            endContent: checkFor(modePreference === "dark"),
                        },
                        {
                            id: "system",
                            label: "System",
                            icon: <Icon icon={Monitor} size="sm" />,
                            onClick: () => setMode("system"),
                            isDisabled: current.darkOnly,
                            endContent: checkFor(modePreference === "system"),
                        },
                    ],
                },
            ]}
        />
    );
}
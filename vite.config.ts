import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

function excalidrawSsrPlugin() {
    const virtualModuleId = "virtual:excalidraw-ssr-stub";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    return {
        name: "vite-plugin-excalidraw-ssr",
        enforce: "pre" as const,
        resolveId(id: string, _importer: string | undefined, options?: { ssr?: boolean }) {
            if (
                options?.ssr &&
                (id === "@excalidraw/excalidraw" || id.startsWith("@excalidraw/excalidraw/"))
            ) {
                return resolvedVirtualModuleId;
            }
            return null;
        },
        load(id: string) {
            if (id === resolvedVirtualModuleId) {
                return `
export const Excalidraw = () => null;
export const MainMenu = Object.assign(() => null, {
    Item: () => null,
    ItemLink: () => null,
    Group: () => null,
    Separator: () => null,
    DefaultItems: {
        SaveAsImage: () => null,
        Export: () => null,
        ClearCanvas: () => null,
        ToggleTheme: () => null,
        ChangeCanvasBackground: () => null,
        Help: () => null,
        LoadScene: () => null,
    },
});
export const WelcomeScreen = Object.assign(() => null, {
    Center: Object.assign(() => null, {
        Heading: () => null,
        Menu: () => null,
        MenuItem: () => null,
        MenuItemLink: () => null,
        MenuItemHelp: () => null,
        MenuItemLoadScene: () => null,
    }),
    Hints: Object.assign(() => null, {
        MenuHint: () => null,
        ToolbarHint: () => null,
        HelpHint: () => null,
    }),
});
export const DefaultSidebar = () => null;
export const Sidebar = Object.assign(() => null, {
    Header: () => null,
    Tab: () => null,
    TabTriggers: () => null,
    TabTrigger: () => null,
});
export const exportToBlob = async () => new Blob();
export const exportToSvg = async () => ({});
export const restoreLibraryItems = (items) => items || [];
export const mergeLibraryItems = (a = [], b = []) => [...a, ...b];
export const captureUpdateAction = { NEVER: "never" };
export default Excalidraw;
`;
            }
            return null;
        },
    };
}

const config = defineConfig({
    server: {
        allowedHosts: true,
    },
    resolve: { tsconfigPaths: true },
    plugins: [
        excalidrawSsrPlugin(),
        devtools(),
        nitro({
            preset: "netlify",
        }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
        babel({ presets: [reactCompilerPreset()] }),
    ],
});

export default config;
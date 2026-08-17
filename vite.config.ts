import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

const config = defineConfig({
    fmt: {},
    lint: {
        jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
        rules: { "vite-plus/prefer-vite-plus-imports": "error" },
        options: { typeAware: true, typeCheck: true },
    },
    resolve: { tsconfigPaths: true },
    plugins: lazyPlugins(() => [
        devtools(),
        nitro({
            preset: "netlify",
            rollupConfig: {
                // Keep Excalidragon out of the SSR/server bundle. Its module touches
                // `window` at top level, and the bundler otherwise merges shared deps
                // (e.g. zustand) into its chunk, which @tanstack/react-router then
                // pulls in during SSR and crashes with "window is not defined".
                external: [/^@sentry\//, /^@excalidraw\//],
            },
        }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
        babel({ presets: [reactCompilerPreset()] }),
    ]),
});

export default config;
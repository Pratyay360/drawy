import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
    envPrefix: ["VITE_"],

    server: {
        allowedHosts: true,
    },

    ssr: {
        external: ["@excalidraw/excalidraw", "@excalidraw/laser-pointer"],
        noExternal: [],
    },

    plugins: [
        tanstackStart(),
        react(),
        tailwindcss(),
        nitro({
            preset: "netlify",
            // Emit server-bundle source maps so Sentry can un-minify server stack traces.
            sourcemap: true,
            rollupConfig: {
                external: [/@excalidraw\/excalidraw/, /@excalidraw\/laser-pointer/]
            },
        }),
        // Keep Sentry last so its build-time plugins see the final output.
        // It also enables hidden source maps and deletes them after upload.
        sentryTanstackStart({
            org: "self-v0w",
            project: "drawysupabase",
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
    ],
});

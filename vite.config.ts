import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { nitro } from "nitro/vite";

/**
 * Excalidraw reads `window` and `document` at module scope, so evaluating it in
 * the Worker throws `ReferenceError: window is not defined`. Every runtime
 * import of it is a client-only dynamic import inside an effect, so the SSR
 * environment gets an empty stub instead.
 *
 * This is not only about bundle size: Nitro hoists the shared `unenv`
 * polyfills (`globalthis`, `performance`) into the Excalidraw library chunk, and
 * every SSR chunk imports those polyfills. That static import made the server
 * entry evaluate the whole Excalidraw bundle on boot and every request 500'd.
 */
function excalidrawServerStub(): Plugin {
    const stubId = "\0drawy:excalidraw-server-stub";
    const entries = new Set(["@excalidraw/excalidraw", "@excalidraw/excalidraw/index"]);

    return {
        name: "drawy:excalidraw-server-stub",
        enforce: "pre",
        applyToEnvironment: (environment) => environment.name === "ssr",
        resolveId(source) {
            return entries.has(source) ? stubId : null;
        },
        load(id) {
            return id === stubId ? "export default {};" : null;
        },
    };
}

export default defineConfig({
    server: {
        allowedHosts: true,
    },

    environments: {
        ssr: {
            build: {
                // "hidden" writes the source maps but omits the //# sourceMappingURL
                // comment. Sentry still uploads them, and Wrangler does not try to
                // re-upload maps that the Sentry plugin already deleted.
                sourcemap: "hidden",
            },
        },
    },

    plugins: [
        excalidrawServerStub(),
        // The Cloudflare plugin owns the "ssr" environment: it runs the Worker in
        // workerd and bundles every dependency into it. It rejects
        // `ssr.resolve.external`, so Excalidraw can no longer be externalised the
        // way it was for the old Netlify preset.
        //
        // ssr: cloudflare({
        //   viteEnvironment: {
        //     name: "ssr"
        //   }
        // }),
        nitro({
            preset: "cloudflare_module",
            // Emit server-bundle source maps so Sentry can un-minify server stack traces.
            sourcemap: true,
            features: {
                websocket: true,
            },
        }),
        tanstackStart(),
        react(),
        tailwindcss(),
        // Keep Sentry last so its build-time plugins see the final output.
        // It also enables hidden source maps and deletes them after upload.
        sentryTanstackStart({
            org: "self-v0w",
            project: "drawysupabase",
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
    ],
});
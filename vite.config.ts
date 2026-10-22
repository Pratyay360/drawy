import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { nitro } from "nitro/vite";

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

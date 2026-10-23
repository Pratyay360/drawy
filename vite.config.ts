import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
// biome-ignore lint/correctness/noUnusedImports: defineConfig from vite vs vite-plus-core alias mismatch – suppressed
import { defineConfig } from "vite-plus";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000,
  },
  server: {
    allowedHosts: true,
    proxy: (() => {
      const target = process.env.VITE_PARTYKIT_URL!;
      // const normalized = target.includes("://") ? target : `http://${target}`;
      return {
        "/parties": {
          target: target,
          ws: true,
          changeOrigin: true,
        },
      };
    })(),
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
      preset: "cloudflare_module",
      // Emit server-bundle source maps so Sentry can un-minify server stack traces.
      sourcemap: true,
      features: {
        websocket: true,
      },
      rollupConfig: {
        external: ["@excalidraw/excalidraw", "@excalidraw/laser-pointer"],
        output: {
          banner:
            "if(typeof globalThis.requestAnimationFrame==='undefined')globalThis.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),0);if(typeof globalThis.cancelAnimationFrame==='undefined')globalThis.cancelAnimationFrame=id=>clearTimeout(id);try{var requestAnimationFrame=globalThis.requestAnimationFrame;var cancelAnimationFrame=globalThis.cancelAnimationFrame;}catch(e){}",
        },
      },
    }),
    // Keep Sentry last so its build-time plugins see the final output.
    sentryTanstackStart({
      org: "self-v0w",
      project: "drawyparty",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
} as unknown as Parameters<typeof defineConfig>[0]);

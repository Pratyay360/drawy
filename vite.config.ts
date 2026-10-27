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
      const configured = process.env.VITE_SITE_URL!;
      const target = configured
        ? /^https?:\/\//.test(configured)
          ? configured
          : `http://${configured}`
        : "http://localhost:8787";
      return {
        "/parties": {
          target,
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
      cloudflare: { deployConfig: false },
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

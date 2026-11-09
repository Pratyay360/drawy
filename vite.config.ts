import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
    build: {
        chunkSizeWarningLimit: 9999,
        fmt: {
            minify: true,
        },
    },
    server: {
        allowedHosts: true,
    },
    resolve: {},
    ssr: {
        resolve: {
            external: ["@excalidraw/excalidraw"],
        },
    },
    environments: {
        client: {
            resolve: {},
        },
        ssr: {
            resolve: {
                external: ["@excalidraw/excalidraw"],
            },
        },
        nitro: {
            resolve: {
                external: ["@excalidraw/excalidraw"],
            },
        },
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
                external: ["yjs"],
                output: {
                    banner: "if(typeof globalThis.requestAnimationFrame==='undefined')globalThis.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),0);if(typeof globalThis.cancelAnimationFrame==='undefined')globalThis.cancelAnimationFrame=id=>clearTimeout(id);try{var requestAnimationFrame=globalThis.requestAnimationFrame;var cancelAnimationFrame=globalThis.cancelAnimationFrame;}catch(e){}",
                },
            },
        }),
        sentryTanstackStart({
            org: "self-v0w",
            project: "drawy",
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
    ],
} as unknown as Parameters<typeof defineConfig>[0]);

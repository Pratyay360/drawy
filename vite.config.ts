import { sentryVitePlugin } from "@sentry/vite-plugin";
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

    plugins: [tanstackStart(), sentryTanstackStart({
        org: "self-v0w",
        project: "drawysupabase",
        authToken: process.env.SENTRY_AUTH_TOKEN,
    }), react(), tailwindcss(), nitro({
        preset: "netlify",
        rollupConfig: {
            external: [/@excalidraw\/excalidraw/, /@excalidraw\/laser-pointer/],
            output: {
                banner:
                    "if(typeof globalThis.requestAnimationFrame==='undefined')globalThis.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),0);if(typeof globalThis.cancelAnimationFrame==='undefined')globalThis.cancelAnimationFrame=id=>clearTimeout(id);try{var requestAnimationFrame=globalThis.requestAnimationFrame;var cancelAnimationFrame=globalThis.cancelAnimationFrame;}catch(e){}",
            },
        },
    }), sentryVitePlugin({
        org: "self-v0w",
        project: "drawysupabase"
    })],

    build: {
        sourcemap: true
    }
});

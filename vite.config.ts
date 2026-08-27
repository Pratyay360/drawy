import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

const config = defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [
    nitro({
      preset: "netlify",
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact,
  ],
});

export default config;

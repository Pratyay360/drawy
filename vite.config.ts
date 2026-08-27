import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
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
		react(),
		// devtools(),
	],
});

export default config;

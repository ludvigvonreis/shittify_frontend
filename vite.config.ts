import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [TanStackRouterVite({}), react()],
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "src/components"),
			"@assets": path.resolve(__dirname, "src/assets"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@atoms": path.resolve(__dirname, "src/atoms"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
		},
	},
	server: {
		headers: {
			"Access-Control-Allow-Origin": "*", // Allow requests from any origin
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allowed HTTP methods
			"Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
			"Access-Control-Allow-Credentials": "true", // Allow credentials (e.g., cookies, authorization headers)
			
		},
	},
});

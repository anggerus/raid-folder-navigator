import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages publishes this project under /raid-folder-navigator/
export default defineConfig({
  plugins: [react()],
  base: "/raid-folder-navigator/",
});

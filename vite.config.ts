import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/emoji-calendar/",  // <- agrega esto
  build: {
    outDir: "dist"  // o "build" si cambiaste el outDir
  }
});

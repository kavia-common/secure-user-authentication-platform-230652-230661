import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PUBLIC_INTERFACE
export default defineConfig({
  /** Vite configuration for the frontend app. */
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  preview: {
    host: true,
    port: 3000
  }
});

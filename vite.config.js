import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:2000",
        target: "https://drive-backendd.vercel.app/",

        changeOrigin: true,
        secure: false,
      },
    },
  },
});

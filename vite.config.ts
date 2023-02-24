import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@molecules",
        replacement: resolve(__dirname, ".", "src/components/molecules"),
      },
      {
        find: "@atoms",
        replacement: resolve(__dirname, ".", "src/components/atoms"),
      },
      {
        find: "@views",
        replacement: resolve(__dirname, ".", "src/components/views"),
      },
      {
        find: "@constants",
        replacement: resolve(__dirname, ".", "src/constants"),
      },
      {
        find: "@contexts",
        replacement: resolve(__dirname, ".", "src/contexts"),
      },
    ],
  },
});

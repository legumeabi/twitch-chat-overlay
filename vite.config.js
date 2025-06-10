import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3001,
    },
  },
});

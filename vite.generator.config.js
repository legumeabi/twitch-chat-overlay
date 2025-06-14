import { join } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ command }) => {
  const isDevelopment = command === "serve";

  // Development server settings
  const serverConfig = isDevelopment
    ? {
        server: {
          port: 3000,
          strictPort: true,
          hmr: {
            port: 3001,
          },
        },
      }
    : {};

  // Build settings based on the environment
  const buildConfig = {
    outDir: join(projectRoot, "public"),
    emptyOutDir: true,
    minify: !isDevelopment,
    sourcemap: isDevelopment,
  };

  return {
    root: "src/generator",
    build: buildConfig,
    ...serverConfig,
  };
});

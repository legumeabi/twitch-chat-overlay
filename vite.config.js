import { join } from "path";
import { fileURLToPath } from "url";
import { viteSingleFile } from "vite-plugin-singlefile";
import { preserveConfigScript } from "./vite.config.plugin.js";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

// Configuration for building the single-file overlay
export default {
  plugins: [preserveConfigScript(), viteSingleFile()],
  publicDir: false,
  root: join(projectRoot, "src"),
  build: {
    outDir: join(projectRoot, "dist"),
  },
};

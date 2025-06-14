import { join } from "path";
import { fileURLToPath } from "url";
import { viteSingleFile } from "vite-plugin-singlefile";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

// Configuration for building the single-file overlay
export default {
  plugins: [viteSingleFile()],
  publicDir: false,
  root: join(projectRoot, "src/overlay"),
  build: {
    write: false,
  },
};

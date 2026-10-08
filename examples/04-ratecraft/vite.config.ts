import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solidStart(), nitro()],
  nitro: {
    preset: "bun",
    prerender: { routes: ["/"], concurrency: 1, failOnError: true },
  },
});

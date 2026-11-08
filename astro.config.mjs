import { defineConfig } from "astro/config";

// Static output: Cloudflare Pages serves ./dist as is.
export default defineConfig({
  output: "static",
});

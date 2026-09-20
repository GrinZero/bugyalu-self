import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [
    react(),
    mdx(),
    {
      name: "isolated-vite-cache",
      hooks: {
        "astro:config:setup": ({ command, updateConfig }) => {
          // A build must not replace dependency metadata used by a running dev server.
          updateConfig({ vite: { cacheDir: `./node_modules/.vite/astro-${command}` } });
        },
      },
    },
  ],
  redirects: {
    "/work": "/about",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

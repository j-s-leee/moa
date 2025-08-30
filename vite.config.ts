import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    // Custom plugin to handle Chrome DevTools requests
    {
      name: "handle-chrome-devtools",
      configureServer(server) {
        server.middlewares.use(
          "/.well-known/appspecific/com.chrome.devtools.json",
          (req: any, res: any, next: any) => {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end("{}");
          }
        );
      },
    },
  ],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
});

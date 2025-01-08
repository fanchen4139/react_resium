import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import cesium from "vite-plugin-cesium";
import glsl from "vite-plugin-glsl";
// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root: string = process.cwd();
  const env: Record<string, string> = loadEnv(mode, root);
  return {
    base: "./",
    resolve: {
      // extensions: ['.ts', '.tsx'],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react(), cesium(), glsl()],
    server: {
      proxy: {
        "/map": {
          target: `${env.VITE_BASE_URL}/map`,
          changeOrigin: true,
          ws: true,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("User-Agent", "YourAppName/1.0");
            });
          },
          rewrite: (path) => {
            return path.replace(/^\/map/, "");
          },
          // https is require secure=false
          ...(/^https:\/\//.test(env.VITE_BASE_URL) ? { secure: false } : {}),
        },
        "/openstreetmap": {
          target: "https://wprd02.is.autonavi.com/",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => {
            return path.replace(/^\/openstreetmap/, "");
          },
          secure: false,
          // https is require secure=false
          ...(/^https:\/\//.test(env.VITE_BASE_URL) ? { secure: false } : {}),
        },
        "/newmodel": {
          target: `${env.VITE_BASE_URL}/newmodel/b3dm`,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => {
            return path.replace(/^\/newmodel/, "");
          },
          // https is require secure=false
          ...(/^https:\/\//.test(env.VITE_BASE_URL) ? { secure: false } : {}),
        },
      },
    },
    build: {
      sourcemap: true,
    },
  };
});

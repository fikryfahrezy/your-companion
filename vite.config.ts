import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig((config) => {
  return {
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: {
      tsconfigPaths: true,
      ...(config.command === "build"
        ? {
            alias: {
              "react-dom/server": "react-dom/server.node",
            },
          }
        : undefined),
    },
  };
});

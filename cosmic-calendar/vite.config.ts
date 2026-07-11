import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base:
    (globalThis as { process?: { env?: { BASE_PATH?: string } } }).process
      ?.env?.BASE_PATH ?? "/",
  plugins: [react()],
});

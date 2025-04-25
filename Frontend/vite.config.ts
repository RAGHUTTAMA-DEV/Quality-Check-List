import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias for `@/`
    },
  },
  server: {
    allowedHosts: [
      
      'localhost',
      'limitation-improving-pages-sudden.trycloudflare.com',
      'cookie-tag-valued-yang.trycloudflare.com'
    ]
  }
});

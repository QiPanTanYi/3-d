import { defineConfig } from "vite"
import preact from "@preact/preset-vite"

export default defineConfig({
  plugins: [preact()],
  server: {
    host: true,
    port: 80,
  },
  base: process.env.GITHUB_ACTIONS ? '/3-d/' : '/',
})

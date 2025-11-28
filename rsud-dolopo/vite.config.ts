import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Define process.env.API_KEY for the Gemini SDK requirements.
      // We use JSON.stringify to ensure it's treated as a string value in the build.
      // We do NOT overwrite process.env entirely to avoid breaking other libraries.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      outDir: 'dist',
      // Ensure we target modern browsers that support ES modules
      target: 'esnext',
    }
  }
})
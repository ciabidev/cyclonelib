import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
// vite.config.js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      sveltekit(),
      Icons({
        compiler: 'svelte',
      })
    ],
    define: {
      // Make sure environment variables are available
      'process.env.MONGO_URI': JSON.stringify(env.MONGO_URI)
    }
  }
})
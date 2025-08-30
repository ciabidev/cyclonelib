import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
    })
  ]
})
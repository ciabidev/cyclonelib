import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'] }), mdsvex()],
	kit: {
		adapter: adapter({
			// Node.js adapter for full MongoDB support
		}),
		alias: {
			// an alias ending /* will only match
			// the contents of a directory, not the directory itself
			'$components/*': './src/components/*',
			'$static/*': './static/*',
			'$stores/*': './src/stores/*',
			'$lib/*': './src/lib/*'
		}
	},
	// Add Node.js polyfills for build process
	vite: {
		define: {
			global: 'globalThis'
		},
		optimizeDeps: {
			include: ['mongodb', 'dotenv', 'crypto', 'path', 'os', 'fs']
		}
	}
};

export default config;

import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'] }), mdsvex()],
	kit: {
		adapter: adapter({
			fallback: '404.html',
			platformProxy: {
				configPath: 'wrangler.toml',
				environment: 'production',
				experimentalJsonConfig: false
			}
		}),
		alias: {
			// an alias ending /* will only match
			// the contents of a directory, not the directory itself
			'$components/*': './src/components/*',
			'$static/*': './static/*',
			'$stores/*': './src/stores/*',
			'$lib/*': './src/lib/*'
		}
	}
};

export default config;

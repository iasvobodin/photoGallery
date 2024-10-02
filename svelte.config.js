import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// inlineStyleThreshold: 1024,
		adapter: adapter({
			// if true, will create a Netlify Edge Function rather
			// than using standard Node-based functions
			edge: false,

			// if true, will split your app into multiple functions
			// instead of creating a single one for the entire app.
			// if `edge` is true, this option cannot be used
			split: false
		}),
		// adapter: adapter({
		// 	// default options are shown. On some platforms
		// 	// these options are set automatically — see below
		// 	// pages: 'build',
		// 	// assets: 'build',
		// 	// // fallback: null,
		// 	// precompress: false,
		// 	// strict: true
		// }),
		// csp: {
		// 	mode: 'auto',
		// 	directives: {
		// 		'child-src': ['blob:', 'https://mc.yandex.ru'],
		// 		'frame-src': ['blob:', 'https://mc.yandex.ru'],
		// 		'img-src': ['https://mc.yandex.ru', 'localhost:*', 'https:'],
		// 	}
		// }
	},
	vite: {
		server: {
			proxy: {
				'/.netlify/functions': {
					target: 'http://localhost:8888',  // URL Netlify Dev сервера
					changeOrigin: true,
					secure: false
				}
			}
		}
	}
};

export default config;

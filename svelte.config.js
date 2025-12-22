// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';
// import { vitePreprocess } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			precompress: false,
			// strict: true
		}),
		// csp: {
		// 	mode: 'auto',
		// 	directives: {
		// 		'child-src': ['blob:', 'https://mc.yandex.ru'],
		// 		'frame-src': ['blob:', 'https://mc.yandex.ru'],
		// 		'img-src': ['https://mc.yandex.ru', 'localhost:*', 'https:'],
		// 	}
		// }
	}
};

export default config;

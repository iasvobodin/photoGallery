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
		// adapter: adapter({
		// 	// if true, will create a Netlify Edge Function rather
		// 	// than using standard Node-based functions
		// 	edge: false,

		// 	// if true, will split your app into multiple functions
		// 	// instead of creating a single one for the entire app.
		// 	// if `edge` is true, this option cannot be used
		// 	split: false
		// }),
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			// fallback: null,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: ({ status, path, referrer, referenceType }) => {
				if (status === 404) {
					// Игнорируем 404 для изображений, которых нет в build
					return 'ignore';
				}
				// Для всех остальных ошибок — падаем как обычно
				throw new Error(`${status} ${path} (referrer: ${referrer})`);
			}
		}
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

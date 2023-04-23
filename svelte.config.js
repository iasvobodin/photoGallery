// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	vite: {
		ssr: {
			noExternal: ['curtainsjs/src/index.mjs']
		}
	},
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			// fallback: null,
			precompress: false,
			strict: true
		}),
		csp: {
			directives: {
				'script-src': ['self',
					'https://mc.yandex.ru',
					'https://mc.yandex.az',
					'https://mc.yandex.by',
					'https://mc.yandex.co.il',
					'https://mc.yandex.com',
					'https://mc.yandex.com.am',
					'https://mc.yandex.com.ge',
					'https://mc.yandex.com.tr',
					'https://mc.yandex.ee',
					'https://mc.yandex.fr',
					'https://mc.yandex.kg',
					'https://mc.yandex.kz',
					'https://mc.yandex.lt',
					'https://mc.yandex.lv',
					'https://mc.yandex.md',
					'https://mc.yandex.tj',
					'https://mc.yandex.tm',
					'https://mc.yandex.ua',
					'https://mc.yandex.uz',
					'https://mc.webvisor.com',
					'https://mc.webvisor.org',
					'https://yastatic.net'
				],
				'img-src': ['https://mc.yandex.ru'],
				'connect-src': ['https://mc.yandex.ru'],
				'child-src': ['https://mc.yandex.ru'],
				'frame-src': ['https://mc.yandex.ru'],

			},
			// reportOnly: {
			// 	'script-src': ['self']
			// }
		}
		// adapter: adapter({
		// 	// if true, will create a Netlify Edge Function rather
		// 	// than using standard Node-based functions
		// 	edge: false,

		// 	// if true, will split your app into multiple functions
		// 	// instead of creating a single one for the entire app.
		// 	// if `edge` is true, this option cannot be used
		// 	split: false
		// })
	}
};

export default config;

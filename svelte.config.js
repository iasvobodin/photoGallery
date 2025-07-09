// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';
// import { vitePreprocess } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').Config} */

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    csp: {
      mode: 'nonce',
      directives: {
        'script-src': [
          'self',
          'https://yastatic.net',
          'https://mc.yandex.ru',
        ],
        'connect-src': ['https://mc.yandex.ru'],
        'img-src': ['https://mc.yandex.ru', 'data:']
      }
    }
  }
};
export default config;
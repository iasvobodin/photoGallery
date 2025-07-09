// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';
// import { vitePreprocess } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').Config} */



const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      precompress: false,
      strict: true
    }),
    csp: {
      directives: {
        'script-src': [
          '"self"',  // Исправлено: добавлены кавычки
          'https://yastatic.net',  // Добавлен https://
          'https://mc.yandex.ru',  // Добавлен https://
          '"unsafe-inline"'
        ],
        'connect-src': [
          '"self"',
          'https://mc.yandex.ru'  // Для отправки данных
        ],
        'img-src': [
          '"self"',
          'data:',
          'https://mc.yandex.ru'  // Для пикселя Метрики
        ]
      }
    }
  }
};

export default config;
<script lang="ts">
	import '../global.css';
	import '../fonts.css';
	import { setContext, onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { browser, dev } from '$app/environment';

	// Компоненты
	import Menu from '$lib/components/Menu.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';
	import BackButton from '$lib/components/BackButton.svelte';

	// GSAP Manager
	import { initGSAP, createSmoother, getSmoother, destroySmoother } from '$lib/utils/gsap';

	let canonical = `https://svobodinaphoto.ru${$page.url.pathname}`;
	let scrollY: number = 0;

	onMount(() => {
		if (!browser) return;

		// Инициализируем GSAP один раз
		initGSAP();

		// Создаём ScrollSmoother
		const smoother = createSmoother();

		// Передаём в контекст для дочерних компонентов
		if (smoother) {
			setContext('smoother', smoother);
		}
	});

	onDestroy(() => {
		// Очистка при размонтировании (для HMR в dev режиме)
		if (dev) {
			destroySmoother();
		}
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<meta name="yandex-verification" content="0c22a9f3cbd83255" />
	<meta name="author" content="Anastasia Svobodina" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Фотограф Анастасия Свободина" />
	<meta name="twitter:description" content="Красивые и неповторимые моменты на фото." />
	<meta name="twitter:image" content="https://img.svobodinaphoto.ru/1024_19-08-24-17-09-02.jpg" />

	<meta property="og:title" content="SvobodinaPhoto" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://img.svobodinaphoto.ru/1024_19-08-24-17-09-02.jpg" />
	<meta property="og:image:type" content="image/jpg" />
	<meta property="og:image:width" content="300" />
	<meta property="og:image:height" content="300" />
	<meta property="og:url" content="https://svobodinaphoto.ru/" />
	<meta property="og:locale" content="ru_RU" />
	<meta
		property="og:description"
		content="Профессиональный фотограф Свободина Анастасия Челябинск. Свадебная, портретная, репортажная, семейная фотосессии. Профессиональное оборудование, быстрые сроки, адекватные цены"
	/>
	<meta property="vk:image" content="https://img.svobodinaphoto.ru/1024_19-08-24-17-09-02.jpg" />
	<link rel="canonical" href={canonical} />

	{#if !dev}
		{@html `
    <!-- Cloudflare Web Analytics -->
    <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "81a8d8bf928542628a1b40e79dad0790"}'></script>
    <!-- End Cloudflare Web Analytics -->
  `}

		<script type="text/javascript">
			(function (m, e, t, r, i, k, a) {
				m[i] =
					m[i] ||
					function () {
						(m[i].a = m[i].a || []).push(arguments);
					};
				m[i].l = 1 * new Date();
				for (var j = 0; j < document.scripts.length; j++) {
					if (document.scripts[j].src === r) {
						return;
					}
				}
				(k = e.createElement(t)),
					(a = e.getElementsByTagName(t)[0]),
					(k.async = 1),
					(k.src = r),
					a.parentNode.insertBefore(k, a);
			})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

			ym(47422762, 'init', {
				clickmap: true,
				trackLinks: true,
				accurateTrackBounce: true
			});
		</script>
		<noscript>
			<div>
				<img
					src="https://mc.yandex.ru/watch/47422762"
					style="position:absolute; left:-9999px;"
					alt=""
				/>
			</div>
		</noscript>
	{/if}

	<script>
		// Viewport height fix для мобильных устройств
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		});
	</script>
</svelte:head>

<!-- Smooth Scroll Container -->
<div id="smooth-wrapper">
	<div id="smooth-content">
		<slot />
	</div>
</div>

<!-- UI Компоненты -->
{#if $page.url.pathname !== '/'}
	<BackButton />
{/if}

<ScrollToTop {scrollY} />
<Menu {scrollY} />

<style>
	:global(:root) {
		--font-size-main: clamp(30px, 20px + 4.5vh, 90px);
		--slider-height: calc(max(100vh, 500px) - var(--font-size-main) * 2);
		--slide-width: calc(var(--slider-height) * 0.66);
	}

	#smooth-wrapper {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow: hidden;
		top: 0;
		left: 0;
	}

	#smooth-content {
		overflow: visible;
		width: 100%;
		min-height: 100vh;
	}
</style>

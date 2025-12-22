<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	let canonical = `https://svobodinaphoto.ru${$page.url.pathname}`;
</script>

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
		<noscript
			><div>
				<img
					src="https://mc.yandex.ru/watch/47422762"
					style="position:absolute; left:-9999px;"
					alt=""
				/>
			</div></noscript
		>
	{/if}

	<script>
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		});
	</script>
</svelte:head>

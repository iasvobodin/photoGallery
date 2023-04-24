<script lang="ts">
	import '../global.css';
	import '../fonts.css';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Logo from '$lib/components/logo.svelte';
	import { dev } from '$app/environment';


let canonical = `https://svobodinaphoto.ru${$page.url.pathname}`
// console.log(canonical);

	let numbers: Array<number> = [];
	const stileRandom = (i: number) => {
		const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
		const randomX = Math.floor(Math.random() * window.innerWidth * 0.85);
		const randomY = Math.floor(Math.random() * window.innerHeight * 0.85);
		const randomDeg = Math.floor(Math.random() * window.innerHeight * 0.85);
		const randomScale = Math.random() + 0.85;

		return `fill: ${randomColor};transform: translate(${randomX}px, -${randomY}px) rotate(${randomDeg}deg) scale(${randomScale})`;
	};
	let way = true;
	function addNumber() {
		if (numbers.length >= 25) {
			way = false;
		}
		if (numbers.length === 0) {
			way = true;
		}
		way && (numbers = [...numbers, numbers.length + 1]);
		!way && (numbers = numbers.slice(1));
	}

	function overlay(node, { duration }) {
		return {
			duration,
			css: (t, u) => `clip-path: circle(${100 * t}%)`
		};
	}

	function spin(node, { duration, delay }) {
		return {
			delay,
			duration,
			css: (t, u) => `transform: translateX(${-100 * u}%)`
		};
	}
	function spin2(node, { duration, delay }) {
		return {
			duration,
			delay,
			css: (t, u) => `transform: translateX(${100 * u}%)`
		};
	}
	// console.log($page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/')));
	const goSomeWhereBack = () => {
		goto(
			$page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'))
				? $page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'))
				: '/'
		);
	};
	let y: number, x: number;

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	const navigation = [
		{ name: '    ДОМОЙ', route: '/' },
		{ name: 'ФОТОСЕРИИ', route: '/photoseries' },
		{ name: '   ОТЗЫВЫ', route: '/reviews' },
		{ name: '     ЦЕНЫ', route: '/price' },
		{ name: '   О СЕБЕ', route: '/about' }
	];
	let menuIsOpen = false;
	const stag = () => {
		menuIsOpen = !menuIsOpen;
	};
</script>

<svelte:window bind:scrollY={y} bind:scrollX={x} />

<svelte:head>
	<meta name="yandex-verification" content="9cd2d955993a7f04" />
	<meta name="author" content="Anastasia Svobodina" />

	<!-- <meta name="keywords" content=""> -->
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
		<script type="text/javascript" >
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

			ym(93061408, 'init', {
				clickmap: true,
				trackLinks: true,
				accurateTrackBounce: true,
				webvisor: true
			});
		</script>
		<noscript
			><div>
				<img
					src="https://mc.yandex.ru/watch/93061408"
					style="position:absolute; left:-9999px;"
					alt=""
				/>
			</div></noscript
		>
	{/if}
	<script >
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		});
	</script>
</svelte:head>


<div class="main" class:disable__scroll={menuIsOpen}>
	<slot />
</div>
{#if $page.url.pathname !== '/'}
	<button
		id="bb"
		aria-label="Back Button"
		style="background-image: url('/icons/back3.svg');"
		on:click={goSomeWhereBack}
		type="button"
		class="menu__back unbutton"
	/>
{/if}
{#if y >= 150}
	<button
		transition:fly={{ y: 200, duration: 1500 }}
		on:click={scrollTop}
		type="button"
		class="scroll__top"
	/>
{/if}
<div class="menu">
	{#if menuIsOpen}
		<div out:overlay={{ duration: 600 }} in:overlay={{ duration: 600 }} class="overlay">
			<img on:click={addNumber} class="logo" src="/icons/logo.svg" alt="logo" />
			{#each numbers as item, i}
				<div style={stileRandom(i)} class="logo-fake">
					<Logo color={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
				</div>

				<!-- <img style={stileRandom(i)} class="logo-fake" src="/icons/logo.svg" alt="logo" /> -->
			{/each}
		</div>
	{/if}
	<h1 class="menu__title__hor font__prop" class:hide__svph={$page.url.pathname !== '/'}>
		SVOBODINA
	</h1>
	<button
		id="mb"
		aria-label="Menu Button"
		type="button"
		on:click={stag}
		class="menu__button font__prop"
		class:menuIsOpen
	/>
	{#if !menuIsOpen}
		<div class="menu__title__ver font__prop" class:hide__svph={$page.url.pathname !== '/'}>
			{#each 'PHOTO' as item, i}
				<div class="char__holder">
					<span
						out:spin={{ duration: 600, delay: 0 }}
						in:spin={{ duration: 600, delay: 100 }}
						class="ph__char">{item}</span
					>
				</div>
			{/each}
		</div>
	{/if}
	{#if menuIsOpen}
		<!-- class:menu__item__active={menuIsOpen} -->
		<div class="menu__items font__prop">
			{#each navigation as item, i (i)}
				<a on:click={stag} data-title={item.name} href={item.route} class="font__prop menu__item">
					{#each item.name as el, j}
						<div class="char__holder">
							<span
								in:spin2={{ duration: 600, delay: (item.name.length + 2 - j) * 20 }}
								out:spin2={{ duration: 600, delay: j * 20 }}
								class="char">{el}</span
							>
						</div>
					{/each}
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap'); */

	:root {
		--clip: 0%;
		--font-size-main: clamp(30px, 20px + 4.5vh, 90px);
		/* --font-size-main: var(--font-size-main); */
		--slider-height: calc(max(100vh, 500px) - var(--font-size-main) * 2);
		--slide-width: calc(var(--slider-height) * 0.66);
	}
	.main {
		position: relative;
	}
	.hide__svph {
		opacity: 0;
	}
	section {
		all: unset;
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		display: block;
	}
	.disable__scroll {
		overflow-y: hidden;
		height: 100vh;
	}
	.menu__back {
		width: calc((clamp(40px, 6.5vw + 12px, 90px) + 4vh) / 1.5);
		height: calc((clamp(40px, 6.5vw + 12px, 90px) + 4vh) / 1.5);
		cursor: pointer;
		position: absolute;
		top: 0;
		left: 10px;
		transform: scaleX(-1);
	}
	/* linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent), */
	.scroll__top {
		background-image: url('/icons/scroll.svg');
		position: fixed;
		bottom: 10px;
		right: 10px;
		width: calc(clamp(40px, 6.5vw + 12px, 90px));
		height: calc(clamp(40px, 6.5vw + 12px, 90px));
	}

	.font__prop {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		font-size: var(--font-size-main);
		line-height: 1;
	}
	.menu {
		pointer-events: none;
		position: absolute;
		top: 0;
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		right: 0;
		width: 100%;
		overflow: hidden;
	}
	.menu__title__hor {
		pointer-events: none;
		text-align: end;
		padding: 0;
		padding-right: 2ch;
		margin: 0;
	}
	.menu__title__ver {
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
		/* height: calc(100vh - var(--font-size-main));
		align-content: space-around; */
	}

	.ph__char {
		display: inline-block;
		height: inherit;
	}
	.menu__button {
		pointer-events: all;
		background-image: url('/icons/menu3.svg');
		position: absolute;
		cursor: pointer;
		top: 0.36ch;
		right: 0.5ch;
		width: 1ch;
		height: 1ch;
		transform: scale(1.7);
	}
	.overlay {
		display: grid;
		pointer-events: all;
		clip-path: circle(100%);
		transition: clip-path 1s;
		position: absolute;
		top: -100vh;
		top: calc(var(--vh, 1vh) * -100);
		left: 0;
		width: 200%;
		height: 200%;
		background-color: black;
	}
	.logo {
		position: absolute;
		cursor: pointer;
		width: 15vh;
		height: 15vh;
		place-self: end start;
		margin: 3vw;
	}
	.logo-fake {
		position: absolute;
		pointer-events: none;
		width: 15vh;
		height: 15vh;
		place-self: end start;
		margin: 3vw;
	}
	.logo-fake > svg {
		display: block;
		width: 15vh;
		height: 15vh;
	}
	/* .menu::before {
		clip-path: circle(100%);
	} */

	.menuIsOpen {
		background-image: url('/icons/plus.svg');
	}

	.menu__items {
		pointer-events: all;
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
		display: grid;
		/* height: calc(100vh - var(--font-size-main));
		align-content: space-around; */
	}
	.menu__item {
		--clipPath: polygon(0 0, 100% 0%, 100% 100%, 0 100%);
		position: relative;
		-webkit-text-stroke: 1px rgb(255, 255, 255);
		color: white;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		height: var(--font-size-main);
		width: 100%;
		text-decoration: none;
		text-decoration-line: none;
		text-decoration-color: white;
		justify-self: end;
	}
	/* .menu__item__active:after {
		user-select: none;
		position: absolute;
		content: attr(data-title);
		height: 100%;
		top: 0;
		right: 0;
		color: rgb(255, 255, 255);
		clip-path: polygon(0 0, 0% 0%, 0% 100%, 0 100%);
		transition: clip-path 0.5s ease-in;
	}
	.menu__item__active:hover:after {
		clip-path: var(--clipPath);
	} */

	.char__holder {
		display: inline-block;
		width: 1ch;
		overflow: hidden;
	}
	.char {
		display: inline-block;
		height: inherit;
		/* transform: translateX(-100%); */
	}
	@media (max-width: 500px) {
		.scroll__top {
			background-image: url('/icons/scroll.svg');
			position: fixed;
			bottom: 20px;
			right: 20px;
			width: calc(clamp(40px, 6.5vh + 12px, 90px));
			height: calc(clamp(40px, 6.5vh + 12px, 90px));
		}
	}
</style>

<script lang="ts">
	import '../global.css';
	import '../fonts.css';
	import { setContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Head from '$lib/components/Head.svelte';
	import LogoAnimation from '$lib/components/LogoAnimation.svelte';
	import Navigation from '$lib/components/MainNavigation.svelte';
	import MenuButton from '$lib/components/MenuButton.svelte';
	import Lenis from '@studio-freight/lenis';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	let lenis: Lenis;

	$: if (browser) {
		window.scrollTo(0, 0);
		window.history.scrollRestoration = 'manual';
		lenis = new Lenis({
			lerp: 0.08
		});
		const raf = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
		raf(0);
		setContext('lenis', lenis);
	}

	const goSomeWhereBack = () => {
		if (!browser) return; // защита от SSR

		// Если есть история браузера, просто возвращаемся назад
		if (history.length > 1) {
			history.back();
			return;
		}

		// Если истории нет (например, прямой заход на страницу)
		const currentPath = get(page).url.pathname;

		// Убираем последний слеш, если он есть
		const trimmedPath =
			currentPath.endsWith('/') && currentPath.length > 1 ? currentPath.slice(0, -1) : currentPath;

		// Определяем родительский путь
		const lastSlashIndex = trimmedPath.lastIndexOf('/');
		const parentPath = lastSlashIndex > 0 ? trimmedPath.substring(0, lastSlashIndex) : '/';

		goto(parentPath);
	};

	let y: number, x: number;

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	let menuIsOpen = false;
	const stag = () => {
		menuIsOpen = !menuIsOpen;
		console.log(menuIsOpen);
		menuIsOpen ? lenis.stop() : lenis.start();
	};
</script>

<svelte:window bind:scrollY={y} bind:scrollX={x} />

<Head />

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
	<MenuButton isOpen={menuIsOpen} scrollY={y} on:toggle={stag}>
		<LogoAnimation slot="overlay" />
	</MenuButton>
	<Navigation isOpen={menuIsOpen} on:navigate={stag} />
</div>

<style>
	:root {
		--clip: 0%;
		--font-size-main: clamp(30px, 20px + 4.5vh, 90px);
		--slider-height: calc(max(100vh, 500px) - var(--font-size-main) * 2);
		--slide-width: calc(var(--slider-height) * 0.66);
	}

	.main {
		position: relative;
	}

	.hide__svph {
		transition: opacity 1s;
		opacity: 0;
	}

	section {
		all: unset;
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		display: block;
	}

	.disable__scroll {
		/* overflow-y: hidden; height: 100vh; */
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
		position: fixed;
		top: 0;
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		right: 0;
		width: 100%;
		overflow: hidden;
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

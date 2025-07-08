<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getContext } from 'svelte';
	import Logo from './Logo.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type Lenis from './Lenis.svelte';
	import type { TransitionConfig } from 'svelte/transition';
	let menuIsOpen = false;

	let lenis = getContext<Lenis>('lenis');

	const stag = () => {
		menuIsOpen = !menuIsOpen;
		menuIsOpen ? lenis.stop() : lenis.start();
	};

	const navigation = [
		{ name: '    ДОМОЙ', route: '/' },
		{ name: 'ФОТОСЕРИИ', route: '/photoseries' },
		{ name: '   ОТЗЫВЫ', route: '/reviews' },
		{ name: '     ЦЕНЫ', route: '/price' },
		{ name: '   О СЕБЕ', route: '/about' }
	];

	function overlay(node: Element, { duration }: { duration: number }): TransitionConfig {
		return {
			duration,
			css: (t, u) => `clip-path: circle(${100 * t}%)`
		};
	}
	const goSomeWhereBack = () => {
		goto(
			$page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'))
				? $page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'))
				: '/'
		);
	};
</script>

<div class="menu">
	{#if menuIsOpen}
		<div out:overlay={{ duration: 600 }} in:overlay={{ duration: 600 }} class="overlay">
			<Logo />
		</div>
	{/if}

	<h1 class="menu__title__hor">SVOBODINA</h1>

	<button id="mb" aria-label="Menu Button" on:click={stag} class="menu__button"></button>

	{#if menuIsOpen}
		<div class="menu__items">
			{#each navigation as item}
				<a on:click={stag} href={item.route} class="menu__item">
					{item.name}
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #000;
		color: white;
		z-index: 1000;
	}
	.menu__button {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		cursor: pointer;
	}
	.menu__items {
		display: flex;
		flex-direction: column;
		padding: 20px;
	}
	.menu__item {
		text-decoration: none;
		color: white;
		margin: 10px 0;
	}
	/* Стили для overlay и других анимаций */
</style>

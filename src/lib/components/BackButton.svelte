<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { gsap, createGSAPContext } from '$lib/utils/gsap';

	let buttonEl: HTMLElement;
	let ctx: gsap.Context | null;

	const goBack = () => {
		const parentPath = $page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'));
		goto(parentPath || '/');
	};

	onMount(() => {
		ctx = createGSAPContext(() => {
			// Появление кнопки с анимацией
			gsap.from(buttonEl, {
				x: -50,
				opacity: 0,
				duration: 0.5,
				ease: 'power2.out',
				delay: 0.2
			});
		});
	});

	onDestroy(() => {
		ctx?.revert();
	});
</script>

<button
	bind:this={buttonEl}
	aria-label="Back Button"
	on:click={goBack}
	type="button"
	class="back__button"
/>

<style>
	.back__button {
		background-image: url('/icons/back3.svg');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		width: calc((clamp(40px, 6.5vw + 12px, 90px) + 4vh) / 1.5);
		height: calc((clamp(40px, 6.5vw + 12px, 90px) + 4vh) / 1.5);
		cursor: pointer;
		position: fixed;
		top: 10px;
		left: 10px;
		transform: scaleX(-1);
		z-index: 1000;
		border: none;
		background-color: transparent;
		transition: transform 0.2s ease;
	}

	.back__button:hover {
		transform: scaleX(-1.1) translateX(5px);
	}
</style>

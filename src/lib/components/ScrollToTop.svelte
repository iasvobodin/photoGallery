<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap, scrollToElement, createGSAPContext } from '$lib/utils/gsap';

	export let scrollY: number = 0;
	export let threshold: number = 150;

	let buttonEl: HTMLElement;
	let ctx: gsap.Context;

	const scrollToTop = () => {
		scrollToElement('body', { duration: 1, offset: 0 });
	};

	// Реактивное появление/скрытие кнопки
	$: if (buttonEl) {
		if (scrollY >= threshold) {
			gsap.to(buttonEl, {
				opacity: 1,
				y: 0,
				duration: 0.3,
				ease: 'power2.out',
				pointerEvents: 'all'
			});
		} else {
			gsap.to(buttonEl, {
				opacity: 0,
				y: 20,
				duration: 0.3,
				ease: 'power2.in',
				pointerEvents: 'none'
			});
		}
	}

	onMount(() => {
		ctx = gsap.context(() => {
			// Начальное состояние
			gsap.set(buttonEl, {
				opacity: 0,
				y: 20
			});
		});
	});

	onDestroy(() => {
		ctx?.revert();
	});
</script>

<button
	bind:this={buttonEl}
	on:click={scrollToTop}
	type="button"
	class="scroll__top"
	aria-label="Scroll to top"
/>

<style>
	.scroll__top {
		background-image: url('/icons/scroll.svg');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		position: fixed;
		bottom: 10px;
		right: 10px;
		width: clamp(40px, 6.5vw + 12px, 90px);
		height: clamp(40px, 6.5vw + 12px, 90px);
		z-index: 1000;
		cursor: pointer;
		border: none;
		background-color: transparent;
		opacity: 0;
		pointer-events: none;
		transition: transform 0.2s ease;
	}

	.scroll__top:hover {
		transform: scale(1.1);
	}

	@media (max-width: 500px) {
		.scroll__top {
			bottom: 20px;
			right: 20px;
			width: clamp(40px, 6.5vh + 12px, 90px);
			height: clamp(40px, 6.5vh + 12px, 90px);
		}
	}
</style>

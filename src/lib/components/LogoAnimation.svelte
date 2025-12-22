<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/logo.svelte';

	let numbers: Array<number> = [];
	let windowWidth = 0;
	let windowHeight = 0;

	onMount(() => {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;

		const handleResize = () => {
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	const stileRandom = (i: number) => {
		// Защита от SSR и случая когда размеры еще не получены
		if (!browser || windowWidth === 0 || windowHeight === 0) {
			return 'opacity: 0;';
		}

		const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
		const randomX = Math.floor(Math.random() * windowWidth * 0.85);
		const randomY = Math.floor(Math.random() * windowHeight * 0.85);
		const randomDeg = Math.floor(Math.random() * 360);
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
</script>

<img on:click={addNumber} class="logo" src="/icons/logo.svg" alt="logo" />
{#each numbers as item, i}
	<div style={stileRandom(i)} class="logo-fake">
		<Logo color={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
	</div>
{/each}

<style>
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

	.logo-fake > :global(svg) {
		display: block;
		width: 15vh;
		height: 15vh;
	}
</style>

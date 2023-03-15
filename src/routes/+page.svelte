<script lang="ts">
	import { onMount } from 'svelte';
	let ss = 0;
	let sliderData = [
		[
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-16-15-09-54.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-30-16-27-21.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/23-01-24-14-38-44.jpg'
		],
		[
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/23-01-24-14-38-44.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-16-15-09-54.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-30-16-27-21.jpg'
		],
		[
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-30-16-27-21.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/23-01-24-14-38-44.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-16-15-09-54.jpg'
		]
	];
	onMount(() => {
		// let i = 3;
		// setInterval(() => {
		// 	i++;
		// 	ss = i % 3;
		// }, 2500);
	});
</script>

<svelte:head>
	<link
		rel="preload"
		href="/fonts/RobotoMono-VariableFont_wght.ttf"
		as="font"
		crossOrigin="anonymous"
	/>
</svelte:head>
<div class="slider font__prop">
	{#each sliderData as item}
		<div class="slide__holder">
			<img src={item[ss]} alt="" />
		</div>
	{/each}
</div>

<style>
	:root {
		--slider-height: calc(max(100vh, 500px) - var(--font-size) * 2);
		--slide-width: calc(var(--slider-height) * 0.66);
	}

	.font__prop {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		font-size: var(--font-size);
		line-height: 1;
	}
	.slider {
		position: relative;
		top: var(--font-size);
		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(max(calc(var(--slide-width) - 400px), var(--slide-width)), 1fr)
		);
		column-gap: 1vw;
		width: calc((100vw - 2ch));
		height: var(--slider-height);
		overflow: hidden;
	}
	.slide__holder {
		height: var(--slider-height);
		overflow: hidden;
		display: grid;
		/* background-size: contain;
		background-position: center;
		background-repeat: no-repeat; */
		border-radius: 5px;
	}
	.slider img {
		place-self: center;
		width: 90%;
		height: 90%;
		margin: auto;
		object-fit: contain;
		object-position: center;
	}

	@media (max-width: 500px) {
		.slider {
			display: grid;
			width: calc((100vw - 2ch));
		}
		.slider img {
			width: 100%;
			height: 90%;
			margin-top: 10%;
			object-fit: cover;
			object-position: center;
		}
		.slide__holder {
			height: var(--slider-height);
			overflow: hidden;
		}
	}
</style>

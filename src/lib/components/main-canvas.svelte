<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type Lenis from '@studio-freight/lenis';
	import { getContext } from 'svelte';

	let videoCanvas: HTMLCanvasElement;
	let frameIndex = 0;
	let images = <Array<HTMLImageElement>>[];
	let src = <Array<string>>[];
	let scroll = 0;
	let frameQty = 259;
	let canvasHide = false;
	let lenis: Lenis;

	const currentFrame = (size: number = 1920, index: number) => `/frames/${size}_frame${index}.webp`;

	for (let index = 0; index < frameQty; index++) {
		src[index] = currentFrame(1024, index + 1);
	}

	const preloadImages = (size: number) => {
		for (let i = 0; i < frameQty; i++) {
			images[i] = new Image();
			images[i].crossOrigin = 'Anonymous';
			images[i].decoding = 'async';
			images[i].src = currentFrame(size, i + 1);
		}
	};

	$: if (browser) {
		lenis = getContext('lenis');
		preloadImages(window.innerWidth > 900 ? 1920 : 1024);
	}
	onMount(() => {
		const context = videoCanvas.getContext('2d');

		lenis.on('scroll', (e: any) => {
			scroll = e.scroll;
		});
		images.at(-1)!.onload = () => {
			videoCanvas.width = images[0].naturalWidth; // img.width;
			videoCanvas.height = images[0].naturalHeight; // img.height;
			canvasHide = true;
		};
		const raf = (time: number) => {
			frameIndex = Math.min(frameQty - 1, Math.ceil(scroll / 15));

			context!.drawImage(images[frameIndex], 0, 0);

			requestAnimationFrame(raf);
		};
		raf(0);
	});
</script>

<img class:hide={canvasHide} src="/frames/1920_frame1.webp" alt="" />
<!-- {#each src as item}
	<img class:hide={!canvasHide} src={item} alt="sv" />
{/each} -->
<canvas class:hide={!canvasHide} bind:this={videoCanvas} />

<style>
	.hide {
		opacity: 0;
	}
	img,
	canvas {
		grid-area: 1/1/2/2;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100vh;
	}
	canvas {
		display: block;
	}
</style>

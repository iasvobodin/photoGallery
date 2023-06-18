<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type Lenis from '@studio-freight/lenis';
	import { getContext } from 'svelte';

	let videoCanvas: HTMLCanvasElement,
		imageHolder: HTMLImageElement,
		frameIndex = 0,
		images = <Array<HTMLImageElement>>[];

	let lenis: Lenis;

	let frameQty = 259;

	const currentFrame = (size: number = 1920, index: number) => `/frames/${size}_frame${index}.webp`;

	const preloadImages = (size: number) => {
		for (let i = 0; i < frameQty; i++) {
			images[i] = new Image();
			images[i].crossOrigin = 'Anonymous';
			images[i].decoding = 'async';
			images[i].src = currentFrame(size, i + 1);
		}
	};

	$: if (browser) {
		preloadImages(window.innerWidth > 900 ? 1920 : 1024);
		lenis = getContext('lenis');
	}
	onMount(() => {
		const context = videoCanvas.getContext('2d');

		lenis.on('scroll', (e: any) => {
			frameIndex = Math.min(frameQty - 1, Math.ceil(e.scroll / 15));
			if (frameIndex >= 257) {
				return;
			}
			// if (frameIndex%1 = 0) {

			// }
			updateImage(frameIndex);
		});

		let once = true;
		const updateImage = (index: number) => {
			if (images[0].naturalWidth && once) {
				videoCanvas.width = images[0].naturalWidth; // img.width;
				videoCanvas.height = images[0].naturalHeight; // img.height;
				once = false;
			}
			// if (index >= 1 && index <= frameQty) {

			context && context.drawImage(images[index], 0, 0);
			// console.log(frameIndex);

			// console.log('draw');
			// }
		};

		// const raf = (time: number) => {
		// 	updateImage(frameIndex);
		// 	requestAnimationFrame(raf);
		// };
		// raf(0);
	});
</script>

<img bind:this={imageHolder} src="/frames/1920_frame1.webp" alt="" />
<canvas bind:this={videoCanvas} />

<style>
	img {
		grid-area: 1/1/2/2;

		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100vh;
	}
	canvas {
		/* position: absolute;

		top: 0; */
		grid-area: 1/1/2/2;
		display: block;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
</style>

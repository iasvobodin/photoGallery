<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { getContext } from 'svelte';
	import type Lenis from '@studio-freight/lenis';

	let videoCanvas: HTMLCanvasElement;
	let frameIndex = 0;
	let images: HTMLImageElement[] = [];
	let lenis: Lenis | null = null;
	let ready = false;

	const frameQty = 259;
	const size = browser && window.innerWidth > 900 ? 1920 : 1024;

	const currentFrame = (size: number = 1920, index: number) => `/frames/${size}_frame${index}.webp`;

	// 🔹 пробуем получить Lenis сразу
	if (browser) {
		try {
			lenis = getContext('lenis');
		} catch {
			console.warn('Lenis context not found yet, will retry...');
		}
	}

	// ✅ без ошибок, если lenis появится позже
	function waitForLenis(onReady: (lenis: Lenis) => void) {
		if (lenis) {
			onReady(lenis);
			return;
		}
		const interval = setInterval(() => {
			try {
				lenis = getContext('lenis');
				if (lenis) {
					clearInterval(interval);
					onReady(lenis);
				}
			} catch {}
		}, 200);
	}

	const drawImageSafe = (ctx: CanvasRenderingContext2D, index: number) => {
		const img = images[index];
		if (!img || !img.complete) return;
		try {
			ctx.drawImage(img, 0, 0);
		} catch {}
	};

	async function preloadFirstFrames(size: number, count = 20) {
		for (let i = 0; i < Math.min(count, frameQty); i++) {
			const img = new Image();
			img.src = currentFrame(size, i + 1);
			img.crossOrigin = 'Anonymous';
			img.decoding = 'async';
			images[i] = img;
			try {
				await img.decode();
			} catch {}
		}
	}

	function preloadImagesLazy(size: number) {
		let i = 20;
		function loadNextBatch(deadline: IdleDeadline) {
			while (i < frameQty && (deadline.timeRemaining() > 5 || deadline.didTimeout)) {
				const img = new Image();
				img.src = currentFrame(size, i + 1);
				img.crossOrigin = 'Anonymous';
				img.decoding = 'async';
				images[i] = img;
				i++;
			}
			if (i < frameQty) requestIdleCallback(loadNextBatch);
		}
		requestIdleCallback(loadNextBatch);
	}

	function warmUpCanvas(ctx: CanvasRenderingContext2D) {
		for (let i = 0; i < 5; i++) {
			const img = images[i];
			if (img?.complete) ctx.drawImage(img, 0, 0);
		}
		ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
	}

	onMount(async () => {
		if (!browser) return;
		const ctx = videoCanvas.getContext('2d');
		if (!ctx) return;

		// 1️⃣ грузим первые кадры
		await preloadFirstFrames(size, 20);
		videoCanvas.width = images[0].naturalWidth;
		videoCanvas.height = images[0].naturalHeight;

		// 2️⃣ отрисовываем первый кадр
		ctx.drawImage(images[0], 0, 0);

		// 3️⃣ прогрев GPU
		warmUpCanvas(ctx);

		// 4️⃣ ленивый догруз остальных
		preloadImagesLazy(size);

		ready = true;

		// 5️⃣ ждём появления lenis
		waitForLenis((ln) => {
			ln.on('scroll', (e: any) => {
				frameIndex = Math.min(frameQty - 1, Math.ceil(e.scroll / 15));
				drawImageSafe(ctx, frameIndex);
			});
		});
	});
</script>

<!-- 🖼 подложка (первый кадр) -->
<img
	src={`/frames/${size}_frame1.webp`}
	alt="animation first frame"
	loading="eager"
	decoding="sync"
	class="frame-bg"
/>

<!-- 🎞 canvas поверх -->
<canvas bind:this={videoCanvas} class:ready />

<style>
	.frame-bg {
		grid-area: 1/1/2/2;
		width: 100%;
		height: 100vh;
		object-fit: cover;
		object-position: 65%;
		display: block;
	}

	canvas {
		grid-area: 1/1/2/2;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100vh;
		object-fit: cover;
		object-position: 65%;
		display: block;
		background: transparent;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	canvas.ready {
		opacity: 1;
	}
</style>

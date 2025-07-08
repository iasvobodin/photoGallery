<script lang="ts">
	import { onMount } from 'svelte';
	import justifiedLayout from 'justified-layout';

	type PhotoMeta = {
		Id: number;
		Route: string;
		Title: string;
		Cover: string;
		Aspect: number;
	}[];

	export let allph: PhotoMeta;

	type Layout = ReturnType<typeof justifiedLayout>;
	type Box = Layout['boxes'][number];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const TILE_SIZE = { width: 0, height: 0 };
	const IMAGES_PER_TILE = 45;
	let maxNumRows = 4;

	interface LoadedImage {
		src: string;
		width: number;
		height: number;
		aspectRatio: number;
		image: HTMLImageElement;
	}

	interface ClickableBox {
		x: number;
		y: number;
		w: number;
		h: number;
		img: HTMLImageElement;
	}

	interface Pointer {
		x: number;
		y: number;
		time: number;
	}

	let images: LoadedImage[] = [];
	let offset = { x: 0, y: 0 };
	let velocity = { x: 0, y: 0 };
	let dragging = false;
	let lastPointer: Pointer = { x: 0, y: 0, time: 0 };
	let pointerDownPos: { x: number; y: number } | null = null;
	let clickableBoxes: ClickableBox[] = [];
	let fullscreenImage: { image: HTMLImageElement } | null = null;
	let tileCache: Record<string, HTMLCanvasElement> = {};
	let cachedLayout: Layout | null = null;
	let needsRedraw = true;

	onMount((): void => {
		ctx = canvas.getContext('2d')!;
		resizeCanvas();
		loadImages().then(() => {
			generateTileCache();
			setupListeners();
			renderLoop();
		});
	});

	function resizeCanvas(): void {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		TILE_SIZE.width = window.innerWidth * 1.4;
		cachedLayout = null;
		getLayout();
		tileCache = {};
		generateTileCache();
		needsRedraw = true;
	}

	// async function loadImages(): Promise<void> {
	// 	const res = await fetch('https://picsum.photos/v2/list?page=3&limit=30');
	// 	const data: any[] = await res.json();

	// 	const loaded: LoadedImage[] = await Promise.all(
	// 		data.map((img: any): Promise<LoadedImage> => {
	// 			return new Promise((resolve) => {
	// 				const image = new Image();
	// 				image.src = img.download_url;
	// 				image.onload = () =>
	// 					resolve({
	// 						src: image.src,
	// 						width: image.naturalWidth,
	// 						height: image.naturalHeight,
	// 						aspectRatio: image.naturalWidth / image.naturalHeight,
	// 						image
	// 					});
	// 			});
	// 		})
	// 	);

	// 	images = loaded;
	// 	cachedLayout = null;
	// 	getLayout();
	// }

	async function loadImages(): Promise<void> {
		const loaded: LoadedImage[] = await Promise.all(
			allph.map((meta) => {
				return new Promise<LoadedImage>((resolve) => {
					const image = new Image();
					image.src = `https://img.svobodinaphoto.ru/480_${meta.Cover}.webp`; //meta.Cover; // используй твой путь
					image.onload = () =>
						resolve({
							src: image.src,
							width: image.naturalWidth,
							height: image.naturalHeight,
							aspectRatio: meta.Aspect || image.naturalWidth / image.naturalHeight,
							image
						});
				});
			})
		);

		images = loaded;
		cachedLayout = null;
		getLayout();
	}

	function getLayout(): Layout {
		if (!cachedLayout) {
			const ratios: number[] = images.slice(0, IMAGES_PER_TILE).map((e) => e.aspectRatio);
			const targetRowHeight: number = (window.innerHeight / maxNumRows) * 1.2;

			cachedLayout = justifiedLayout(ratios, {
				containerWidth: TILE_SIZE.width,
				containerPadding: 15,
				boxSpacing: 40,
				targetRowHeight: 400,
				targetRowHeightTolerance: 0.1,
				maxNumRows: 10,
				showWidows: false
			});

			TILE_SIZE.height = cachedLayout.containerHeight;
		}
		return cachedLayout;
	}

	function roundRect(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number | Partial<Record<'tl' | 'tr' | 'br' | 'bl', number>>
	): void {
		if (typeof radius === 'number') {
			radius = { tl: radius, tr: radius, br: radius, bl: radius };
		} else {
			const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
			for (const side in defaultRadius) {
				(radius as any)[side] = (radius as any)[side] || 0;
			}
		}

		ctx.beginPath();
		ctx.moveTo(x + radius.tl!, y);
		ctx.lineTo(x + width - radius.tr!, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr!);
		ctx.lineTo(x + width, y + height - radius.br!);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br!, y + height);
		ctx.lineTo(x + radius.bl!, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl!);
		ctx.lineTo(x, y + radius.tl!);
		ctx.quadraticCurveTo(x, y, x + radius.tl!, y);
		ctx.closePath();
	}

	function generateTileCache(): void {
		const layout = getLayout();

		const cacheCanvas: HTMLCanvasElement = document.createElement('canvas');
		cacheCanvas.width = TILE_SIZE.width;
		cacheCanvas.height = TILE_SIZE.height;
		const cacheCtx = cacheCanvas.getContext('2d')!;

		const cornerRadius = 6;
		const jitter = 15;

		layout.boxes.forEach((box: Box, i: number) => {
			const img = images[i % IMAGES_PER_TILE].image;
			if (!img.complete) return;

			const dx = (Math.random() - 0.5) * 2 * jitter;
			const dy = (Math.random() - 0.5) * 2 * jitter;

			const x = box.left + dx;
			const y = box.top + dy;

			cacheCtx.save();
			roundRect(cacheCtx, x, y, box.width, box.height, cornerRadius);
			cacheCtx.clip();
			cacheCtx.drawImage(img, x, y, box.width, box.height);
			cacheCtx.restore();
		});

		tileCache['0,0'] = cacheCanvas;
	}

	function drawTile(tx: number, ty: number): void {
		const tileX = tx * TILE_SIZE.width + offset.x;
		const tileY = ty * TILE_SIZE.height + offset.y;

		if (
			tileX + TILE_SIZE.width < 0 ||
			tileX > canvas.width ||
			tileY + TILE_SIZE.height < 0 ||
			tileY > canvas.height
		)
			return;

		const cacheCanvas = tileCache['0,0'];
		if (cacheCanvas) {
			ctx.drawImage(cacheCanvas, tileX, tileY);
			const layout = getLayout();
			layout.boxes.forEach((box: Box, i: number) => {
				clickableBoxes.push({
					x: tileX + box.left,
					y: tileY + box.top,
					w: box.width,
					h: box.height,
					img: images[i % IMAGES_PER_TILE].image
				});
			});
		}
	}

	function drawFullscreenImage(): void {
		const image = fullscreenImage?.image;
		if (!image) return;

		const aspect = image.naturalWidth / image.naturalHeight;
		let w = canvas.width;
		let h = canvas.height;

		if (canvas.width / canvas.height > aspect) {
			w = canvas.height * aspect;
		} else {
			h = canvas.width / aspect;
		}

		const x = (canvas.width - w) / 2;
		const y = (canvas.height - h) / 2;
		ctx.drawImage(image, x, y, w, h);
	}

	function render(): void {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (fullscreenImage) {
			drawFullscreenImage();
			return;
		}

		clickableBoxes = [];

		const cols = Math.ceil(canvas.width / TILE_SIZE.width) + 2;
		const rows = Math.ceil(canvas.height / TILE_SIZE.height) + 2;

		const centerX = Math.floor(-offset.x / TILE_SIZE.width);
		const centerY = Math.floor(-offset.y / TILE_SIZE.height);

		for (let x = centerX; x < centerX + cols; x++) {
			for (let y = centerY; y < centerY + rows; y++) {
				drawTile(x, y);
			}
		}
	}

	function renderLoop(): void {
		if (needsRedraw) {
			render();
			needsRedraw = false;
		}
		animateInertia();
		requestAnimationFrame(renderLoop);
	}

	function animateInertia(): void {
		velocity.x *= 0.95;
		velocity.y *= 0.95;
		if (Math.abs(velocity.x) > 0.05 || Math.abs(velocity.y) > 0.05) {
			offset.x += velocity.x;
			offset.y += velocity.y;
			needsRedraw = true;
		}
	}

	function handleImageClick(e: PointerEvent): void {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		for (const box of clickableBoxes) {
			if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
				fullscreenImage = { image: box.img };
				needsRedraw = true;
				return;
			}
		}
	}

	function setupListeners(): void {
		canvas.style.cursor = 'grab';

		canvas.addEventListener('pointerdown', (e: PointerEvent) => {
			if (fullscreenImage) return;
			dragging = true;
			lastPointer = { x: e.clientX, y: e.clientY, time: performance.now() };
			pointerDownPos = { x: e.clientX, y: e.clientY };
			canvas.style.cursor = 'grabbing';
		});

		canvas.addEventListener('pointermove', (e: PointerEvent) => {
			if (!dragging || fullscreenImage) return;

			const now = performance.now();
			const dx = e.clientX - lastPointer.x;
			const dy = e.clientY - lastPointer.y;
			const dt = now - lastPointer.time || 16;

			offset.x += dx;
			offset.y += dy;
			velocity.x = (dx / dt) * 16;
			velocity.y = (dy / dt) * 16;

			lastPointer = { x: e.clientX, y: e.clientY, time: now };
			needsRedraw = true;
		});
		canvas.addEventListener(
			'wheel',
			(e: WheelEvent) => {
				e.preventDefault();

				// Определяем "delta" (для трекпада и Firefox подправим)
				const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
				const scaleFactor = isFirefox ? 33 : 1;
				const deltaX = e.deltaX * scaleFactor;
				const deltaY = e.deltaY * scaleFactor;

				offset.x -= deltaX;
				offset.y -= deltaY;

				velocity.x = -deltaX;
				velocity.y = -deltaY;

				needsRedraw = true;
			},
			{ passive: false }
		);

		canvas.addEventListener('pointerup', (e: PointerEvent) => {
			dragging = false;
			canvas.style.cursor = 'grab';

			if (fullscreenImage) {
				fullscreenImage = null;
				needsRedraw = true;
				return;
			}

			if (!pointerDownPos) return;

			const dx = e.clientX - pointerDownPos.x;
			const dy = e.clientY - pointerDownPos.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 5) handleImageClick(e);
		});

		let touchStartY = 0;
		let touchStartX = 0;

		canvas.addEventListener('touchstart', (e: TouchEvent) => {
			const touch = e.touches[0];
			touchStartX = touch.clientX;
			touchStartY = touch.clientY;
		});

		canvas.addEventListener('touchmove', (e: TouchEvent) => {
			const touch = e.touches[0];
			const dx = touch.clientX - touchStartX;
			const dy = touch.clientY - touchStartY;

			offset.x += dx;
			offset.y += dy;

			velocity.x = dx;
			velocity.y = dy;

			touchStartX = touch.clientX;
			touchStartY = touch.clientY;

			needsRedraw = true;
		});

		window.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape' && fullscreenImage) {
				fullscreenImage = null;
				needsRedraw = true;
			}
		});

		window.addEventListener('resize', () => {
			resizeCanvas();
		});
	}
</script>

<canvas bind:this={canvas} class="w-full h-full block" />

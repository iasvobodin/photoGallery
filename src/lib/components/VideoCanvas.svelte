<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let videoCanvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let frameIndex = 0;
	let images: HTMLImageElement[] = [];
	let scrollTriggerInstance: ScrollTrigger | null = null;

	const FRAME_QTY = 259;

	// Определяем размер изображений в зависимости от экрана
	$: imageSize = browser ? (window.innerWidth > 900 ? 1920 : 1024) : 1920;

	const currentFrame = (index: number) => `/frames/${imageSize}_frame${index}.webp`;

	// Простая предзагрузка всех изображений
	function preloadImages() {
		for (let i = 1; i <= FRAME_QTY; i++) {
			const img = new Image();
			img.src = currentFrame(i);
			images[i - 1] = img;
		}
	}

	// Обновление canvas с cover поведением
	function updateImage(index: number) {
		if (!context || !images[index]) return;

		const img = images[index];

		// Функция для отрисовки с cover поведением
		const drawCover = () => {
			if (!context) return;

			// Размеры canvas = размеры viewport
			const canvasWidth = window.innerWidth;
			const canvasHeight = window.innerHeight;

			// Устанавливаем размеры canvas если нужно
			if (videoCanvas.width !== canvasWidth || videoCanvas.height !== canvasHeight) {
				videoCanvas.width = canvasWidth;
				videoCanvas.height = canvasHeight;
			}

			// Вычисляем масштаб для cover (заполнить весь canvas)
			const scale = Math.max(canvasWidth / img.naturalWidth, canvasHeight / img.naturalHeight);

			// Вычисляем размеры изображения после масштабирования
			const scaledWidth = img.naturalWidth * scale;
			const scaledHeight = img.naturalHeight * scale;

			// Центрируем изображение (с учетом object-position: 65%)
			const x = (canvasWidth - scaledWidth) * 0.65;
			const y = (canvasHeight - scaledHeight) / 2;

			// Очищаем canvas и рисуем
			context.clearRect(0, 0, canvasWidth, canvasHeight);
			context.drawImage(img, x, y, scaledWidth, scaledHeight);
		};

		// Рисуем изображение
		if (img.complete) {
			drawCover();
		} else {
			// Если изображение еще не загружено, ждем и пробуем снова
			img.onload = drawCover;
		}
	}

	$: if (browser) {
		preloadImages();
	}

	onMount(() => {
		if (!browser) return;

		// Получаем контекст
		context = videoCanvas.getContext('2d');

		// Создаем ScrollTrigger
		scrollTriggerInstance = ScrollTrigger.create({
			start: 0,
			end: 'max',
			onUpdate: (self) => {
				const scroll = self.scroll();
				frameIndex = Math.min(FRAME_QTY - 1, Math.ceil(scroll / 15));

				if (frameIndex >= 257) return;

				updateImage(frameIndex);
			}
		});

		// Показываем первый кадр
		if (images[0]) {
			images[0].onload = () => updateImage(0);
			if (images[0].complete) {
				updateImage(0);
			}
		}

		// Обновляем при ресайзе окна для сохранения cover
		const handleResize = () => {
			updateImage(frameIndex);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (scrollTriggerInstance) {
			scrollTriggerInstance.kill();
		}
	});
</script>

<img src="/frames/{imageSize}_frame1.webp" alt="" />
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
		grid-area: 1/1/2/2;
		display: block;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100vh;
	}
</style>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let videoCanvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let frameIndex = 0;
	let lastFrameIndex = -1;
	let images: (HTMLImageElement | null)[] = [];
	let scrollTriggerInstance: ScrollTrigger | null = null;
	let isUpdating = false;

	// Настройки
	const FRAME_QTY = 259;
	const BUFFER_SIZE = 15; // Буфер для предзагрузки
	const UPDATE_THRESHOLD = 16; // ms между обновлениями (~60fps)

	// Адаптивные настройки
	$: settings = browser
		? getOptimalSettings()
		: { imageSize: 1920, frameStep: 1, scrollDivisor: 15 };

	function getOptimalSettings() {
		const width = window.innerWidth;
		const isMobile = width <= 768;
		const isTablet = width <= 1024;

		return {
			imageSize: isMobile ? 640 : isTablet ? 1024 : 1920,
			frameStep: isMobile ? 2 : 1,
			scrollDivisor: isMobile ? 25 : 15
		};
	}

	const currentFrame = (size: number, index: number) => `/frames/${size}_frame${index}.webp`;

	// Загрузка одного изображения
	function loadImage(
		index: number,
		priority: 'high' | 'low' = 'low'
	): Promise<HTMLImageElement | null> {
		return new Promise((resolve) => {
			if (images[index]) {
				resolve(images[index]);
				return;
			}

			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.decoding = priority === 'high' ? 'sync' : 'async';
			img.fetchPriority = priority;

			img.onload = () => {
				images[index] = img;
				resolve(img);
			};

			img.onerror = () => {
				console.warn(`Failed to load frame ${index}`);
				resolve(null);
			};

			img.src = currentFrame(settings.imageSize, index + 1);
		});
	}

	// Загрузка первого кадра максимально быстро
	async function loadFirstFrame() {
		const firstFrame = await loadImage(0, 'high');
		if (firstFrame && context) {
			// Устанавливаем размеры canvas
			videoCanvas.width = firstFrame.naturalWidth;
			videoCanvas.height = firstFrame.naturalHeight;
			// Рисуем первый кадр сразу
			context.drawImage(firstFrame, 0, 0, videoCanvas.width, videoCanvas.height);
		}
		// Сразу начинаем загружать следующие кадры
		loadNearbyFrames(0);
	}

	// Фоновая загрузка кадров рядом с текущим
	async function loadNearbyFrames(currentIndex: number) {
		const start = Math.max(0, currentIndex);
		const end = Math.min(FRAME_QTY, currentIndex + BUFFER_SIZE);

		// Загружаем по одному кадру с паузами
		for (let i = start; i < end; i += settings.frameStep) {
			if (!images[i]) {
				await loadImage(i);
				// Маленькая пауза чтобы не блокировать основной поток
				await new Promise((resolve) => setTimeout(resolve, 10));
			}
		}

		// Продолжаем загружать остальные кадры в фоне
		if (end < FRAME_QTY) {
			requestIdleCallback(() => loadRemainingFrames(end));
		}
	}

	// Загрузка всех оставшихся кадров в фоне с низким приоритетом
	async function loadRemainingFrames(startFrom: number) {
		for (let i = startFrom; i < FRAME_QTY; i += settings.frameStep) {
			if (!images[i]) {
				// Используем requestIdleCallback для загрузки в свободное время
				await new Promise((resolve) => {
					if ('requestIdleCallback' in window) {
						requestIdleCallback(() => resolve(null));
					} else {
						setTimeout(() => resolve(null), 50);
					}
				});
				loadImage(i);
			}
		}
	}

	// Throttle функция
	let lastUpdateTime = 0;
	function throttledUpdate(index: number) {
		const now = performance.now();
		if (now - lastUpdateTime < UPDATE_THRESHOLD) return;

		lastUpdateTime = now;
		updateCanvas(index);
	}

	// Обновление canvas с сохранением пропорций
	function updateCanvas(index: number) {
		if (isUpdating || !images[index] || !context) return;

		isUpdating = true;

		requestAnimationFrame(() => {
			const img = images[index];
			if (!img || !context) {
				isUpdating = false;
				return;
			}

			// Рисуем с сохранением размеров canvas
			if (img.complete) {
				context.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);
			}

			isUpdating = false;
		});
	}

	// Обработчик скролла
	function handleScrollUpdate(self: ScrollTrigger) {
		const scroll = self.scroll();
		const newIndex = Math.min(FRAME_QTY - 1, Math.ceil(scroll / settings.scrollDivisor));

		if (newIndex >= 257) return;

		frameIndex = Math.floor(newIndex / settings.frameStep) * settings.frameStep;

		if (frameIndex !== lastFrameIndex) {
			throttledUpdate(frameIndex);
			lastFrameIndex = frameIndex;

			// Подгружаем кадры впереди
			requestIdleCallback(() => {
				loadNearbyFrames(frameIndex);
			});
		}
	}

	// Очистка памяти для далеких кадров
	function cleanupDistantFrames(currentIndex: number) {
		const keepRange = 100; // Держим больше кадров в памяти

		images.forEach((img, i) => {
			if (img && Math.abs(i - currentIndex) > keepRange) {
				img.src = '';
				images[i] = null;
			}
		});
	}

	let cleanupInterval: ReturnType<typeof setInterval>;

	onMount(async () => {
		if (!browser) return;

		// Инициализация canvas
		context = videoCanvas.getContext('2d', {
			alpha: false,
			desynchronized: true,
			willReadFrequently: false
		});

		// Загружаем первый кадр максимально быстро
		await loadFirstFrame();

		// Создаем ScrollTrigger
		scrollTriggerInstance = ScrollTrigger.create({
			start: 0,
			end: 'max',
			scrub: true,
			onUpdate: handleScrollUpdate,
			invalidateOnRefresh: true,
			anticipatePin: 1
		});

		// Периодическая очистка памяти (реже - каждые 10 секунд)
		cleanupInterval = setInterval(() => {
			cleanupDistantFrames(frameIndex);
		}, 10000);

		// Обработчик ресайза
		const handleResize = () => {
			const newSettings = getOptimalSettings();
			if (newSettings.imageSize !== settings.imageSize) {
				// Перезагружаем только видимые кадры
				const currentImg = images[frameIndex];
				if (currentImg) {
					images = [];
					loadFirstFrame().then(() => {
						loadNearbyFrames(frameIndex);
					});
				}
			}
		};

		window.addEventListener('resize', handleResize, { passive: true });

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (scrollTriggerInstance) {
			scrollTriggerInstance.kill();
		}

		if (cleanupInterval) {
			clearInterval(cleanupInterval);
		}

		images.forEach((img) => {
			if (img) img.src = '';
		});
		images = [];

		if (context) {
			context.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
		}
	});
</script>

<!-- Первый кадр для мгновенного отображения -->
<img src="/frames/{settings.imageSize}_frame1.webp" alt="" class="first-frame" />

<!-- Canvas для анимации -->
<canvas bind:this={videoCanvas} class="video-canvas" />

<style>
	.first-frame {
		grid-area: 1/1/2/2;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100vh;
		will-change: opacity;
	}

	.video-canvas {
		grid-area: 1/1/2/2;
		display: block;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100vh;
		will-change: transform;
	}

	/* Оптимизация для мобильных */
	@media (max-width: 768px) {
		.video-canvas {
			image-rendering: optimizeSpeed;
		}
	}

	/* Поддержка reduced-motion */
	@media (prefers-reduced-motion: reduce) {
		.video-canvas,
		.first-frame {
			transition: none;
		}
	}
</style>

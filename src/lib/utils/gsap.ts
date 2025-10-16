import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { browser } from '$app/environment';

// Singleton для ScrollSmoother
let smootherInstance: ScrollSmoother | null = null;
let isInitialized = false;

/**
 * Инициализация GSAP плагинов (вызывается один раз)
 */
export function initGSAP() {
	if (!browser) return;
	if (isInitialized) return;

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
	isInitialized = true;

	console.log('✅ GSAP initialized');
}

/**
 * Создание ScrollSmoother (singleton)
 */
export function createSmoother(config?: {
	smooth?: number;
	effects?: boolean;
	smoothTouch?: number;
}) {
	if (!browser) return null;

	// Если уже создан, возвращаем существующий
	if (smootherInstance) {
		console.log('♻️ Using existing ScrollSmoother');
		return smootherInstance;
	}

	// Проверяем наличие контейнеров
	const wrapper = document.querySelector('#smooth-wrapper');
	const content = document.querySelector('#smooth-content');

	if (!wrapper || !content) {
		console.warn('⚠️ ScrollSmoother containers not found');
		return null;
	}

	try {
		smootherInstance = ScrollSmoother.create({
			wrapper: '#smooth-wrapper',
			content: '#smooth-content',
			smooth: config?.smooth ?? 1.2,
			effects: config?.effects ?? true,
			smoothTouch: config?.smoothTouch ?? 0.1,
			normalizeScroll: false
		});

		console.log('✅ ScrollSmoother created');
		return smootherInstance;
	} catch (error) {
		console.error('❌ ScrollSmoother creation failed:', error);
		return null;
	}
}

/**
 * Получение текущего инстанса ScrollSmoother
 */
export function getSmoother(): ScrollSmoother | null {
	return smootherInstance;
}

/**
 * Уничтожение ScrollSmoother
 */
export function destroySmoother() {
	if (smootherInstance) {
		smootherInstance.kill();
		smootherInstance = null;
		console.log('🗑️ ScrollSmoother destroyed');
	}
}

/**
 * Плавный скролл к элементу
 */
export function scrollToElement(
	target: string | HTMLElement,
	options?: {
		duration?: number;
		offset?: number;
		ease?: string;
	}
) {
	if (!browser) return;

	const element = typeof target === 'string' ? document.querySelector(target) : target;
	if (!element) return;

	const smoother = getSmoother();

	if (smoother) {
		// Используем ScrollSmoother
		smoother.scrollTo(element, true, `top ${options?.offset ?? 100}px`);
	} else {
		// Fallback на GSAP ScrollToPlugin
		gsap.to(window, {
			scrollTo: {
				y: element,
				offsetY: options?.offset ?? 100
			},
			duration: options?.duration ?? 1,
			ease: options?.ease ?? 'power2.inOut'
		});
	}
}

/**
 * Создание GSAP контекста (для автоматической очистки)
 */
export function createGSAPContext(callback: (ctx: gsap.Context) => void) {
	if (!browser) return null;

	const ctx = gsap.context(() => {
		callback(ctx);
	});
	return ctx;
}

/**
 * Очистка всех ScrollTrigger инстансов
 */
export function clearScrollTriggers() {
	if (!browser) return;

	ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	console.log('🧹 All ScrollTriggers cleared');
}

/**
 * Обновление ScrollTrigger (debounced)
 */
let refreshTimeout: ReturnType<typeof setTimeout>;
export function refreshScrollTrigger(delay = 100) {
	if (!browser) return;

	clearTimeout(refreshTimeout);
	refreshTimeout = setTimeout(() => {
		ScrollTrigger.refresh();
		console.log('🔄 ScrollTrigger refreshed');
	}, delay);
}

/**
 * Экспорт GSAP и плагинов
 */
export { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin };

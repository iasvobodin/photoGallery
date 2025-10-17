// src/lib/gsap/core.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

let initialized = false;
let smootherInstance: ScrollSmoother | null = null;

export function initGSAP() {
	if (typeof window === 'undefined' || initialized) return;

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
	initialized = true;
}

export function createSmoother() {
	if (smootherInstance) return smootherInstance;

	smootherInstance = ScrollSmoother.create({
		wrapper: '#smooth-wrapper',
		content: '#smooth-content',
		smooth: 1.2,
		effects: true
	});

	return smootherInstance;
}

export { gsap, ScrollTrigger };

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import type Lenis from '@studio-freight/lenis';
	import { getContext } from 'svelte';
	import { browser } from '$app/environment';

	// Существующие компоненты
	import Videocanvas from '$lib/components/VideoCanvas.svelte';
	import Header from '$lib/components/header.svelte';
	import AboutDesc from '$lib/components/aboutdesc.svelte';

	// Новые компоненты
	import GallerySection from '$lib/components/GallerySection.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import ReviewsSection from '$lib/components/ReviewsSection.svelte';
	import PriceSection from '$lib/components/PriceSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';

	import type { PageData } from './$types';

	gsap.registerPlugin(ScrollTrigger);

	export let data: PageData;

	// Данные
	let showDis = false;
	let allph = data.allph;
	let reviewsSlice = data.reviews.slice(data.reviews.length - 8, data.reviews.length);
	let allphHor = allph.filter((e) => e.Aspect > 1);
	let allphVer = allph.filter((e) => e.Aspect < 1);
	let intervalId: NodeJS.Timer;
	let allph1 = allphHor.slice(0, 9);
	let allph2 = allphVer;
	let allph3 = allphHor.slice(9, 18);

	let priceDescription =
		'Я понимаю, что каждый клиент имеет свои уникальные потребности и пожелания, поэтому я готова подбирать цену на услуги индивидуально для каждого. Вместе мы можем определить, какие услуги будут вам необходимы и какой бюджет будет наиболее подходящим для вас. Подробнее в разделе';
	let priceDescriptionByWords = priceDescription.split(' ');

	let lenis: Lenis;

	// Биндинги для DOM элементов (для GSAP анимаций)
	let videoCanvasRef: HTMLDivElement;
	let aboutRef: HTMLDivElement;
	let galleryHolderRef: HTMLDivElement;
	let galleryTopRef: HTMLDivElement;
	let galleryMiddleRef: HTMLDivElement;
	let galleryBottomRef: HTMLDivElement;
	let heroHolderRef: HTMLDivElement;
	let heroTitleRef: HTMLParagraphElement;
	let heroTitle2Ref: HTMLParagraphElement;
	let heroListHolderRef: HTMLDivElement;
	let reviewsRef: HTMLDivElement;
	let priceDescRef: HTMLDivElement;

	$: if (browser) {
		lenis = getContext('lenis');
	}

	let midl_gallery: string | number, scaleCoef: number;

	const setGsap = () => {
		scaleCoef =
			window.innerWidth / window.innerHeight > 1
				? 1 / (8072 / window.innerHeight)
				: 1 / (5381 / window.innerWidth);

		const revHorizontalCoef =
			(window.innerWidth * 0.98 - Math.min(600, window.innerWidth * 0.95)) / reviewsSlice.length;

		gsap.set('.review_holder', {
			x: function (index) {
				return index * revHorizontalCoef;
			},
			y: function (index) {
				return (
					index * ((window.innerHeight - window.innerHeight * 0.12 - 350) / reviewsSlice.length)
				);
			}
		});
		gsap.set(galleryMiddleRef, {
			x: '75vw'
		});
		gsap.set([galleryTopRef, galleryBottomRef], {
			xPercent: -100
		});

		midl_gallery = gsap.getProperty(galleryMiddleRef, 'width');
		ScrollTrigger.refresh();
	};

	const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
		func: F,
		waitFor: number
	) => {
		let timeout: NodeJS.Timeout;

		const debounced = (...args: Parameters<F>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), waitFor);
		};

		return debounced;
	};

	const debounceSizes = debounce(setGsap, 300);

	const order = () => {
		showDis = !showDis;
		if (typeof ym !== 'undefined') {
			ym(93061408, 'reachGoal', 'orderButton');
			console.log('metrika');
		}
	};

	onMount(() => {
		window.addEventListener('resize', debounceSizes);

		lenis.on('scroll', ScrollTrigger.update);

		ScrollTrigger.create({
			trigger: videoCanvasRef,
			pin: true,
			start: 'top top',
			end: '+550% top',
			pinSpacing: false
		});

		setGsap();

		gsap.ticker.lagSmoothing(0);

		// Анимация video_canvas при скролле секции about
		gsap.to(videoCanvasRef, {
			scrollTrigger: {
				trigger: aboutRef,
				scrub: 1,
				start: '80% top',
				end: '100% top'
			},
			scale: 0.46,
			borderRadius: '20px',
			ease: 'linear'
		});

		// Главная timeline для галереи
		const tl = gsap.timeline({
			ease: 'linear',
			scrollTrigger: {
				trigger: galleryHolderRef,
				scrub: 1,
				pin: true,
				start: 'top top',
				end: '550% top'
			}
		});

		tl.to(videoCanvasRef, { duration: 1.5, x: -midl_gallery }, 0);
		tl.to(galleryMiddleRef, { xPercent: -100, x: 0, duration: 2 }, 0);
		tl.to([galleryTopRef, galleryBottomRef], { xPercent: 0, x: '100vw', duration: 2 }, 0);
		tl.to(heroHolderRef, { opacity: 1, duration: 0 }, 2);
		tl.to('.dummy1', { yPercent: -100, duration: 0.6 }, 2);
		tl.to('.dummy2', { yPercent: 100, duration: 0.6 }, 2);
		tl.to('.hero', { duration: 1.4, scale: scaleCoef, x: 0, y: 0 }, 2.6);
		tl.to([heroTitleRef, heroTitle2Ref, heroListHolderRef], { opacity: 1, duration: 0.2 }, 3.5);

		// Анимация отзывов
		gsap.to('.review', {
			scrollTrigger: {
				trigger: reviewsRef,
				scrub: 1,
				pin: true,
				start: 'top top',
				end: '300% top'
			},
			x: 0,
			stagger: {
				amount: 7,
				each: 0.0000001,
				ease: 'none'
			},
			ease: 'none'
		});

		// Анимация текста цен
		gsap.to(['.words', '.price_link'], {
			scrollTrigger: {
				trigger: priceDescRef,
				scrub: 1,
				start: 'top 70%',
				end: 'bottom 70%'
			},
			opacity: 1,
			stagger: {
				amount: 7,
				each: 0.0000001,
				ease: 'none'
			},
			ease: 'none'
		});

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		let i = 4;
		intervalId = setInterval(() => {
			i++;
		}, 2500);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<svelte:head>
	<title>Главная</title>
	<meta
		name="description"
		content="Фотограф Свободина Анастасия Челябинск. Свадебная, портретная, репортажная, семейная фотосессии. Профессиональное оборудование, быстрые сроки, адекватные цены"
	/>
</svelte:head>

<div class="main_page">
	<div class="video_canvas" bind:this={videoCanvasRef}>
		<Videocanvas />
	</div>

	<div class="header_holder">
		<Header />
	</div>

	<div class="about" bind:this={aboutRef}>
		<AboutDesc />
	</div>

	<GallerySection
		{allph}
		{allph1}
		{allph2}
		{allph3}
		bind:galleryHolderRef
		bind:galleryTopRef
		bind:galleryMiddleRef
		bind:galleryBottomRef
	>
		<HeroSection bind:heroHolderRef bind:heroTitleRef bind:heroTitle2Ref bind:heroListHolderRef />
	</GallerySection>

	<ReviewsSection {reviewsSlice} bind:reviewsRef />

	<PriceSection {priceDescriptionByWords} bind:priceDescRef />

	<ContactSection {showDis} {order} />
</div>

<style>
	:root {
		--rev_width: min(600px, 95%);
		--rev_x: calc((98vw - var(--rev_width)) / 8);
	}

	a {
		text-decoration: none;
	}

	.main_page {
		position: relative;
		background-color: white;
	}

	.video_canvas {
		overflow: hidden;
		position: relative;
		position: sticky;
		top: 0;
		height: 100vh;
		display: grid;
	}

	.header_holder {
		position: absolute;
		top: 0;
		display: grid;
		height: 100vh;
		width: min(90%, 1000px);
	}

	.about {
		position: relative;
		display: grid;
		height: 300vh;
		width: min(95%, 1500px);
		row-gap: 20vw;
		margin: auto;
	}
</style>

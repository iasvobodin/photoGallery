<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Lenis from '@studio-freight/lenis';

	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	// import { disableScrollHandling } from '$app/navigation';

	gsap.registerPlugin(ScrollTrigger);

	export let data: PageData;

	let allph = data.allph;
	let reviewsSlice = data.reviews.slice(data.reviews.length - 8, data.reviews.length);
	let allphHor = allph.filter((e) => e.Aspect > 1);
	let allphVer = allph.filter((e) => e.Aspect < 1);
	let intervalId: NodeJS.Timer;
	let allph1 = allphHor.slice(0, 12);
	let allph2 = allphHor.slice(12, 18);
	let allph3 = allphVer,
		social = ['instagram.com/svobodinaphoto', 'vk.com/svobodinaphoto', 't.me/svobodinaphoto'],
		link = [
			'https://www.instagram.com/svobodinaphoto/',
			'https://vk.com/svobodinaphoto',
			'https://t.me/svobodinaphoto'
		],
		count = 1;

	let videoCanvas: HTMLCanvasElement,
		frameIndex = 0;
	let lenis: Lenis;
	const frameQty = 259;

	const currentFrame = (index: number) => `/canva1/frame${index}.webp`;

	let images = <Array<HTMLImageElement>>[];

	const preloadImages = () => {
		for (let i = 0; i < frameQty; i++) {
			images[i] = new Image();
			images[i].crossOrigin = 'Anonymous';
			images[i].decoding = 'async';
			images[i].src = currentFrame(i + 1);
		}
	};

	$: if (browser) {
		preloadImages();
		lenis = new Lenis({
			lerp: 0.08
		});
		lenis.scrollTo('body', { duration: 0.1, force: true });
	}
	onMount(() => {
		// ScrollTrigger.refresh();
		// ScrollTrigger.killAll();
		// ScrollTrigger.update();
		// disableScrollHandling();
		// window.history.scrollRestoration = 'auto';
		// ScrollTrigger.clearScrollMemory();

		const context = videoCanvas.getContext('2d');

		const updateImage = (index: number) => {
			context && context.drawImage(images[index], 0, 0);
		};

		lenis.on('scroll', ScrollTrigger.update);

		lenis.on('scroll', (e: any) => {
			frameIndex = Math.min(frameQty - 1, Math.ceil(e.scroll / 17));
		});

		ScrollTrigger.create({
			trigger: '.video_canvas',
			pin: true,
			start: 'top top',
			end: '+550% top',
			pinSpacing: false
			// refreshPriority: 1,
		});

		const scaleCoef =
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
		gsap.set('.gallery_middle', {
			x: '75vw'
		});
		gsap.set(['.gallery_top', '.gallery_bottom'], {
			xPercent: -100
		});
		let midl_gallery = gsap.getProperty('.gallery_middle', 'width');
		const img = new Image();
		img.src = currentFrame(1);
		videoCanvas.width = 1920;
		videoCanvas.height = 1015;
		img.onload = function () {
			context && context.drawImage(img, 0, 0);
		};

		// gsap.ticker.lagSmoothing(0);

		gsap.to('.video_canvas', {
			scrollTrigger: {
				trigger: '.about',
				scrub: 1,
				start: '80% top',
				end: '100% top'
			},
			scale: 0.46,
			borderRadius: '20px',
			ease: 'linear'
		});

		const tl = gsap.timeline({
			ease: 'linear',
			scrollTrigger: {
				trigger: '.gallery_holder',
				scrub: 1,
				// refreshPriority: 0,
				pin: true,
				start: 'top top',
				end: '550% top'
			}
		});

		tl.to('.video_canvas', { duration: 1.5, x: -midl_gallery }, 0);
		tl.to('.gallery_middle', { xPercent: -100, x: 0, duration: 2 }, 0);
		tl.to(['.gallery_top', '.gallery_bottom'], { xPercent: 0, x: '100vw', duration: 2 }, 0);
		tl.to('.hero_holder', { opacity: 1, duration: 0 }, 2);
		tl.to('.dummy1', { yPercent: -100, duration: 0.6 }, 2);
		tl.to('.dummy2', { yPercent: 100, duration: 0.6 }, 2);
		tl.to('.hero', { duration: 1.4, scale: scaleCoef, x: 0, y: 0 }, 2.6);
		tl.to(['.hero_title', '.hero_title2', '.hero_list_holder'], { opacity: 1, duration: 0.2 }, 3.5);

		gsap.to('.review', {
			scrollTrigger: {
				trigger: '.reviews',
				scrub: 1,
				pin: true,
				start: 'top top',
				end: '300% top'
			},
			x: 0,
			// duration: 7,
			stagger: {
				amount: 7,
				each: 0.0000001,
				ease: 'none'
			},

			ease: 'none'
		});

		const raf = (time: number) => {
			lenis.raf(time);

			updateImage(frameIndex);

			requestAnimationFrame(raf);
		};
		raf(0);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		let i = 3;
		intervalId = setInterval(() => {
			i++;
			count = i % 3;
		}, 2500);
	});
	onDestroy(() => {
		// debugger;
		// ScrollTrigger.refresh();
		// ScrollTrigger.killAll();
		clearInterval(intervalId);
	});
</script>

<svelte:head>
	<title>Главная</title>
</svelte:head>

<div class="main_page">
	<div class="video_canvas">
		<img src="/canva1/frame1.webp" alt="" />
		<canvas bind:this={videoCanvas} />
	</div>
	<div class="header_holder">
		<h1 class="header">Красивые и неповторимые моменты на фото.</h1>
		<p class="header">Фотосессии, которые сделают Ваши воспоминания незабываемыми.</p>
	</div>
	<div class="about">
		<p class="about_desc p1">
			Приветствую Вас, Меня зовут Настя, и я профессиональный фотограф, который ценит
			индивидуальность и уникальность каждого клиента.
		</p>
		<p class="about_desc p2">
			Я работаю не просто на получение красивых фотографий, а на создание неповторимых образов,
			которые отражают вашу индивидуальность и красоту.
		</p>

		<p class="about_desc p3">
			Я умею создавать комфортную атмосферу на съемке, которая помогает клиентам чувствовать себя
			уверенно и расслабленно.
		</p>
		<p class="about_desc p4">
			Моя цель - не просто удовлетворить ваши требования, а превзойти их, чтобы вы получили самые
			лучшие фотографии, которые будут радовать вас на протяжении всей жизни.
		</p>
	</div>

	<div class="gallery_holder">
		<div class="gallery gallery_top">
			{#each allph1 as item}
				<a data-sveltekit-reload href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
					<img
						style="aspect-ratio:{+item.Aspect};"
						class="gallery_img"
						src="https://img.svobodinaphoto.ru/320_{item.Cover}.avif"
						alt={item.Title}
					/>
				</a>
			{/each}
			<div class="sub_title_portrait">
				<h2 class="sub_title">Фотосерии</h2>
			</div>
		</div>
		<div class="gallery gallery_middle">
			{#each allph2 as item}
				<a data-sveltekit-reload href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
					<img
						style="aspect-ratio:{+item.Aspect};"
						class="gallery_img"
						src="https://img.svobodinaphoto.ru/320_{item.Cover}.avif"
						alt={item.Title}
					/>
				</a>
			{/each}
		</div>
		<div class="gallery gallery_bottom">
			{#each allph3 as item}
				<a data-sveltekit-reload href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
					<img
						style="aspect-ratio:{+item.Aspect};"
						class="gallery_img"
						src="https://img.svobodinaphoto.ru/320_{item.Cover}.avif"
						alt={item.Title}
					/>
				</a>
			{/each}
		</div>
		<div class="hero_holder">
			<div class=" hx hero">
				<img class="x1" src="/h_X/1x.webp" alt="x1" />
				<img class="x2" src="/h_X/2x.webp" alt="x2" />
				<img class="x3" src="/h_X/3x.webp" alt="x3" />
				<img class="x4" src="/h_X/4x.webp" alt="x4" />
			</div>
			<div class="hero_desc">
				<p class="hero_title">Профессиональное<br />оборудование.</p>
				<p class="hero_title2">Качество в<br />мельчайших деталях.</p>
				<div class="hero_list_holder">
					<q class="hero_list">
						Я уверена, что лучшая фотосессия - это та, которая проходит гладко и без сбоев. Именно
						поэтому я всегда имею при себе резервный комплект оборудования, чтобы независимо от
						того, что произойдет, я смогу сохранить всё что снято непосильным трудом. Вы можете быть
						уверены, что я всегда буду готова к любым условиям!
					</q>
				</div>
				<div class="dummy1" />
				<div class="dummy2" />
			</div>
		</div>
	</div>

	<div class="reviews">
		<a data-sveltekit-reload href="/reviews" class=" reviews_title"
			><p class=" reviews_title">Отзывы</p></a
		>
		{#each reviewsSlice as review}
			<div class="review_holder">
				<div class="review">
					<div class="ava">
						<img src="/img/rev/{review.id}.jpg" alt="ava" />
					</div>
					<div class="review__decription">
						<p class="review__name">{review.name}</p>
						<p class="review__body">{review.body}</p>
					</div>
				</div>
			</div>
		{/each}
		<a data-sveltekit-reload href="/reviews" class="reviews_link">Больше отзывов</a>
	</div>
	<div class="price">
		<p class="price_desc">
			Я понимаю, что каждый клиент имеет свои уникальные потребности и пожелания, поэтому я готова
			подбирать цену на услуги индивидуально для каждого. Вместе мы можем определить, какие услуги
			будут вам необходимы и какой бюджет будет наиболее подходящим для вас. <br /> Подробнее в
			разделе <a data-sveltekit-reload href="/price">цены</a>
		</p>
		<p class="finish_desc">
			Я буду рада стать вашим фотографом и помочь вам запечатлеть ваши самые яркие моменты жизни в
			красивых и незабываемых фотографиях. Свяжитесь со мной, чтобы обсудить детали вашей будущей
			фотосессии и дайте мне возможность помочь вам сохранить ваши эмоции и чувства на долгие годы.
		</p>
	</div>
	<div class="contact">
		<!-- <h2 class="description date">Контакты</h2> -->
		<a class="description3" href={link[count]} rel="noreferrer" target="_blank">
			<p>{social[count]}</p>
		</a>
	</div>
</div>

<style>
	/* :global(body) {
		background-color: white;
	} */
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
	.video_canvas > img {
		grid-area: 1/1/2/2;

		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100vh;
	}
	.video_canvas > canvas {
		/* position: absolute;

		top: 0; */
		grid-area: 1/1/2/2;
		display: block;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
	.header_holder {
		/* mix-blend-mode: difference; */
		position: absolute;
		top: 0;
		display: grid;
		height: 100vh;
		width: min(90%, 1000px);
	}
	.header {
		place-self: center;
		text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
		font-family: 'Cormorant Infant', sans-serif;
		/* font-family: 'Roboto Mono', monospace; */
		/* font-family: 'Roboto Mono', monospace; */
		font-size: clamp(14px, 14px + 3.5vw, 80px);
		line-height: 1.3;
		font-weight: 700;
		/* font-weight: 100; */
		text-align: center;
		margin: 0;
		text-indent: 2ch;
		color: rgb(255, 255, 255);
		padding-left: 2ch;
		/* background-color: #ffffff; */
		/* background-image: linear-gradient(180deg, #ffffff, #44c1ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent; */
	}

	.about {
		position: relative;
		display: grid;
		align-content: space-evenly;
		height: 300vh;
		width: min(95%, 1500px);
		row-gap: 20vw;
		margin: auto;
	}
	.about_desc {
		font-family: 'Cormorant Infant', serif;
		font-size: clamp(18px, 14px + 3vw, 36px);
		line-height: 1.25;
		margin: 0;
		width: min(800px, 95%);
		border-radius: 30px;
		background-color: #00000080;
		padding: max(2vw, 30px);
		align-self: center;
		text-indent: 2ch;
		text-shadow: 0 2px 3px rgba(0, 0, 0, 0.4);
	}
	.about_desc:nth-child(odd) {
		justify-self: end;
	}

	.gallery_holder {
		position: relative;
		overflow: hidden;
		margin-top: 100vh;
		height: 100vh;
		/* z-index: -1; */
		/* background: transparent;
		background-color: transparent; */
	}
	.gallery {
		display: flex;
		column-gap: 50px;
		width: fit-content;
		padding: 15px 0px;
	}
	.gallery_top,
	.gallery_bottom {
		height: 25vh;

		/* transform: translateX(-100%); */
	}
	.gallery_middle {
		height: 50vh;
		/* transform: translateX(100%); */
		/* transform: translateX(75vw); */
	}
	.gallery_img {
		height: 100%;
		object-fit: contain;
	}
	.gallery_img:hover {
		transform: scale(1.05);
		transition: transform 1s;
	}
	.sub_title_portrait {
		/* mix-blend-mode: difference; */
		pointer-events: none;
		/* position: absolute; */
		/* top: calc(25vh - 15px); */
		width: fit-content;
	}
	.sub_title {
		text-align: center;
		color: black;
		font-size: 20vh;
		line-height: 23vh;
		/* font-size: clamp(20px, 20px + 10vw, 80px); */
	}

	.hero_holder {
		opacity: 0;
		position: absolute;
		top: 0;
		pointer-events: none;
		/* --heroW: min(500px, 90%);
		height: calc(var(--heroW) * 1.5);
		width: var(--heroW); */
		overflow: hidden;
		width: 100%;
		height: 100vh;
		/* border-radius: 10px; */
		/* margin: auto; */
		/* background-color: white; */
	}
	.hero {
		pointer-events: none;
		transform-origin: 0px 0px;
		/* width: 5381px;
		height: 8072px; */
		transform: translate3d(-2050px, -2547.02px, 0px);

		/* width: 100%;
		height: 100%; */
		object-fit: cover;
		/* object-position: -2671px -2749px; */
		object-position: center;
	}
	.hero_list_holder {
		opacity: 0;
		grid-area: 1/1/3/2;
		align-self: center;
		justify-self: end;
		width: min(1000px, 70%);
	}
	.hero_list {
		font-size: clamp(16px, 14px + 1.5vw, 24px);
		color: rgb(0, 0, 0);
		text-indent: 2ch;
		border-left: 2px solid rgb(1, 175, 255);
		margin: auto;
		width: min(400px, 95%);
		display: block;
		/* border-radius: 0 10px 0 10px; */
		/* border: 1px solid rgb(0, 140, 255); */
		padding: 10px;
	}
	.hero_desc {
		grid-template-rows: 1fr 1fr;
		top: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		display: grid;

		pointer-events: none;
		/* padding: 2vw; */
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr;
		grid-template-areas:
			'first'
			'second';
	}

	.reviews,
	.hero_desc > p {
		font-size: clamp(16px, 16px + 4vw, 50px);
		color: black;
		/* width: 70%; */
		text-align: center;
		padding: 0;
		line-height: 1.2;
		/* margin: 0; */
	}
	.hero_title2 {
		opacity: 0;
		width: min(1000px, 70%);
		place-self: end end;
		grid-area: second;
	}
	.hero_title {
		opacity: 0;
		width: min(1000px, 70%);
		align-self: start;
		justify-self: end;
		grid-area: first;
	}
	.dummy1 {
		grid-area: first;
		background-color: white;
		/* opacity: 0.2; */
	}
	.dummy2 {
		grid-area: second;
		background-color: white;
		/* opacity: 0.2; */
	}
	.reviews {
		position: relative;
		height: 100vh;
		margin-top: 20vh;
		padding-top: 6vh;
		padding-bottom: 6vh;
	}
	.reviews_title {
		position: absolute;
		top: 0;
		right: 0;
		font-size: clamp(22px, 14px + 7vw, 70px);
		margin: 0;
		width: min(800px, 95%);
		text-align: center;
		text-decoration: none;
	}
	.reviews_link {
		display: none;
		position: absolute;
		bottom: 0;
		left: 0;
		font-size: 3vh;
		text-decoration: none;
		padding-bottom: 2vh;
		margin: 0;
		width: min(800px, 95%);
		text-align: center;
	}
	.reviews_title:hover {
		color: purple;
	}
	.gallery > a {
		display: block;
		overflow: hidden;
		border-radius: 10px;
	}
	.review_holder {
		overflow: hidden;
		position: absolute;
		height: 350px;
		width: min(600px, 95%);
	}
	.review {
		width: 100%;
		height: 100%;
		transform: translateX(101%);
		border-radius: 5px;
		display: grid;
		grid-template-columns: minmax(30px, 200px) minmax(250px, 120ch);
	}
	.review__decription {
		-webkit-backdrop-filter: blur(5px);
		backdrop-filter: blur(5px);
		position: relative;
		background: rgba(255, 255, 255, 0.74);
		border-radius: 5px;
		display: grid;
		border: 1px solid rgb(1, 175, 255);
	}
	.review__name {
		align-self: start;
		justify-self: center;
		font-family: Cormorant Infant;
		padding: 5px;
		margin: 0;
		text-align: center;
		font-size: calc(20px + 1vw);
		line-height: calc(20px + 1.2vw);
		font-weight: 300;
		color: #000000;
	}

	.ava {
		place-self: center;
		overflow: hidden;
		border-radius: 5px 5px 5px 5px;
		width: min(150px, 100%);
		height: min(300px, 100%);
	}
	.ava > img {
		height: 100%;
		width: 100%;
		object-fit: contain;
		object-position: top;
	}

	.review__body {
		place-self: stretch;
		margin: 0;
		padding: 1vw;
		font-family: Comfortaa, Sentinel SSm A, Sentinel SSm B, system-ui, -apple-system,
			BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
			Segoe UI Symbol;
		font-size: clamp(16px, calc(0.7rem + 0.25vw), 24px);
		line-height: 1.2;
		font-weight: 150;
		color: rgb(0, 0, 0);
		white-space: pre-wrap;
	}
	.price {
		display: grid;
		width: min(1200px, 95%);
		margin: auto;
		margin-top: 15vh;
		height: auto;
		row-gap: 10vh;
	}
	.price_desc,
	.finish_desc {
		border-left: 2px solid rgb(1, 175, 255);
		padding-left: 2vh;
		color: black;
		font-size: clamp(18px, 18px + 2vw, 36px);
		width: min(850px, 100%);
		text-indent: 2ch;
	}

	.price_desc {
		place-self: center end;
	}
	.finish_desc {
		place-self: center start;
	}
	.description3 {
		color: black;
		text-decoration: none;
		width: 100%;
		text-align: right;
		font-size: max(28px, 5vw);
		margin: 0;
	}
	.description3:hover {
		color: purple;
	}
	.description3 > p {
		padding-bottom: 40px;
		margin-bottom: 0px;
	}
	.hx {
		width: 5381px;
		height: 8072px;
		position: relative;
	}
	.x1 {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.x2 {
		position: absolute;
		top: 1000px;
		height: 4000px;
	}
	.x3 {
		position: absolute;
		height: 2000px;
		width: 3000px;
		top: 2000px;
		left: 1500px;
	}
	.x4 {
		position: absolute;
		top: 2500px;
		left: 2000px;
	}
	.price > p > a {
		display: inline;
		text-decoration: none;
		color: purple;
	}
	@media (orientation: portrait) {
		.hero {
			transform: translate3d(-2960.19px, -2635.27px, 0px);
		}
		.hero_list_holder {
			display: none;
		}
		.ava {
			display: none;
		}
		.review {
			/* height: auto; */
			grid-template-columns: minmax(250px, 120ch);
		}
		.reviews_link {
			display: block;
		}
		/* .header {
			padding: 9vw;
		} */
	}
	h1 {
		margin: 0;
	}
</style>

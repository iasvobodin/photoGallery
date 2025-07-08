<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import type Lenis from 'lenis';
	import { getContext } from 'svelte';
	import Contact from '$lib/components/contact.svelte';
	import Videocanvas from '$lib/components/VideoCanvas.svelte';
	import Header from '$lib/components/header.svelte';
	import AboutDesc from '$lib/components/aboutdesc.svelte';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	// import { disableScrollHandling } from '$app/navigation';

	gsap.registerPlugin(ScrollTrigger);

	export let data: PageData;

	//replace toanother component
	let showDis = false;

	let allph = data.allph;
	let reviewsSlice = data.reviews.slice(data.reviews.length - 8, data.reviews.length);
	let allphHor = allph.filter((e) => e.Aspect > 1);
	let allphVer = allph.filter((e) => e.Aspect < 1);
	let intervalId: ReturnType<typeof setInterval>;
	let allph1 = allphHor.slice(0, 9);
	let allph2 = allphVer;
	let allph3 = allphHor.slice(9, 18);
	let social = [
			'instagram', //.com/svobodinaphoto',
			'vk', //svobodinaphoto',
			'telegram', ///svobodinaphoto',
			'whatsapp' ///svobodinaphoto'
		],
		link = [
			'https://ig.me/m/svobodinaphoto/',
			'https://vk.me/aasvobodina/',
			'https://t.me/svobodinaphoto/',
			'https://wa.me/%2B79514616243'
		],
		count = 1;

	let priceDescription =
		'Я понимаю, что каждый клиент имеет свои уникальные потребности и пожелания, поэтому я готова подбирать цену на услуги индивидуально для каждого. Вместе мы можем определить, какие услуги будут вам необходимы и какой бюджет будет наиболее подходящим для вас. Подробнее в разделе';
	let priceDescriptionByWords = priceDescription.split(' ');

	// let videoCanvas: HTMLCanvasElement,
	// 	frameIndex = 0;

	let lenis: Lenis;

	// const frameQty = 259;

	// const currentFrame = (size: number = 1920, index: number) => `/frames/${size}_frame${index}.webp`;

	// let images = <Array<HTMLImageElement>>[];

	// const preloadImages = (size: number) => {
	// 	for (let i = 0; i < frameQty; i++) {
	// 		images[i] = new Image();
	// 		images[i].crossOrigin = 'Anonymous';
	// 		images[i].decoding = 'async';
	// 		images[i].src = currentFrame(size, i + 1);
	// 	}
	// };

	$: if (browser) {
		// preloadImages(window.innerWidth > 900 ? 1920 : 1024);
		lenis = getContext('lenis');
		// lenis.scrollTo('body', { duration: 0.1, force: true });
	}

	// const debounce = (func: () => void, delay:number) => {
	// 	let timer:NodeJS.Timer;

	// 	return function () {
	// 		const context = this;
	// 		const args = arguments;
	// 		clearTimeout(timer);
	// 		timer = setTimeout(() => func.apply(context, args), delay);
	// 	};
	// };
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
		gsap.set('.gallery_middle', {
			x: '75vw'
		});
		gsap.set(['.gallery_top', '.gallery_bottom'], {
			xPercent: -100
		});

		midl_gallery = gsap.getProperty('.gallery_middle', 'width');
		ScrollTrigger.refresh();
	};

	const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
		func: F,
		waitFor: number
	) => {
		let timeout: ReturnType<typeof setInterval>;

		const debounced = (...args: Parameters<F>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), waitFor);
		};

		return debounced;
	};

	const debounceSizes = debounce(setGsap, 300);
	const order = () => {
		showDis = !showDis;

		ym(93061408, 'reachGoal', 'orderButton');
		console.log('metrika');
	};
	onMount(() => {
		window.addEventListener('resize', debounceSizes);
		// console.log('main');
		// const context = videoCanvas.getContext('2d');

		// const updateImage = (index: number) => {
		// 	context && context.drawImage(images[index], 0, 0);
		// };

		lenis.on('scroll', ScrollTrigger.update);

		// lenis.on('scroll', (e: any) => {
		// 	frameIndex = Math.min(frameQty - 1, Math.ceil(e.scroll / 17));
		// });

		ScrollTrigger.create({
			trigger: '.video_canvas',
			pin: true,
			start: 'top top',
			end: '+550% top',
			pinSpacing: false
			// refreshPriority: 1,
		});
		setGsap();

		// images[0].onload = function () {
		// 	videoCanvas.width = images[0].naturalWidth; // img.width;
		// 	videoCanvas.height = images[0].naturalHeight; // img.height;
		// 	context && context.drawImage(images[0], 0, 0);
		// };

		gsap.ticker.lagSmoothing(0);

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

		gsap.to(['.words', '.price_link'], {
			scrollTrigger: {
				trigger: '.price_desc',
				scrub: 1,
				// pin: true,
				start: 'top 70%',
				end: 'bottom 70%'
				// pinSpacing: false
				// markers: true
			},
			opacity: 1,
			// duration: 7,
			stagger: {
				amount: 7,
				each: 0.0000001,
				ease: 'none'
			},

			ease: 'none'
		});

		// const raf = (time: number) => {
		// 	// updateImage(frameIndex);

		// 	requestAnimationFrame(raf);
		// };
		// raf(0);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		let i = 4;
		intervalId = setInterval(() => {
			i++;
			count = i % 4;
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
	<meta
		name="description"
		content="Фотограф Свободина Анастасия Челябинск. Свадебная, портретная, репортажная, семейная фотосессии. Профессиональное оборудование, быстрые сроки, адекватные цены"
	/>
</svelte:head>

<div class="main_page">
	<div class="video_canvas">
		<Videocanvas />
	</div>
	<div class="header_holder">
		<Header />
	</div>
	<div class="about">
		<AboutDesc />
	</div>

	<div class="gallery_holder">
		<div class="gallery gallery_top">
			{#each allph1 as item}
				<a data-sveltekit-reload href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
					<img
						style="aspect-ratio:{+item.Aspect};"
						class="gallery_img"
						src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
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
						src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
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
						src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
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
				<p class="hero_title">Профессиональное оборудование.</p>
				<p class="hero_title2">Качество в мельчайших деталях.</p>
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
		<!-- <a data-sveltekit-reload href="/reviews" class=" reviews_title"> -->
		<p class=" reviews_title">Отзывы</p>
		<!-- </a> -->
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
		<a data-sveltekit-reload href="/reviews" class="reviews_link">Посмотреть все отзывы</a>
	</div>
	<div class="price">
		<div class="price_desc">
			{#each priceDescriptionByWords as word}
				<span class="words">{word}</span>
			{/each}
			<!-- {priceDescription}  -->
			<a class="price_link" data-sveltekit-reload href="/price">цены</a>
		</div>

		<p class="finish_desc">
			Я буду рада стать вашим фотографом и помочь вам запечатлеть ваши самые яркие моменты жизни в
			красивых и незабываемых фотографиях. Свяжитесь со мной, чтобы обсудить детали вашей будущей
			фотосессии и дайте мне возможность помочь вам сохранить ваши эмоции и чувства на долгие годы.
		</p>
		<div class="telegramm_bot">
			<p class="bot_desc">
				Подписывайтесь на моего <a
					href="https://t.me/SvobodinaPhoto_bot"
					rel="noreferrer"
					target="_blank"
					>телеграм бота
				</a> , там я публикую информацию о своих фотопроектах, акциях и скидках.
			</p>
			<a class="qr" href="https://t.me/SvobodinaPhoto_bot" rel="noreferrer" target="_blank">
				<img class="qr" src="/icons/qr-code.svg" alt="bot" />
			</a>
		</div>
	</div>
	<div class="contact">
		<button class="disbut" aria-label="Button" on:click={order} type="button"
			><p class="cta">Заказать</p></button
		>
		{#if showDis}
			<div class="dis">
				<p class="disclemer">
					<span>*</span> Я не хочу собирать и обрабатывать информацию о вас, размещать здесь никому
					не нужную "политику конфеденциальности" и прочие радости,
					<!-- по типу "уведомить роскомнадзор" -->
					которые необходимо соблюдать по закону, чтобы сделать форму для заказа с сайта. <br />
					Поэтому ниже ссылки на <b>директ</b> во все разрешенные и запрещённые😎
					<!-- (используйте vpn) -->
					на территории РФ соцсети
					<br />
					<br />
					Напишите мне, я всегда рада ответить 😊
				</p>
			</div>
			<Contact />
		{/if}
	</div>
	<!-- <div class="lazy_holder">
			<div class="dis">
				<p class="disclemer">
					<span>*</span> Я не хочу собирать и обрабатывать информацию о вас, размещать здесь никому
					не нужную "политику конфеденциальности" и прочие радости по типу "уведомить роскомнадзор"
					которые необходимо соблюдать по закону, чтобы сделать форму для заказа с сайта. <br /> Поэтому
					ниже ссылки на директ во все разрешенные и запрещённые(используйте vpn) на територии РФ соцсети
					😁
				</p>
			</div>
			<div class="bot">
				<p class="disclemer">Для интровертов есть телеграмм бот</p>
				<a href="https://t.me/SvobodinaPhoto_bot" rel="noreferrer" target="_blank">
					<img class="qr" src="/icons/qr-code.svg" alt="bot" />
				</a>
			</div>
		</div> -->

	<!-- <div class="icons">
			<a href="https://t.me/svobodinaphoto/" rel="noreferrer" target="_blank">
				<img src="/icons/Telegram.svg" alt="Telegram" />
			</a>
			<a href="https://ig.me/m/svobodinaphoto/" rel="noreferrer" target="_blank">
				<img src="/icons/Instagram.svg" alt="instagram" />
			</a>
			<a href="https://vk.me/aasvobodina/" rel="noreferrer" target="_blank">
				<img src="/icons/VK.svg" alt="VK" />
			</a>
			<a href="https://wa.me/%2B79514616243" rel="noreferrer" target="_blank">
				<img src="/icons/Whatsapp.svg" alt="Whatsapp" />
			</a>
		</div> -->
	<!-- <a class="description3" href={link[count]} rel="noreferrer" target="_blank">
			<p>{social[count]}</p>
		</a> -->
	<!-- </div> -->
</div>

<style>
	:root {
		--rev_width: min(600px, 95%);
		--rev_x: calc((98vw - var(--rev_width)) / 8);
	}
	/* (window.innerWidth * 0.98 - Math.min(600, window.innerWidth * 0.95)) / reviewsSlice.lengt */
	/* :global(body) {
		background-color: white;
	} */
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
		/* mix-blend-mode: difference; */
		position: absolute;
		top: 0;
		display: grid;
		height: 100vh;
		width: min(90%, 1000px);
	}

	.about {
		position: relative;
		display: grid;
		/* align-content: space-evenly; */
		height: 300vh;
		width: min(95%, 1500px);
		row-gap: 20vw;
		margin: auto;
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
		border-radius: 10px;
		overflow: hidden;
		/* width: 100%;
		height: 100%; */
		/* object-fit: cover; */
		/* object-position: -2671px -2749px; */
		/* object-position: center; */
		border-radius: 10px;
		overflow: hidden;
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
		border-radius: 10px;
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
	.hero_list_holder {
		opacity: 0;
		grid-area: 1/1/3/2;
		align-self: center;
		justify-self: end;
		width: min(1000px, 75%);
	}
	.hero_list {
		font-size: clamp(16px, 14px + 0.5vw, 24px);
		color: rgb(0, 0, 0);
		text-indent: 2ch;
		border-left: 2px solid rgb(1, 175, 255);
		margin: auto;
		width: max(600px, 100%);
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
		font-size: clamp(16px, 18px + 1.5vw, 50px);
		color: black;
		/* width: 70%; */
		text-align: center;
		padding: 0;
		line-height: 1.2;
		/* margin: 0; */
	}
	.hero_title2 {
		opacity: 0;
		width: min(1000px, 90%);
		place-self: end end;
		grid-area: second;
		margin: 0;
	}
	.hero_title {
		opacity: 0;
		width: min(1000px, 90%);
		align-self: start;
		justify-self: end;
		grid-area: first;
		margin: 0;
	}
	.hero_title,
	.hero_title2 {
		margin-top: 5vh;
		margin-bottom: 5vh;
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
		/* display: none; */
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

	.gallery > a {
		display: block;
		overflow: hidden;
		border-radius: 10px;
	}
	.review_holder {
		overflow: hidden;
		position: absolute;
		height: 350px;
		width: var(--rev_width);
	}

	/* .review_holder:nth-child(2) {
		border: 10px solid red;
	}
	.review_holder:nth-child(3) {
		transform: translateX(calc(var(--rev_x) * 1));
	}
	.review_holder:nth-child(4) {
		transform: translateX(calc(var(--rev_x) * 2));
	}
	.review_holder:nth-child(5) {
		transform: translateX(calc(var(--rev_x) * 3));
	}
	.review_holder:nth-child(6) {
		transform: translateX(calc(var(--rev_x) * 4));
	}
	.review_holder:nth-child(7) {
		transform: translateX(calc(var(--rev_x) * 5));
	}
	.review_holder:nth-child(8) {
		transform: translateX(calc(var(--rev_x) * 6));
	}
	.review_holder:nth-child(9) {
		transform: translateX(calc(var(--rev_x) * 7));
	} */
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
		/* font-family: Cormorant Infant; */
		padding: 5px;
		margin: 0;
		text-align: center;
		font-size: calc(20px + 0.5vw);
		line-height: 1.1;
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
		/* font-family: Comfortaa, Sentinel SSm A, Sentinel SSm B, system-ui, -apple-system,
			BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
			Segoe UI Symbol; */
		font-size: clamp(16px, calc(0.7rem + 0.25vw), 24px);
		line-height: 1.2;
		font-weight: 150;
		color: rgb(0, 0, 0);
		white-space: pre-wrap;
	}
	.price {
		display: grid;
		/* grid-template-rows: 100vh auto auto; */
		width: min(1200px, 95%);
		margin: auto;
		margin-top: 15vh;
		/* height: auto; */
		row-gap: 10vh;
	}
	.price_desc,
	.bot_desc,
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
		height: auto;
	}
	.words {
		all: unset;
		text-indent: 0.5ch;
		display: inline-block;
		opacity: 0.15;
		/* color: rgba(128, 128, 128, 0.2); */
		/* width: fit-content; */
		/* padding-left: 1ch; */
	}
	.price_link {
		opacity: 0.15;
	}
	.bot_desc {
		/* width: max(250px, 40vw); */
		align-self: center;
	}
	a {
		background: -webkit-radial-gradient(
			circle,
			rgba(2, 0, 36, 1) 0%,
			rgba(27, 73, 231, 1) 60%,
			rgba(0, 212, 255, 1) 100%
		);
		background: radial-gradient(
			circle,
			rgba(2, 0, 36, 1) 0%,
			rgba(27, 73, 231, 1) 60%,
			rgba(0, 212, 255, 1) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.finish_desc {
		place-self: center start;
	}
	.telegramm_bot {
		place-self: center;
		display: grid;
		/* grid-auto-flow: column; */
		grid-template-columns: repeat(auto-fit, minmax(max(20vw, 250px), 1fr));
	}
	.qr {
		object-fit: contain;
		width: min(400px, 100%);
		height: 100%;
		place-self: center;
	}
	/* .description3 {
		font-family: Cormorant Infant;
		color: black;
		text-decoration: none;
		width: 100%;
		text-align: center;
		font-size: clamp(28px, 18px + 8vw, 70px);
		margin: 0;
	}
	.description3:hover {
		color: purple;
	}
	.description3 > p {
		padding-bottom: 40px;
		margin-bottom: 0px;
	} */

	.price > p > a {
		display: inline;
		text-decoration: none;
		color: purple;
	}
	.lazy_holder {
		display: grid;
		/* flex-wrap: wrap; */
		row-gap: 5vh;
		column-gap: 5vw;
		width: max(900px, 95%);
		margin: auto;
		grid-template-columns: repeat(auto-fit, minmax(max(40vw, 500px), 1fr));
	}
	.dis {
		width: min(1000px, 95%);
		margin: auto;
		/* flex: 1 1 700px; */
		/* place-self: center; */
	}
	.disbut {
		cursor: pointer;
		display: block;
		width: 70vw;
		margin: auto;
		/* border-radius: 5px; */
		border-top: 1px solid dodgerblue;
		border-bottom: 1px solid dodgerblue;
		color: black;
		text-align: center;
	}
	.disbut:hover {
		border-top: 1px solid purple;
		border-bottom: 1px solid purple;
	}

	/* CSS */
	.cta {
		margin: 0;
		text-align: center;
		font-size: clamp(22px, 14px + 7vw, 70px);
		background: -webkit-linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
		background-size: 400% 400%;
		-webkit-background-clip: text;
		animation: gradient 15s ease infinite;
		-webkit-text-fill-color: transparent;
	}
	.cta span {
		display: inline-block;
		border-top: 1px solid #2d2d2d;
		border-bottom: 1px solid #2d2d2d;
		/* padding: 0.5em 0.6em; */
	}
	.contact {
		padding: 7vh 0px;
	}
	.half {
		position: relative;
		top: 0;
		height: 50vh;
		background: linear-gradient(180deg, #ffffff, #ffffff, #e73c7e00);
	}
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	.button-38 {
		/* z-index: 1; */
		margin: auto;
		width: min(1000px, 90%);
		display: block;
		background-color: #ffffff;
		border: 0;
		border-radius: 0.5rem;
		color: #111827;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.25rem;
		padding: 0.75rem 0px;
		/* margin-bottom: 10vh; */
		text-align: center;
		text-decoration: none #d1d5db solid;
		text-decoration-thickness: auto;
		box-shadow:
			0 1px 3px 0 rgba(0, 0, 0, 0.1),
			0 1px 2px 0 rgba(0, 0, 0, 0.06);
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
	}

	#b {
		top: 2.5vh;
		width: 95%;
		left: 0;
		right: 0;
		margin: auto;
		height: 10vh;
		position: absolute;
		border-radius: 50px;
		cursor: pointer;
	}

	/* #b:hover::after {
		opacity: 0.5;
	} */

	#b::after {
		content: '';
		display: block;
		position: absolute;
		background: #ffffff;
		inset: 2px;
		border-radius: 45px;
		/* z-index: 1; */
		transition: opacity 0.3s ease;
	}

	@property --r2 {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}

	@property --x {
		syntax: '<length>';
		inherits: false;
		initial-value: 0px;
	}

	#b {
		background: conic-gradient(
			from calc(var(--r2) - 80deg) at var(--x) 5vh,
			#fff 0%,
			rgb(1, 175, 255) 20%,
			#fff 25%
		);
		animation:
			-0.64s rotating2 5s linear infinite,
			-0.64s x 5s linear infinite;
	}
	@keyframes x {
		/* w:h === 6:1 */
		/* with a 80px x-margin */
		0% {
			--x: 80px;
		}
		/* 6/(6+3.14) * 50% */
		32.82275711% {
			--x: calc(95vw - 80px);
		}
		50% {
			--x: calc(95vw - 80px);
		}
		/* 50% + 32.8% */
		82.82275711% {
			--x: 80px;
		}
		100% {
			--x: 80px;
		}
	}

	@keyframes rotating2 {
		0% {
			--r2: 0deg;
		}
		32.82275711% {
			--r2: 0deg;
		}
		50% {
			--r2: 180deg;
		}
		82.82275711% {
			--r2: 180deg;
		}
		100% {
			--r2: 360deg;
		}
	}

	.button-38:hover {
		background-color: rgb(249, 250, 251);
	}

	.button-38:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	.button-38:focus-visible {
		box-shadow: none;
	}
	.disclemer {
		/* width: fit-content; */
		/* width: 70%; */
		text-indent: 2ch;
		color: rgb(25, 0, 50);
		font-size: clamp(16px, calc(0.7rem + 0.25vw), 24px);
	}
	.bot {
		place-self: center;

		width: max(700px, 100%);
	}
	.bot > a {
		width: 100%;
	}

	/* .icons {
		display: grid;
		grid-auto-flow: column;
		justify-content: space-evenly;
		width: 100%;
		margin-top: 5vh;
		padding-bottom: 5vh;
	}
	.icons > a,
	.icons > a > img {
		height: 5vh;
	} */
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
		.hero_title,
		.hero_title2 {
			width: 100%;
			margin-top: 5vh;
			margin-bottom: 5vh;
		}
		.qr {
			display: none;
		}
		/* .icons {
			padding-bottom: 10vh;
		} */
	}
	h1 {
		margin: 0;
	}
</style>

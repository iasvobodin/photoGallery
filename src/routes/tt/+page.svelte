<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Lenis from '@studio-freight/lenis';
	import ResPic from '$lib/components/resPic.svelte';
	import Circl from '$lib/components/circl.svelte';
	gsap.registerPlugin(ScrollTrigger);

	export let data;

	let allph = data.allph;
	let reviewsSlice = data.reviews.slice(data.reviews.length - 7, data.reviews.length);

	let allphHor = allph.filter((e) => e.Aspect > 1);
	let allphVer = allph.filter((e) => e.Aspect < 1);

	let allph1 = allphHor.slice(0, 12);
	let allph2 = allphHor.slice(12, 18);
	let allph3 = allphVer;

	// console.log(allphHor, allphVer);
	// import LocomotiveScroll from 'locomotive-scroll';
	let items = 'SvobodinaPhoto';
	let holder,
		lenisScroll = 0,
		targetScroll = 0,
		videoCanvas,
		frameIndex = 0,
		maxlenisScroll,
		y;

	const frameQty = 259;
	// const currentFrame = (index) => `/frames2/frame  (${index}).webp`;
	const currentFrame = (index) => `/canva1/frame${index}.webp`;

	let images = [null]; // since everything else is 1-indexed, explicitly fill images[0]
	const preloadImages = () => {
		for (let i = 0; i < frameQty; i++) {
			images[i] = new Image();
			images[i].crossOrigin = 'Anonymous';
			images[i].src = currentFrame(i + 1);
		}
	};

	onMount(() => {
		const scaleCoef =
			window.innerWidth / window.innerHeight > 1
				? 1 / (8072 / window.innerHeight)
				: 1 / (5381 / window.innerWidth);
		// const scaleCoef = 1 / (8072 / aspect);
		// console.log(1 / scaleCoef, 'scaleCoef');

		const revHorizontalCoef =
			(window.innerWidth * 0.98 - Math.min(600, window.innerWidth * 0.95)) / 6;

		console.log(revHorizontalCoef, 'revHorizontalCoef');
		const lenis = new Lenis({
			lerp: 0.08
		});

		// lenis.on('scroll', (e) => {
		//   console.log(e)
		// })

		// function raf(time) {
		//   lenis.raf(time)
		//   requestAnimationFrame(raf)
		// }

		// requestAnimationFrame(raf)

		// let invis = anime({
		// 	targets: '.canva',
		// 	autoplay: false,
		// 	scale: 2,
		// 	translateY: '-15%',
		// 	translateX: '20%',
		// 	easing: 'linear'
		// });
		// let lettersMove = anime({
		// 	targets: '.letter',
		// 	translateY: '-100%',
		// 	translateX: '-100%',
		// 	opacity: 0,
		// 	delay: anime.stagger(150),
		// 	autoplay: false,
		// 	easing: 'linear'
		// });
		// const scroll = new LocomotiveScroll({
		//   el: document.querySelector("[data-scroll-container]"),
		//   smooth: true,
		//   getSpeed: true,
		// });
		const html = document.documentElement;
		// const canvas = document.getElementById('hero-lightpass');
		const context = videoCanvas.getContext('2d');

		preloadImages();

		const img = new Image();
		img.src = currentFrame(1);
		videoCanvas.width = 1920;
		videoCanvas.height = 1015;
		img.onload = function () {
			context.drawImage(img, 0, 0);
		};

		const updateImage = (index) => {
			context.drawImage(images[index], 0, 0);
		}; // = holder; //- window.innerHeight;
		// scroll.on("scroll", (func) => {
		//   const lenisScroll = func.scroll.y;
		//   const maxlenisScroll = holder.scrollHeight - window.innerHeight;
		//   const scrollFraction = lenisScroll / maxlenisScroll;
		//   console.log(func);
		//   const frameIndex = Math.min(
		//     frameQty - 1,
		//     Math.ceil(scrollFraction * frameQty)
		//   );
		//   console.log(frameIndex);
		//   requestAnimationFrame(() => updateImage(frameIndex + 1));
		// });
		// console.log(html.scrollHeight - window.innerHeight, holder, 259 * 30);
		const raf = (time) => {
			lenis.raf(time);

			// const frameIndex = Math.min(frameQty - 1, Math.ceil(lenisScroll / 15));

			updateImage(frameIndex);

			requestAnimationFrame(raf);
		};
		raf();

		lenis.on('scroll', ScrollTrigger.update);

		lenis.on('scroll', (e) => {
			frameIndex = Math.min(frameQty - 1, Math.ceil(e.scroll / 17));
			// console.log(window.scrollY, e.scroll, e.targetScroll, e.animatedScroll, e.velocity);
		});
		// gsap.ticker.lagSmoothing(0);
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		ScrollTrigger.create({
			trigger: '.canva',
			pin: true,
			start: 'top top',
			end: '+550% top',
			pinSpacing: false
		});
		gsap.set('.review_holder', {
			x: function (index, target, targets) {
				//function-based value
				return index * revHorizontalCoef;
			},
			y: function (index, target, targets) {
				//function-based value
				return index * ((window.innerHeight - window.innerHeight * 0.12 - 350) / 6);
			}
		});
		// gsap.to('.header', {
		// 	scrollTrigger: {
		// 		trigger: '.hed',
		// 		scrub: 1.1,
		// 		start: 'top 30%',
		// 		end: 'bottom center'
		// 		// pin: true
		// 		// pinSpacing: false,
		// 		// markers: true
		// 	},
		// 	opacity: 0,
		// 	ease: 'linear'
		// });
		gsap.to('.canva', {
			scrollTrigger: {
				trigger: '.about',
				scrub: 1,
				start: '80% top',
				end: '100% top'
				// markers: true
			},
			scale: 0.46,
			borderRadius: '20px',
			ease: 'linear'
		});
		// gsap.to('.sub_title', {
		// 	scrollTrigger: {
		// 		trigger: '.block_wedding',
		// 		// scrub: 1.1,
		// 		start: 'top top',
		// 		end: 'bottom top',
		// 		pin: '.sub_title',
		// 		pinSpacing: false
		// 		// markers: true
		// 	},
		// 	opacity: 1,
		// 	// color: 'black',
		// 	ease: 'linear'
		// });
		const tl = gsap.timeline({
			ease: 'linear',
			scrollTrigger: {
				trigger: '.gallery_holder',
				scrub: 1,
				pin: '.gallery_holder',
				// pinSpacing: false,
				// refreshPriority: -1,
				start: 'top top',
				end: '500% top'
				// markers: true
			}
		});

		tl.to(
			'.canva',
			{
				duration: 1.5,
				x: -5400
			},
			0
		);
		tl.to(
			'.gallery_middle',
			{
				xPercent: -150,
				duration: 1.5
				// onComplete: () => console.log('ffff')
			},
			0
		);
		tl.to(
			['.gallery_top', '.gallery_bottom'],
			{
				xPercent: 155,
				duration: 1.5
			},
			0
		);
		tl.to(
			'.hero_holder',
			{
				opacity: 1,
				duration: 0
			},
			window.innerWidth < 600 ? 0.7 : 1
		);
		tl.to(
			'.dummy1',
			{
				yPercent: -100,
				duration: 0.7
			},
			window.innerWidth < 600 ? 0.7 : 1
		);
		tl.to(
			'.dummy2',
			{
				yPercent: 100,
				duration: 0.7
			},
			window.innerWidth < 600 ? 0.7 : 1
		);
		tl.to(
			'.hero',
			{
				// width: '100%',
				// height: '100%',
				scale: scaleCoef,
				x: 0,
				y: 0
			},
			1.6
		);
		tl.to(
			['.hero_title', '.hero_title2', '.hero_list_holder'],
			{
				opacity: 1,
				duration: 0.2
			},
			1.8
		);

		gsap.to('.review', {
			scrollTrigger: {
				trigger: '.reviews',
				scrub: 1,
				pin: true,
				// snap: {
				// 	snapTo: 1 / 7,
				// 	duration: 0.001,
				// 	delay: 0,
				// 	ease: 'power4.in'
				// },
				start: 'top top',
				end: '300% top'
				// markers: true
			},
			x: 0,
			stagger: {
				amount: 7,
				each: 0.0001,
				ease: 'linear'
			},

			ease: 'linear'
		});
		// ScrollTrigger.create({
		// 	trigger: '.img_block1',
		// 	pin: '.img_block1',
		// 	start: 'top top',
		// 	end: '+200% top',
		// 	pinSpacing: false
		// });
		// ScrollTrigger.create({
		// 	trigger: '.img_block2',
		// 	pin: '.img_block2',
		// 	start: 'top top',
		// 	end: '+100% top'
		// 	// pinSpacing: false
		// });
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400&family=Cormorant+Infant&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<!-- <svelte:window bind:scrollY={y} on:scroll={checkScroll} /> -->
<!-- <ResPic
		class="img1"
		orintation={true}
		imageH="22-07-16-16-20-35"
		imageP="21-02-01-14-02-55"
		size={720}
	/> -->
<!-- <div bind:clientHeight={maxlenisScroll} class="holder"> -->
<canvas bind:this={videoCanvas} class="canva" data-scroll id="hero-lightpass" />
<div class="hed">
	<h1 class="header">Красивые и неповторимые моменты на фото.</h1>
	<p class="header">Фотосессии, которые сделают Ваши воспоминания незабываемыми.</p>
</div>
<!-- <div class="main_holder"> -->
<div class="about">
	<p class="about_desc p1">
		Приветствую Вас, Меня зовут Настя, и я профессиональный фотограф, который ценит индивидуальность
		и уникальность каждого клиента.
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
					alt=""
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
					alt=""
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
					alt=""
				/>
			</a>
		{/each}
	</div>
	<div class="hero_holder">
		<img class="hero" src="/hero/hero.avif" alt="" />
		<div class="hero_desc">
			<p class="hero_title">Профессиональное<br />оборудование.</p>
			<p class="hero_title2">Качество в<br />мельчайших деталях.</p>

			<div class="hero_list_holder">
				<q class="hero_list">
					Я уверена, что лучшая фотосессия - это та, которая проходит гладко и без сбоев. Именно
					поэтому я всегда имею при себе резервный комплект оборудования, чтобы независимо от того,
					что произойдет, я смогу сохранить всё что нафоткано непосильным трудом. Вы можете быть
					уверены, что я всегда буду готова к любым условиям!
				</q>
			</div>

			<div class="dummy1" />
			<div class="dummy2" />
		</div>
	</div>
</div>

<!-- </div> -->
<!-- </div> -->
<div class="reviews">
	<p class="reviews_title">Отзывы</p>
	{#each reviewsSlice as review}
		<div class="review_holder">
			<div class="review">
				<div class="ava">
					<img src="/img/rev/{review.id}.jpg" alt="ava" />
				</div>
				<div class="review__decription">
					<h5 class="review__name">{review.name}</h5>
					<p class="review__body">{review.body}</p>
				</div>
			</div>
		</div>
	{/each}
	<a data-sveltekit-reload href="/reviews" class="reviews_link">Все отзывы</a>
</div>
<div class="dummy" />

<style>
	:global(body) {
		background-color: white;
	}
	.dummy {
		height: 500vh;
		/* background-color: tomato; */
	}
	.holder {
		height: calc(259px * 30);
		/* background: #ffffff; */
		position: relative;
		overflow: hidden;
	}
	.canvas_holder {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.main__description {
		width: 100%;
		/* height: 100vh; */
		/* top: 0px; */
		/* position: sticky; */
		/* grid-template-rows: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr; */
		/* grid-template-columns: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr; */
	}

	.hed {
		/* mix-blend-mode: difference; */
		display: grid;
		height: 100vh;
		position: absolute;
		top: 0;
		/* margin: -100vh; */
		width: min(100%, 1000px);
	}
	.header {
		place-self: center;
		text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
		/* font-family: 'Roboto Mono', monospace; */
		font-size: clamp(14px, 14px + 3.5vw, 80px);
		line-height: 1.3;
		font-weight: 700;
		text-align: center;
		margin: 0;
		text-indent: 2ch;
		color: rgb(255, 255, 255);
		/* background-color: #ffffff; */
		/* background-image: linear-gradient(180deg, #ffffff, #44c1ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent; */
	}
	.main_holder {
		position: absolute;
		width: 100%;
		height: 200vh;
		/* overflow: hidden; */
		top: 150vh;
	}
	.about {
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
		background-color: #0000004f;
		padding: max(2vw, 30px);
		align-self: center;
		text-indent: 2ch;
		text-shadow: 0 2px 3px rgba(0, 0, 0, 0.4);
	}
	.about_desc:nth-child(odd) {
		justify-self: end;
	}
	.block_wedding {
		/* position: sticky; */
		/* top: 0; */
		/* height: 300vh; */
		margin-top: 50vh;
		/* position: relative; */
	}
	.img_block1,
	.img_block2 {
		height: 100vh;
		width: 100%;
		display: grid;
	}

	.img_block2 {
		/* padding-right: 2vw; */
	}

	.img_block1 :global(.img1) {
		place-self: center;
		grid-area: 1/1/2/2;
		width: 50vw;
		height: 50vh;
		border-radius: 20px;
		overflow: hidden;
	}

	.img_block2 :global(.img2) {
		place-self: end;
		grid-area: 1/1/2/2;
		width: 50vw;
		height: 50vh;
		border-radius: 20px;
		overflow: hidden;
	}
	.block_portait {
		margin-top: -100vh;
		transform: translateX(100%);
		background-color: white;
		height: 100vh;
		width: 100%;
		display: grid;
		border: 1px solid green;
	}
	.portrait :global(.portrait_img) {
		grid-area: 1/1/2/2;
		display: block;
		width: 50vw;
		height: 50vh;
		border-radius: 20px;
		overflow: hidden;
	}
	.portrait {
		grid-area: 1/1/2/2;
		width: 50vw;
		height: 50vh;
	}

	.portait_block1 {
		place-self: start;
	}
	.portait_block2 {
		place-self: center;
	}
	.portait_block3 {
		place-self: end;
	}

	.canva {
		z-index: -1;
		display: block;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100vh;
		margin: auto;
	}
	.block3 {
		height: 200vh;
		background-color: #000000;
	}
	.gallery_holder {
		position: relative;
		overflow: hidden;
		margin-top: 100vh;
		/* z-index: -1; */
		background: transparent;
		background-color: transparent;
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

		transform: translateX(-100%);
	}
	.gallery_middle {
		height: 50vh;
		transform: translateX(75vw);
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
	a {
		display: block;
		overflow: hidden;
		border-radius: 15px;
	}
	.hero_holder {
		/* z-index: -2; */
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
		margin: auto;
		background-color: white;
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
		width: min(1000px, 100%);
	}
	.hero_list {
		font-size: clamp(16px, 14px + 1.5vw, 24px);
		color: rgb(0, 0, 0);
		text-indent: 2ch;
		margin: auto;
		width: min(400px, 95%);
		display: block;
		border-radius: 10px;
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
		/* width: fit-content; */
		text-align: center;
		padding: 0;
		line-height: 1.2;
		/* margin: 0; */
	}
	.hero_title2 {
		opacity: 0;
		width: min(1000px, 100%);
		place-self: end end;
		grid-area: second;
	}
	.hero_title {
		opacity: 0;
		width: min(1000px, 100%);
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
	}
	.reviews_link {
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
	.reviews_link:hover {
		color: purple;
	}
	.review_holder {
		overflow: hidden;
		position: absolute;
		height: 350px;
		width: min(600px, 95%);
	}
	.review {
		/* height: var(--card__height); */
		width: 100%;
		height: 100%;
		/* opacity: 0; */
		/* box-shadow: -3rem 0 3rem -2rem #000; */
		transform: translateX(100%);
		border-radius: 5px;
		display: grid;
		grid-template-columns: minmax(30px, 200px) minmax(250px, 120ch);
	}
	/* <stop offset="0" stop-color="#57ebdb" />
        <stop offset="1" stop-color="#403ddb" /> */
	/* .review__body:before {
		content: '';
		z-index: -1;
		border-radius: 5px;
		background: linear-gradient(120deg, #57ebdb, #403ddb 41.07%, #070047 76.05%);
		position: absolute;
		top: -2px;
		left: -2px;
		width: calc(100% + 4px);
		height: calc(100% + 4px);
	} */
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
		/* white-space: pre-wrap; */
		/* grid-area: 1/1; */
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
		/* box-shadow: 5px 5px 5px 0px #292929; */
		/* filter: grayscale(100%); */
		/* grid-area: 1/1; */
		/* align-self: start; */
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
	/* .arrow {
		align-self: end;
		justify-self: end;
		margin-right: 2%;
		margin-bottom: 2%;
		width: 25px;
	} */
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

	@media (orientation: portrait) {
		.hero {
			transform: translate3d(-2960.19px, -2635.27px, 0px);
		}
		.hero_list_holder {
			display: none;
		}
	}
	@media (max-width: 1200px) {
		.ava {
			display: none;
		}
		.review {
			/* height: auto; */
			grid-template-columns: minmax(250px, 120ch);
		}
		.review__decription {
			/* height: auto; */
		}
	}
</style>

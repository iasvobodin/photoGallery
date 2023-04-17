<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Lenis from '@studio-freight/lenis';
	import ResPic from '$lib/components/resPic.svelte';
	gsap.registerPlugin(ScrollTrigger);

	export let data;

	let allph = data.allph;

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
			trigger: '.holder',
			pin: '.canva',
			start: 'top top',
			end: 'bottom top',
			pinSpacing: false
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
				pinSpacing: false,
				// refreshPriority: -1,
				start: 'top top',
				end: '500% top',
				markers: true
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
				duration: 1.5,
				onComplete: () => console.log('ffff')
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
			1
		);
		tl.to(
			'.dummy1',
			{
				yPercent: -100,
				duration: 0.3
			},
			1
		);
		tl.to(
			'.dummy2',
			{
				yPercent: 100,
				duration: 0.3
			},
			1
		);
		tl.to(
			'.hero',
			{
				width: '100%',
				height: '100%',
				// scale: 0.07,
				x: 0,
				y: 0
			},
			1.3
		);

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

		// gsap.to('.hero', {
		// 	scrollTrigger: {
		// 		trigger: '.hero_holder',
		// 		scrub: 0.9,
		// 		pin: true,
		// 		start: 'top top',
		// 		end: '250% top',
		// 		markers: true
		// 	},
		// 	width: '100%',
		// 	height: '100%',
		// 	// scale: 0.07,
		// 	x: 0,
		// 	y: 0,
		// 	ease: 'linear'
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
<div bind:clientHeight={maxlenisScroll} class="holder">
	<canvas bind:this={videoCanvas} class="canva" data-scroll id="hero-lightpass" />
	<div class="hed">
		<h1 class="header">Красивые и неповторимые моменты на фото.</h1>
		<p class="header">Фотосессии, которые сделают Ваши воспоминания незабываемыми.</p>
	</div>
	<!-- <div class="main_holder"> -->
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
				<div class="dummy1" />
				<div class="dummy2" />
			</div>
		</div>
	</div>

	<!-- </div> -->
</div>
<div class="dummy" />

<style>
	:global(body) {
		background-color: white;
	}
	.dummy {
		height: 300vh;
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
		row-gap: 30vh;
		margin: auto;
	}
	.about_desc {
		font-family: 'Cormorant Infant', serif;
		font-size: clamp(18px, 18px + 3vw, 36px);
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
		opacity: 0;
		position: absolute;
		top: 0;
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
		transform-origin: top left;
		/* width: 5381px;
		height: 8072px; */
		transform: translate3d(-2364.12px, -2547.02px, 0px);

		/* width: 100%;
		height: 100%; */
		object-fit: contain;
		/* object-position: -2671px -2749px; */
		/* object-position: center; */
	}
	.hero_desc {
		grid-template-rows: 1fr 1fr;
		top: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		display: grid;
		/* padding: 2vw; */
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr;
		grid-template-areas:
			'first'
			'second';
	}
	.hero_desc > p {
		font-size: clamp(18px, 18px + 5vw, 70px);
		color: black;
		width: fit-content;
		text-align: center;
		padding: 0;
		line-height: 1.2;
	}
	.hero_title2 {
		place-self: end;
		grid-area: second;
	}
	.hero_title {
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
</style>

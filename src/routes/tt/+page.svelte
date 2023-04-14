<script>
	import { onMount } from 'svelte';
	import anime from 'animejs';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Lenis from '@studio-freight/lenis';

	gsap.registerPlugin(ScrollTrigger);
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
		// window.addEventListener('scroll', () => {
		// 	//const
		// 	lenisScroll = html.lenisScroll;
		// 	console.log('lenisScroll', lenisScroll);
		// 	// lettersMove.seek(lenisScroll * 2);
		// 	// lettersMove.finished.then(() =>
		// 	// );
		// 	// lenisScroll > 500 && invis.seek(lenisScroll - 500);

		// 	// const scrollFraction = lenisScroll / maxlenisScroll;
		// 	// const frameIndex = Math.min(
		// 	//   frameQty - 1,
		// 	//   Math.ceil(scrollFraction * frameQty)
		// 	// );

		// 	// requestAnimationFrame(() => updateImage(frameIndex + 1));
		// });
		lenis.on('scroll', ScrollTrigger.update);

		lenis.on('scroll', (e) => {
			frameIndex = Math.min(frameQty - 1, Math.ceil(e.scroll / 17));
			// console.log(window.scrollY, e.scroll, e.targetScroll, e.animatedScroll, e.velocity);
		});
		// gsap.ticker.lagSmoothing(0);
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		gsap.to('.header', {
			scrollTrigger: {
				trigger: '.hed',
				scrub: 1.1,
				start: 'top 30%',
				end: 'bottom center'
				// pin: true
				// pinSpacing: false,
				// markers: true
			},
			opacity: 0,
			ease: 'linear'
		});
		gsap.to('.canva', {
			scrollTrigger: {
				trigger: '.about',
				scrub: 1.1,
				start: '80% top',
				end: '100% top',
				markers: true
			},
			// width: '70%',
			// height: '50%',
			scale: 0.55,
			// xPercent: 50,
			borderRadius: '20px',
			ease: 'linear'
		});
		// gsap.to('.p2', {
		// 	scrollTrigger: {
		// 		trigger: '.about',
		// 		scrub: 1.1,
		// 		start: '150% top',
		// 		end: '150% top'
		// 		// markers: true
		// 	},
		// 	opacity: 1,
		// 	// color: 'black',
		// 	ease: 'linear'
		// });
		// gsap.to('.p3', {
		// 	scrollTrigger: {
		// 		trigger: '.about',
		// 		scrub: 1.1,
		// 		start: '250% top',
		// 		end: '250% top'
		// 		// markers: true
		// 	},
		// 	opacity: 1,
		// 	ease: 'linear'
		// });
		// gsap.to('.p4', {
		// 	scrollTrigger: {
		// 		trigger: '.about',
		// 		scrub: 1.1,
		// 		start: '350% top',
		// 		end: '350% top'
		// 		// markers: true
		// 	},
		// 	opacity: 1,
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

<div bind:clientHeight={maxlenisScroll} class="holder">
	<div class="main__description">
		<canvas bind:this={videoCanvas} class="canva" data-scroll id="hero-lightpass" />
		<div class="hed">
			<h1 class="header">
				Красивые и неповторимые моменты на фото.<br />Фотосессии, которые сделают Ваше воспоминание
				незабываемым.
			</h1>
		</div>
	</div>
</div>
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
<div class="block2">
	<h2>Свадебная</h2>
	<img src="https://img.svobodinaphoto.ru/480_21-02-01-14-02-55.avif" alt="" />
	<img src="https://img.svobodinaphoto.ru/480_20-07-03-17-25-34.avif" alt="" />
</div>

<style>
	.holder {
		height: calc(259px * 30);
		background: #000;
		position: relative;
	}
	.main__description {
		width: 100%;
		height: 100vh;
		top: 0px;
		position: sticky;
		/* grid-template-rows: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr; */
		/* grid-template-columns: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr; */
	}

	.hed {
		/* mix-blend-mode: difference; */
		font-family: 'Roboto Mono', monospace;
		font-size: clamp(14px, 14px + 3.5vw, 80px);
		font-weight: 700;
		line-height: 1.3;
		position: absolute;
		top: 30vh;
		width: min(100%, 1000px);
	}
	.about {
		mix-blend-mode: luminosity;
		display: grid;
		align-content: space-evenly;
		height: 200vh;
		position: absolute;
		top: 150vh;
		width: min(95%, 1500px);
		row-gap: 7vh;
		margin: auto;
		right: 0;
		left: 0;
	}
	.about_desc {
		font-family: 'Cormorant Infant', serif;
		font-size: clamp(18px, 18px + 3vw, 50px);
		line-height: 1.25;
		margin: 0;
		max-width: 1000px;
		border-radius: 30px;
		background-color: #0000004f;
		/* opacity: 0; */
		padding: 4vw;
		align-self: center;
		text-indent: 2ch;
		text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
	}
	.about_desc:nth-child(odd) {
		justify-self: end;
	}
	.header {
		text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
		font-size: inherit;
		line-height: inherit;
		text-align: center;
		margin: 0;
		text-indent: 2ch;
		color: rgb(255, 255, 255);
		/* background-color: #ffffff; */
		/* background-image: linear-gradient(180deg, #ffffff, #44c1ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent; */
	}

	canvas {
		display: block;
		object-position: 65%;
		object-fit: cover;
		width: 100%;
		height: 100%;
		margin: auto;
	}
	.block2 {
		height: 200vh;
		background-color: #000000;
	}
</style>

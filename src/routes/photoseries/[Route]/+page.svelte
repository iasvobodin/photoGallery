<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import debounce from 'lodash.debounce';
	import { onMount, onDestroy } from 'svelte';
	import justifiedLayout from 'justified-layout';
	import { gsap } from 'gsap';
	import { browser } from '$app/environment';
	import { allPhotoseries } from '$lib/store.js';
	import { getStores, navigating, page, updated } from '$app/stores';
	import Navigation from '$lib/components/navigation.svelte';
	import Slider from '$lib/components/slider.svelte';
	import {
		afterNavigate,
		beforeNavigate,
		disableScrollHandling,
		goto,
		invalidate,
		invalidateAll,
		preloadCode,
		preloadData
	} from '$app/navigation';

	type LoyData = {
		setStyle: string;
		imageSrc?: string;
	};

	export let data: PageData;

	// console.log(data);
	// $: ({ photoSeries, allph } = data);
	let menuIsOpen = false,
		showSubMenu = false;

	let photoSeries = data.photoSeries;
	let allph = data.allph;
	// console.log(photoSeries);

	let paddingCoef, initH: number, initW: number;
	let setOpacity = false;
	let observer: IntersectionObserver;
	let observElements: Array<HTMLElement> = [],
		elementEntries: Array<Boolean> = [],
		menuAnimationOpen: gsap.core.Tween,
		menuAnimationClose: gsap.core.Tween,
		containerHeightLoy: String,
		layoutData: Array<LoyData> = [];

	let innerWidth: number, innerHeight: number; //BINDING SVELTE:WINDOW
	$: observElements = [];
	// NEED TO DEL COLOR FROM DB
	if (photoSeries) {
		layoutData = photoSeries.Colors.map((el, i) => {
			return {
				setStyle: `box-shadow: inset 0px 0px 0px 2px rgb(${el[0]});background-image: radial-gradient(circle at bottom center, rgb(${el[0]}),rgb(${el[1]}));`
			};
		});
	}

	function setLoy(galleryData: PageData['photoSeries'], width: number, height: number) {
		console.log('setloy');

		const layout = justifiedLayout([...galleryData!.Aspect], {
			fullWidthBreakoutRowCadence: 2,
			// showWidows: false, //CUT SOME PICTURES IN THE END
			targetRowHeight: height * 0.57,
			containerWidth: width, //* 2,
			containerPadding: {
				top: height * 0.08,
				right: width * 0.04, // window.innerWidth * paddingCoef,
				bottom: height * 0.08,
				left: width * 0.04 // window.innerWidth * paddingCoef
			},
			boxSpacing: {
				horizontal: width * 0.06,
				vertical: height * 0.06
			}
		});
		containerHeightLoy = `${layout.containerHeight}px`;

		layoutData = layout.boxes.map((el, i) => {
			return {
				boxes: el,
				imageSrc: `https://photoday.svobodinaphoto.store/${imageWidth(el.width)}_${
					galleryData!.ImageName[i]
				}`,
				setStyle: `
				position: absolute;
				margin:0;
				left:${Math.floor(el.left)}px;
				top:${Math.floor(el.top)}px;
					box-shadow: inset 0px 0px 0px 2px ${galleryData!.Colors[i][0]};
					width: ${Math.floor(el.width)}px;
					height: ${Math.floor(el.height)}px;
					background-image: radial-gradient(circle at bottom center, 
					${galleryData!.Colors[i][0]},
					${galleryData!.Colors[i][1]});
					`
			};
		});
	}

	function imageWidth(x: Number) {
		// [320, 480, 600, 720, 1024, 1440, 1920, 2560];
		const calcWidth =
			x < 320
				? 320
				: x < 480
				? 480
				: x < 600
				? 600
				: x < 720
				? 720
				: x < 1024
				? 1024
				: x < 1440
				? 1440
				: x < 1920
				? 1920
				: 2560;
		return calcWidth;
	}
	function initObserver(observElements: Array<HTMLElement>) {
		const options: IntersectionObserverInit = {
			rootMargin: '0px 0px 200px 0px'
		};
		const callback: IntersectionObserverCallback = (entries, observer) => {
			entries.forEach((entry) => {
				const customEventName = entry.isIntersecting ? 'viewportEnter' : 'viewportExit';
				entry.target.dispatchEvent(new CustomEvent(customEventName));
			});
		};

		observer = new IntersectionObserver(callback, options);
		observElements.forEach((element) => observer.observe(element));
	}
	function resize() {
		paddingCoef = innerWidth / innerHeight > 1 ? 0.12 : 0.05;

		if (initH != innerHeight && Math.abs(initH - innerHeight) < 100) {
			return;
		}

		setLoy(photoSeries, innerWidth, innerHeight);
		initH = innerHeight;
	}
	// function navigateNext() {
	// 	// console.log(+photoSeries!.id + 1 === allph!.length);
	// 	if (photoSeries && allph) {
	// 		if (+photoSeries.id + 1 === allph.length) {
	// 			return allph[allph.length - 1].Route.toLowerCase(); //go to start
	// 		} else {
	// 			return allph.find((e) => +e.Id === +photoSeries!.id + 1)?.Route.toLowerCase();
	// 		}
	// 	} else {
	// 		return '/';
	// 	}
	// }
	// const nextRoute = console.log(navigateNext(), 'next');

	function gsapRandomShift() {
		gsap.set('.tt', {
			delay: 0.5,
			duration: 0.8,
			x: `+=random(${-innerWidth * 0.02}, ${innerWidth * 0.02}, 5)`,
			y: `+=random(${-innerHeight * 0.02}, ${innerHeight * 0.02}, 5)`
		});
	}
	function changeData(photoSeries: PageData['photoSeries']) {
		onMount(() => {
			console.log('onmountVhangeData');

			setLoy(photoSeries, innerWidth, innerHeight);
			gsap.set('.tt', {
				delay: 0.5,
				duration: 0.8,
				x: `+=random(${-innerWidth * 0.04}, ${innerWidth * 0.04}, 5)`,
				y: `+=random(${-innerHeight * 0.045}, ${innerHeight * 0.045}, 5)`
			});
			initObserver(observElements);
		});
		afterNavigate(() => {
			setLoy(photoSeries, innerWidth, innerHeight);
			initObserver(observElements);
		});
	}

	// $: changeData(photoSeries);

	// afterNavigate(() => {
	// 	invalidateAll();
	// });
	// 	if (browser) {
	// 		console.log('browser', data, observElements.length1);

	// 		initObserver();

	// 		setLoy(data, innerWidth, innerHeight);
	// 	}
	// });
	function navigateNext(photoseriesList, Route) {
		photoseriesList.findIndex((e) => e.Route === Route);
		// console.log(+photoSeries!.id + 1 === photoseriesList!.length);
		// if (photoSeries && photoseriesList) {
		if (photoseriesList.findIndex((e) => e.Route === Route) + 1 === photoseriesList.length) {
			return photoseriesList[0].Route;
		} else {
			return photoseriesList[
				photoseriesList.findIndex((e) => e.Route === Route) + 1
			]?.Route.toLowerCase();
		}
		// } else {
		// 	return '/';
		// }
	}
	onMount(() => {
		initObserver(observElements);
		setLoy(photoSeries, innerWidth, innerHeight);
		gsapRandomShift();

		//SAVE INIT DEMENTIONS
		initH = window.innerHeight;
		initW = window.innerWidth;

		setOpacity = true; //SET OPACITY 1

		menuAnimationOpen = gsap.to('.navigation__main', {
			duration: 0.3,
			height: '+=500px',
			reversed: true,
			// yoyo: true,
			// y: '-=500px',
			ease: 'none',
			onReverseComplete: () => {
				// showSubMenu = !showSubMenu;
				console.log('onReverseComplete');
				menuIsOpen = !menuIsOpen;
			},
			onComplete: () => {
				showSubMenu = true;
				console.log('onComplete');
			},
			onStart: () => {
				console.log('onStart');
				menuIsOpen = !menuIsOpen;
			},
			onRepeat: () => {
				console.log('onRepeat');
			},

			paused: true
			// repeat: -1
		});

		menuAnimationClose = gsap.to('.navigation__main', {
			duration: 0.3,
			height: '-=500px',
			// y: '-=500px',
			ease: 'none',
			onReverseComplete: () => {
				showSubMenu = !showSubMenu;
			},
			onComplete: () => {
				showSubMenu = !showSubMenu;
			},
			paused: true
			// repeat: -1
		});

		window.addEventListener('resize', debounce(resize, 400));
	});

	onDestroy(() => {
		if (browser) {
			observer.disconnect();
			window.removeEventListener('resize', resize);
		}
	});
	const toogleMenu = () => {
		menuAnimationOpen.reversed() ? menuAnimationOpen.play() : menuAnimationOpen.reverse();
		menuIsOpen && (showSubMenu = false);
	};
	let link = [1, 2];
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:head>
	<title>{photoSeries && photoSeries.Title}</title>
</svelte:head>

{#if photoSeries}
	<h1 class="main__head">
		{photoSeries.Title}
	</h1>
{/if}
<div class="holder" style={`height: ${containerHeightLoy}`}>
	{#each layoutData as photo, index (index)}
		<div
			bind:this={observElements[index]}
			on:viewportEnter={() => (elementEntries[index] = true)}
			class="tt"
			class:setOpacity
			style={photo.setStyle}
		>
			{#if elementEntries[index]}
				<picture>
					<source srcSet="{photo.imageSrc}.avif" type="image/avif" />
					<source srcSet="{photo.imageSrc}.webp" type="image/webp" />
					<img
						decoding="async"
						loading="lazy"
						in:fade={{ delay: 200 }}
						draggable="false"
						src="{photo.imageSrc}.jpg"
						alt="SvobodinaPhot"
					/>
				</picture>
			{/if}
		</div>
	{/each}
</div>

{#if allph && photoSeries}
	<!-- <Navigation photoseriesList={allph} Route={photoSeries.Route} /> -->
	<a
		class="contact__link"
		data-sveltekit-reload
		href={`/photoseries/${navigateNext(allph, photoSeries.Route)}`}
		><p class="naviganion__next next__link">Следующая фотосерия</p></a
	>
	<Slider>
		<div class="text">
			{#each link as item}
				<div class="text_anim">
					{#each allph as item}
						<a
							data-sveltekit-reload
							href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}
						>
							<img src="https://photoday.svobodinaphoto.store/320_{item.Cover}.avif" alt="" />
							<!-- <p class="naviganion__next">{item.Title}&nbsp;&nbsp;&nbsp;</p> -->
						</a>
					{/each}

					<!-- <p>
					<a
						rel="noreferrer"
						target="_blank"
						class="contact__link"
						href="https://vk.com/svobodinaphoto">Группа VK&nbsp;&nbsp;&nbsp;</a
					>
				</p>

				<p>
					<a
						rel="noreferrer"
						target="_blank"
						class="contact__link"
						href="https://t.me/svobodinaphoto">Telegram&nbsp;&nbsp;&nbsp;</a
					>
				</p>
				<p>
					<a rel="noreferrer" target="_blank" class="contact__link" href="https://vk.me/aasvobodina"
						>VK&nbsp;&nbsp;&nbsp;</a
					>
				</p>
				<p>
					<a
						rel="noreferrer"
						target="_blank"
						class="contact__link"
						href="https://wa.me/%2B79514616243">WhatsApp&nbsp;&nbsp;&nbsp;</a
					>
				</p>
				<p>
					<a
						rel="noreferrer"
						target="_blank"
						class="contact__link"
						href="https://t.me/SvobodinaPhoto_bot">Telegram bot&nbsp;&nbsp;&nbsp;</a
					>
				</p>
				<p>
					<a rel="noreferrer" target="_blank" class="contact__link" href="tel:+79514616243"
						>Позвонить&nbsp;&nbsp;&nbsp;</a
					>
				</p> -->
				</div>
			{/each}
		</div>
	</Slider>
{/if}

<style>
	.tt {
		/* display: none; */
		border-radius: 5px;
		overflow: hidden;
		transition: transform 0.5s;
		margin: auto;
		margin-bottom: 10vh;
		height: 70vh;
		width: 80vw;
		opacity: 0;
	}
	.setOpacity {
		opacity: 1;
	}
	h1 {
		color: white;
	}

	/* .spic__holder {
		position: absolute;
		overflow: hidden;
		border-radius: 4px;
		transition: transform 0.5s;
	} */
	/* .wrapper {
		justify-content: center;
		width: 100%;
		height: 100vh;
		display: flex;
		position: absolute;
	} */

	.holder {
		position: relative;
		width: 100%;
		/* display: flex; */
		/* display: grid;
		grid-template-columns: repeat(auto-fill, minmax(max(38vw, 250px), 1fr));
		row-gap: 5vh;
		column-gap: 2vw; */
		/* height: 100vh; */
		/* overflow: hidden; */
		/* pointer-events: none; */
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.text {
		width: 98vw;
		overflow: hidden;
		height: 199px;
		display: flex;
		flex-wrap: nowrap;
		white-space: nowrap;
		margin: auto;
	}
	.text_anim {
		display: flex;
		flex-shrink: 0;
		height: 220px;
		align-items: center;
		animation: slide-left 100s linear infinite;
	}
	.text_anim > a > img {
		width: 150px;
		height: 150px;
		object-fit: cover;
		object-position: center;
		margin: auto;
		margin-right: 20px;
		border-radius: 10px;
	}
	@keyframes slide-left {
		from {
			-webkit-transform: translateX(0);
			transform: translateX(0);
		}
		to {
			-webkit-transform: translateX(-100%);
			transform: translateX(-100%);
		}
	}
	a {
		text-decoration: none;
		color: rgb(255, 255, 255);
		width: 100%;
	}
	a:hover {
		color: rgb(165, 0, 165);
	}
	.contact__link {
		white-space: pre-wrap;
		text-align: center;
		margin: 0;
		font-family: Comfortaa, Sentinel SSm A, Sentinel SSm B, system-ui, -apple-system,
			BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
			Segoe UI Symbol;
		font-size: clamp(14px, 1rem + 0.6vw, 32px);
		line-height: clamp(20px, 1.2rem + 0.7vw, 44px);
		font-weight: 150;
		width: 150px;
		/* margin-right: 2ch; */
	}
	.contact__link > p {
		margin: 0;

		/* margin-right: 2ch; */
	}
</style>

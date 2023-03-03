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

	let photoSeries = data.photoSeries;
	let allph = data.allph;

	let paddingCoef, initH: number, initW: number;
	let setOpacity = false;
	let observer: IntersectionObserver;
	let observElements: Array<HTMLElement> = [],
		elementEntries: Array<Boolean> = [],
		containerHeightLoy: String,
		layoutData: Array<LoyData> = [];

	let innerWidth: number, innerHeight: number; //BINDING SVELTE:WINDOW
	$: observElements = [];
	// NEED TO DEL COLOR FROM DB
	if (photoSeries) {
		layoutData = photoSeries.Spec.map((el, i) => {
			return {
				setStyle: `box-shadow: inset 0px 0px 0px 2px rgb(${el.Colors.color[0]});background-image: radial-gradient(circle at bottom center, rgb(${el.Colors.color[0]}),rgb(${el.Colors.color[1]}));`
			};
		});
	}

	function setLoy(galleryData: PageData['photoSeries'], width: number, height: number) {
		console.log('setloy');

		const layout = justifiedLayout([...galleryData!.Aspect], {
			fullWidthBreakoutRowCadence: 3,
			// showWidows: false, //CUT SOME PICTURES IN THE END
			targetRowHeight: height * 0.57,
			containerWidth: width, //* 2,
			containerPadding: {
				top: height * 0.08,
				right: width * 0.08, // window.innerWidth * paddingCoef,
				bottom: height * 0.08,
				left: width * 0.08 // window.innerWidth * paddingCoef
			},
			boxSpacing: {
				horizontal: width * 0.11,
				vertical: height * 0.11
			}
		});
		containerHeightLoy = `${layout.containerHeight}px`;

		layoutData = layout.boxes.map((el, i) => {
			return {
				boxes: el,
				imageSrc: `https://ik.imagekit.io/svobodinaphoto/tr:w-${imageWidth(el.width)}/${
					galleryData!.ImageName[i]
				}.jpg`,
				setStyle: `
				position: absolute;
				margin:0;
				left:${Math.floor(el.left)}px;
				top:${Math.floor(el.top)}px;
					box-shadow: inset 0px 0px 0px 2px rgb(${galleryData!.Spec[i].Color});
					width: ${Math.floor(el.width)}px;
					height: ${Math.floor(el.height)}px;
					background-image: radial-gradient(circle at bottom center, 
					rgb(${galleryData!.Spec[i].Colors.color[0]}),
					rgb(${galleryData!.Spec[i].Colors.color[1]}));
					`
				// position: absolute;
				// transform: translateX(${Math.floor(
				// 	el.left
				// 	// + gsap.utils.random(-width * 0.04, width * 0.04)
				// )}px) translateY(${Math.floor(
				// 	el.top
				// 	//  + gsap.utils.random(-height * 0.045, height * 0.045)
				// )}px);
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
	function navigateNext() {
		// console.log(+photoSeries!.id + 1 === allph!.length);
		if (photoSeries && allph) {
			if (+photoSeries.id + 1 === allph.length) {
				return allph[allph.length - 1].Route.toLowerCase(); //go to start
			} else {
				return allph.find((e) => +e.Id === +photoSeries!.id + 1)?.Route.toLowerCase();
			}
		} else {
			return '/';
		}
	}
	// const nextRoute = console.log(navigateNext(), 'next');

	function gsapRandomShift() {
		gsap.set('.tt', {
			delay: 0.5,
			duration: 0.8,
			x: `+=random(${-innerWidth * 0.04}, ${innerWidth * 0.04}, 5)`,
			y: `+=random(${-innerHeight * 0.045}, ${innerHeight * 0.045}, 5)`
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

	onMount(() => {
		initObserver(observElements);
		setLoy(photoSeries, innerWidth, innerHeight);
		gsapRandomShift();

		//SAVE INIT DEMENTIONS
		initH = window.innerHeight;
		initW = window.innerWidth;

		setOpacity = true; //SET OPACITY 1

		window.addEventListener('resize', debounce(resize, 400));
	});

	onDestroy(() => {
		if (browser) {
			observer.disconnect();
			window.removeEventListener('resize', resize);
		}
	});
	const nextRoute = () => {};
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
				<img
					decoding="async"
					in:fade={{ delay: 200 }}
					draggable="false"
					src={photo.imageSrc}
					alt="SvobodinaPhoto"
				/>
			{/if}
		</div>
	{/each}
</div>
<!-- data-sveltekit-reload -->

<div class="navigstion">
	<img class="navigstion__top" src="/icons/top.svg" alt="" />
	<a class="contact__link" data-sveltekit-reload href={`/${navigateNext()}`}
		><p class="naviganion__next">Следующая фотосерия</p></a
	>
</div>

<style>
	.navigstion__top {
		cursor: pointer;
		place-self: center;
		height: 25px;
		width: 25px;
	}
	.contact__link {
		position: relative;
		text-decoration: none;
		text-decoration-line: none;
		text-decoration-color: white;
		color: white;
		/* padding: 1vh; */
		justify-self: center;
		align-self: stretch;
		font-size: max(1.2vw, 20px);
		/* border-radius: 5px; */
		/* background-color: black; */
		width: fit-content;
		text-align: center;
	}
	.navigstion {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: 40px auto;
		margin: auto;
		height: 40px;
		width: min(80vw, 400px);
		border-radius: 10px;
		background-color: #303030;
		border: 1px solid white;
	}

	.naviganion__next {
		/* white-space: pre-wrap; */
		/* grid-area: 1/1; */
		/* align-self: start;
		justify-self: center; */
		cursor: pointer;
		font-family: Cormorant Infant;
		/* padding: 5px; */
		margin: 0;
		text-align: center;
		font-size: 25px;
		/* line-height: calc(20px + 1.2vw); */
		font-weight: 300;
		color: #ffffff;
		vertical-align: middle;
		margin: 0;
		place-self: center;
	}
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
	.gallery {
		pointer-events: none;
		width: calc(200% + 100px);
		/* overflow: hidden; */
		position: relative;

		/* color:rgb(110, 110, 30); */

		/* max-width: 95vw; */
		/* width: 80vw;
      margin: auto; */
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
	.review__title {
		font-family: Cormorant Infant;
		font-size: max(36px, 5.8vw);
		line-height: max(40px, 5.8vw);
		font-weight: 300;
		color: #ffffff;
		margin: 5vw;
	}

	.main__head2 {
		/* opacity: 0; */
		/* z-index: 3; */
		white-space: pre;
		/* transform: translate(0, -50%); */
		/* position: absolute; */
		/* top: calc((100vh - var(--plane__height)) / 4); */
		/* left: 1vw; */
		font-family: Cormorant Infant, sans-serif;
		font-weight: 300;
		color: rgb(255, 255, 255);
		margin: 0;
		font-size: clamp(14px, 2vw + 12px, 40px);
		line-height: clamp(18px, 2.5vw + 12px, 40px);
	}
	p {
		color: aliceblue;
	}
	.button {
		position: fixed;
		top: 10px;
		right: 70px;
		width: 45px;
		height: 45px;
		/* fill: white; */
		cursor: pointer;
	}
	.reverse__button {
		transform: rotate(180deg);
	}
</style>

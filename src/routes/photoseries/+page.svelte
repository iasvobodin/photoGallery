<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import debounce from 'lodash.debounce';
	import { onMount, onDestroy } from 'svelte';
	import justifiedLayout from 'justified-layout';
	import { gsap } from 'gsap';
	import { browser } from '$app/environment';

	type LoyData = {
		Title: string;
		Route: string;
		imageSrc?: string;
		boxStyle: string;
		titleStyle?: string;
	}[];

	export let data: PageData;

	let photoseries = data.photoseries,
		paddingCoef,
		initH: number,
		initW: number,
		setOpacity = false,
		observer: IntersectionObserver,
		observElements: Array<HTMLElement> = [],
		elementEntries: Array<Boolean> = [],
		containerHeightLoy: String,
		innerWidth: number,
		innerHeight: number,
		layoutData: LoyData = photoseries.Colors.map((el, i) => {
			return {
				Route: photoseries.Route[i],
				Title: photoseries.Title[i],
				boxStyle: `
			box-shadow: inset 0px 0px 0px 2px ${el[0]};
			background-image: radial-gradient(circle at bottom center, ${el[0]},${el[1]});`
			};
		});

	function setLoy(galleryData: PageData['photoseries'], width: number, height: number) {
		console.log('setloy');

		const layout = justifiedLayout([...galleryData.Aspect], {
			// fullWidthBreakoutRowCadence: 4,
			// showWidows: false, //CUT SOME PICTURES IN THE END
			targetRowHeight: height * 0.57,
			containerWidth: width, //* 2,
			containerPadding: {
				top: height * 0.03,
				right: width * 0.03, // window.innerWidth * paddingCoef,
				bottom: height * 0.03,
				left: width * 0.03 // window.innerWidth * paddingCoef
			},
			boxSpacing: {
				horizontal: width * 0.03,
				vertical: height * 0.03
			}
		});
		containerHeightLoy = `${layout.containerHeight}px`;

		layoutData = layout.boxes.map((el, i) => {
			return {
				Route: galleryData!.Route[i],
				Title: galleryData!.Title[i],
				titleStyle: `font-size:calc(16px + ${Math.floor(el.width) / 40}px)`,
				imageSrc: `/img/all/${imageWidth(el.width)}_${galleryData!.ImageName[i]}`,
				boxStyle: `
				position: absolute;
				margin:0;
				left:${Math.floor(el.left)}px;
				top:${Math.floor(el.top)}px;
				width: ${Math.floor(el.width)}px;
				height: ${Math.floor(el.height)}px;
				box-shadow: inset 0px 0px 0px 2px ${galleryData.Colors[i][0]};
				background-image: radial-gradient(circle at bottom center,
				${galleryData.Colors[i][0]},
				${galleryData.Colors[i][1]});
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

		setLoy(photoseries, innerWidth, innerHeight);
		initH = innerHeight;
	}

	function gsapRandomShift() {
		gsap.set('.tt', {
			delay: 0.5,
			duration: 0.8,
			x: `+=random(${-innerWidth * 0.01}, ${innerWidth * 0.01}, 5)`,
			y: `+=random(${-innerHeight * 0.01}, ${innerHeight * 0.01}, 5)`
		});
	}

	onMount(() => {
		initObserver(observElements);
		setLoy(photoseries, innerWidth, innerHeight);
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
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:head>
	<title>Фотосерии</title>
	<!-- <link rel="canonical" href={$page.url.href} /> -->
</svelte:head>
<!-- on:click={goto(`/photoseries/${photo.Route}`)} -->

<!-- <div class="review__image">
	<img src="https://ik.imagekit.io/svobodinaphoto/tr:w-1000/ph.jpg" alt="" />
</div> -->
<h1 class="main__head">Фотосерии</h1>
<div class="holder" style={`height: ${containerHeightLoy}`}>
	{#each layoutData as photo, index (index)}
		<div
			bind:this={observElements[index]}
			on:viewportEnter={() => (elementEntries[index] = true)}
			class="tt"
			class:setOpacity
			style={photo.boxStyle}
		>
			<a href={`/photoseries/${photo.Route}`}>
				{#if elementEntries[index]}
					<picture>
						<source srcSet="{photo.imageSrc}.avif" type="image/avif" />
						<source srcSet="{photo.imageSrc}.webp" type="image/webp" />
						<!-- loading="lazy" -->
						<img
							decoding="async"
							in:fade={{ delay: 200 }}
							draggable="false"
							src="{photo.imageSrc}.jpg"
							alt="SvobodinaPhot"
						/>
					</picture>
				{/if}
			</a>
			<h3 class="ph__Title" style={photo.titleStyle}>{photo.Title}</h3>
		</div>
	{/each}
</div>

<style>
	.review__image {
		width: 100%;
		height: 50vh;
		margin-bottom: 5vh;
	}
	.review__image > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 90%;
	}
	.ph__Title {
		position: absolute;
		bottom: 0px;
		line-height: 1.5;
		text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
	}
	.tt {
		cursor: pointer;
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
	.tt:before {
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		min-height: 20%;
		/* other styles (left, top, right, and padding) */
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
		background-image: linear-gradient(
			180deg,
			hsla(0, 0%, 35.29%, 0) 0%,
			hsla(0, 0%, 34.53%, 0.034375) 16.36%,
			hsla(0, 0%, 32.42%, 0.125) 33.34%,
			hsla(0, 0%, 29.18%, 0.253125) 50.1%,
			hsla(0, 0%, 24.96%, 0.4) 65.75%,
			hsla(0, 0%, 19.85%, 0.546875) 79.43%,
			hsla(0, 0%, 13.95%, 0.675) 90.28%,
			hsla(0, 0%, 7.32%, 0.765625) 97.43%,
			hsla(0, 0%, 0%, 0.8) 100%
		);
	}
	.setOpacity {
		opacity: 1;
	}
	h1 {
		color: white;
	}

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

	/* p {
		color: aliceblue;
	} */
</style>

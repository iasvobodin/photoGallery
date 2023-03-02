<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import debounce from 'lodash.debounce';
	import { onMount, tick } from 'svelte';
	import justifiedLayout from 'justified-layout';
	import { gsap } from 'gsap';

	let paddingCoef, initH: number, initW: number;
	$: galleryParams = {};
	let setOpacity = false;
	let layout,
		observElements: Array<HTMLElement> = [],
		elementEntries: Array<Boolean> = [],
		containerHeightLoy: String,
		height: number,
		wWidth = 500,
		wHeight = 500,
		opacity = 0,
		layoutData,
		// gallery = {},
		width: number;
	$: galleryHeight = 0;

	let innerWidth: number;
	let innerHeight: number;
	export let data;
	// console.log(data.data);

	const gallery = data;
	// NEED TO DEL COLOR FROM DB
	layoutData = gallery.Spec.map((el, i) => {
		return {
			setStyle: `box-shadow: inset 0px 0px 0px 2px rgb(${el.Colors.color[0]});background-image: radial-gradient(circle at bottom center, rgb(${el.Colors.color[0]}),rgb(${el.Colors.color[1]}));`
		};
	});

	function setLoy(galleryData, width: number, height: number) {
		console.log(width, 'WW');

		layout = justifiedLayout([...galleryData.Aspect], {
			fullWidthBreakoutRowCadence: 3,
			// showWidows: false,
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
					galleryData.ImageName[i]
				}.jpg`,
				setStyle: `
				position: absolute;
				margin:0;
				left:${Math.floor(el.left)}px;
				top:${Math.floor(el.top)}px;
					box-shadow: inset 0px 0px 0px 2px rgb(${galleryData.Spec[i].Color});
					width: ${Math.floor(el.width)}px;
					height: ${Math.floor(el.height)}px;
					background-image: radial-gradient(circle at bottom center, 
					rgb(${galleryData.Spec[i].Colors.color[0]}),
					rgb(${galleryData.Spec[i].Colors.color[1]}));
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
	function resize() {
		paddingCoef = innerWidth / innerHeight > 1 ? 0.12 : 0.05;

		if (initH != innerHeight && Math.abs(initH - innerHeight) < 100) {
			return;
		}

		setLoy(gallery, innerWidth, innerHeight);
		initH = innerHeight;
	}
	onMount(() => {
		setLoy(gallery, innerWidth, innerHeight);

		initH = window.innerHeight;
		initW = window.innerWidth;

		if (typeof IntersectionObserver !== 'undefined') {
			const options: IntersectionObserverInit | undefined = {
				rootMargin: '0px 0px 0px 0px'
			};
			const callback: IntersectionObserverCallback = (entries, observer) => {
				entries.forEach((entry) => {
					entry.target.dispatchEvent(
						new CustomEvent('intersect', { detail: { isIntersecting: entry.isIntersecting } })
					);
					if (entry.isIntersecting) {
						observer.unobserve(entry.target);
					}
				});
			};

			const observer = new IntersectionObserver(callback, options);
			observElements.forEach((element) => observer.observe(element));
		}
		// console.log(observElements);
		// wWidth = window.innerWidth;
		// wHeight = window.innerHeight;

		setOpacity = true; //SET OPACITY 1

		gsap.set('.tt', {
			delay: 0.5,
			duration: 0.8,
			x: `+=random(${-innerWidth * 0.04}, ${innerWidth * 0.04}, 5)`,
			y: `+=random(${-innerHeight * 0.045}, ${innerHeight * 0.045}, 5)`
		});
		window.addEventListener('resize', debounce(resize, 400));
	});
</script>

<svelte:head>
	<title>{gallery.Title}</title>
</svelte:head>

<svelte:window bind:innerWidth bind:innerHeight />

<h1 class="main__head">
	{gallery.Title}
</h1>

<!-- <p>{innerWidth} ww</p>
<p>{innerHeight} hh</p> -->
<div class="holder" style={`height: ${containerHeightLoy}`}>
	{#each layoutData as photo, index (index)}
		<div
			bind:this={observElements[index]}
			on:intersect={(e) => (elementEntries[index] = e.detail.isIntersecting)}
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

<style>
	/* :global(body) {
		margin: 0;
		background-color: black;
	} */
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
		display: block;
		opacity: 1;
	}
	h1 {
		color: white;
		/* display: none; */
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

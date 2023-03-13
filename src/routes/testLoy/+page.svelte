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
	// let allph = data.allph;
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
			// fullWidthBreakoutRowCadence: 2,
			// showWidows: false, //CUT SOME PICTURES IN THE END
			targetRowHeight: height * 0.05,
			containerWidth: width * 5, //* 2,
			containerPadding: {
				top: 0,
				right: 0, // window.innerWidth * paddingCoef,
				bottom: 0,
				left: 0 // window.innerWidth * paddingCoef
			},
			boxSpacing: {
				horizontal: 0,
				vertical: 0
			}
		});
		containerHeightLoy = `${layout.containerHeight}px`;

		layoutData = layout.boxes.map((el, i) => {
			return {
				boxes: el,
				imageSrc: `https://ik.imagekit.io/svobodinaphoto/tr:w-60}/${galleryData!.ImageName[i]}.jpg`,
				setStyle: `
				position: absolute;
				margin:0;
				left:${Math.floor(el.left)}px;
				top:${Math.floor(el.top)}px;
					width: ${Math.floor(el.width)}px;
					height: ${Math.floor(el.height)}px;
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
	onMount(() => {
		initObserver(observElements);
		setLoy(photoSeries, innerWidth, innerHeight);
		// gsapRandomShift();

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
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:head>
	<!-- <title>{photoSeries && photoSeries.Title}</title> -->
</svelte:head>

{#if photoSeries}
	<h1 class="main__head">
		<!-- {photoSeries.Title} -->
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
<!-- <div class="navigation__main">
	{#if showSubMenu && allph}
		<div class="holder__photoserieslink">
			{#each allph as item}
				<a
					class="contact__link"
					data-sveltekit-reload
					href={allph ? `/${item.Route.toLowerCase()}` : '/'}
					><p class="naviganion__next">{item.Title}</p></a
				>
			{/each}
		</div>
	{/if}
	<div class="navigstion">
		<img class="navigstion__top" src="/icons/menu.svg" alt="" />
		<a class="contact__link" data-sveltekit-reload href={`/${navigateNext()}`}
			><p class="naviganion__next">Следующая фотосерия</p></a
		>
		<img
			class:reverse__button={menuIsOpen}
			on:click={toogleMenu}
			class="navigstion__top"
			src="/icons/top.svg"
			alt=""
		/>
	</div>
</div> -->

<!-- {#if allph && photoSeries}
	<Navigation photoseriesList={allph} Route={photoSeries.Route} />
{/if} -->
<style>
	.tt {
		/* display: none; */
		/* border-radius: 5px; */
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
</style>

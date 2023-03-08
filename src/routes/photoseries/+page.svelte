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
		Title?: string;
		Route?: string;
		setStyle: string;
		imageSrc?: string;
	};

	export let data: PageData;

	// console.log(data);
	// $: ({ photoSeries, allph } = data);
	let menuIsOpen = false,
		showSubMenu = false;

	let photoSeries = data.photoseries;
	// let allph = data.allph;
	console.log(photoSeries);

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

	function setLoy(galleryData: PageData['photoseries'], width: number, height: number) {
		console.log('setloy');

		const layout = justifiedLayout([...galleryData!.Aspect], {
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
				imageSrc: `https://ik.imagekit.io/svobodinaphoto/tr:w-${imageWidth(el.width)}/${
					galleryData!.ImageName[i]
				}.jpg`,
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

	function gsapRandomShift() {
		gsap.set('.tt', {
			delay: 0.5,
			duration: 0.8,
			x: `+=random(${-innerWidth * 0.01}, ${innerWidth * 0.01}, 5)`,
			y: `+=random(${-innerHeight * 0.01}, ${innerHeight * 0.01}, 5)`
		});
	}
	function changeData(photoSeries: PageData['photoseries']) {
		onMount(() => {
			console.log('onmountVhangeData');

			setLoy(photoSeries, innerWidth, innerHeight);

			gsap.set('.tt', {
				delay: 0.5,
				duration: 0.8,
				x: `+=random(${-innerWidth * 0.01}, ${innerWidth * 0.01}, 5)`,
				y: `+=random(${-innerHeight * 0.01}, ${innerHeight * 0.01}, 5)`
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
		console.log(layoutData);

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
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:head>
	<title>{photoSeries && photoSeries.Title}</title>
</svelte:head>
<!-- on:click={goto(`/photoseries/${photo.Route}`)} -->

<h1 class="main__head">Фотосерии</h1>
<div class="holder" style={`height: ${containerHeightLoy}`}>
	{#each layoutData as photo, index (index)}
		<div
			bind:this={observElements[index]}
			on:viewportEnter={() => (elementEntries[index] = true)}
			class="tt"
			class:setOpacity
			style={photo.setStyle}
		>
			<h3 class="ph__Title">{photo.Title}</h3>
			{#if elementEntries[index]}
				<a href={`/photoseries/${photo.Route}`}>
					<img
						decoding="async"
						in:fade={{ delay: 200 }}
						draggable="false"
						src={photo.imageSrc}
						alt="SvobodinaPhoto"
					/></a
				>
			{/if}
		</div>
	{/each}
</div>

<style>
	.ph__Title {
		position: absolute;
		bottom: 0px;
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

	p {
		color: aliceblue;
	}
</style>

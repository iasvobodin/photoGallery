<script lang="ts">
	//@ts-nocheck
	import { onMount, onDestroy } from 'svelte';
	import { Curtains, Plane, TextureLoader } from 'curtainsjs';
	import fragment from '$lib/assets/sv.frag?raw';
	import vertex from '$lib/assets/sv.vert?raw';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	console.time('browser');
	console.time('onMount');
	let w;
	let h;
	let planesLoaded = false;
	//SLIDER VARIABLES
	let transitionDuration = 1000,
		progress = tweened(0, {
			duration: transitionDuration,
			easing: cubicOut
		});

	let images = [
		'https://photoday.svobodinaphoto.store/480_21-10-27-11-49-02.avif',
		'https://photoday.svobodinaphoto.store/480_23-01-21-14-13-57.avif',
		'https://photoday.svobodinaphoto.store/480_21-01-04-12-10-19.avif',
		'https://photoday.svobodinaphoto.store/480_21-01-06-13-39-15.avif',
		'https://photoday.svobodinaphoto.store/480_22-07-16-15-12-14.avif',
		'https://photoday.svobodinaphoto.store/480_21-01-04-12-42-47.avif',
		'https://photoday.svobodinaphoto.store/480_22-11-07-13-40-04.avif',
		'https://photoday.svobodinaphoto.store/480_22-10-03-12-17-08.avif',
		'https://photoday.svobodinaphoto.store/480_22-06-02-11-39-41.avif',
		'https://photoday.svobodinaphoto.store/480_22-11-30-11-53-38.avif',
		'https://photoday.svobodinaphoto.store/480_21-12-18-15-12-08.avif',
		'https://photoday.svobodinaphoto.store/480_22-06-02-11-10-36.avif',
		'https://photoday.svobodinaphoto.store/480_21-05-08-18-58-57.avif',
		'https://photoday.svobodinaphoto.store/480_21-03-09-11-42-38.avif',
		'https://photoday.svobodinaphoto.store/480_23-01-24-15-21-37.avif',
		'https://photoday.svobodinaphoto.store/480_22-07-16-16-39-20.avif',
		'https://photoday.svobodinaphoto.store/480_22-11-07-13-26-35.avif',
		'https://photoday.svobodinaphoto.store/480_21-10-03-12-39-01.avif',
		'https://photoday.svobodinaphoto.store/480_23-01-24-14-31-57.avif',
		'https://photoday.svobodinaphoto.store/480_23-01-24-15-12-57.avif',
		'https://photoday.svobodinaphoto.store/480_20-07-03-17-25-34.avif',
		'https://photoday.svobodinaphoto.store/480_23-01-21-14-29-41.avif',
		'https://photoday.svobodinaphoto.store/480_23-02-05-12-37-35.avif',
		'https://photoday.svobodinaphoto.store/480_22-07-16-15-00-46.avif',
		'/img/rev/480_dis3.avif'
	];
	let sliderData = [
		[
			'https://photoday.svobodinaphoto.store/480_21-10-27-11-49-02',
			'https://photoday.svobodinaphoto.store/480_23-01-21-14-13-57',
			'https://photoday.svobodinaphoto.store/480_21-01-04-12-10-19',
			'https://photoday.svobodinaphoto.store/480_21-01-06-13-39-15',
			'https://photoday.svobodinaphoto.store/480_22-07-16-15-12-14',
			'https://photoday.svobodinaphoto.store/480_21-01-04-12-42-47',
			'https://photoday.svobodinaphoto.store/480_22-11-07-13-40-04',
			'https://photoday.svobodinaphoto.store/480_22-10-03-12-17-08',
			'/img/rev/480_dis3'
		],
		[
			'https://photoday.svobodinaphoto.store/480_22-06-02-11-39-41',
			'https://photoday.svobodinaphoto.store/480_22-11-30-11-53-38',
			'https://photoday.svobodinaphoto.store/480_21-12-18-15-12-08',
			'https://photoday.svobodinaphoto.store/480_22-06-02-11-10-36',
			'https://photoday.svobodinaphoto.store/480_21-05-08-18-58-57',
			'https://photoday.svobodinaphoto.store/480_21-03-09-11-42-38',
			'https://photoday.svobodinaphoto.store/480_23-01-24-15-21-37',
			'https://photoday.svobodinaphoto.store/480_22-07-16-16-39-20',
			'/img/rev/480_dis3'
		],
		[
			'https://photoday.svobodinaphoto.store/480_22-11-07-13-26-35',
			'https://photoday.svobodinaphoto.store/480_21-10-03-12-39-01',
			'https://photoday.svobodinaphoto.store/480_23-01-24-14-31-57',
			'https://photoday.svobodinaphoto.store/480_23-01-24-15-12-57',
			'https://photoday.svobodinaphoto.store/480_20-07-03-17-25-34',
			'https://photoday.svobodinaphoto.store/480_23-01-21-14-29-41',
			'https://photoday.svobodinaphoto.store/480_23-02-05-12-37-35',
			'https://photoday.svobodinaphoto.store/480_22-07-16-15-00-46',
			'/img/rev/480_dis3'
		]
	];
	let slideshowState = {
		activeTextureIndex: 0,
		nextTextureIndex: 2, // does not care for now
		maxTextures: sliderData[0].length - 1, // planeElements[0].querySelectorAll('img').length - 1, // -1 because displacement image does not count
		isChanging: false,
		slideDuration: 3000
	};
	let canvas,
		activeTex = [],
		nextTex = [],
		planes = [],
		planeElements = [],
		curtains,
		loader,
		mapTexture,
		innerWidth,
		innerHeight,
		intensiv = 0.3,
		params = {
			vertexShader: vertex,
			fragmentShader: fragment,
			widthSegments: 32,
			heightSegments: 32, // 40*40*6 = 9600 vertices
			uniforms: {
				resolution: {
					name: 'uReso',
					type: '2f',
					value: [innerWidth, innerHeight]
				},
				progress: {
					name: 'uProgress',
					type: '1f',
					value: 0
				},
				intensiv: {
					name: 'uIntensiv',
					type: '1f',
					value: intensiv
				}
			}
		};
	let ccc,
		canvas2,
		textures = [],
		percentLoaded = 0;

	function preloadTextures() {
		let percentLoaded = 0;

		const loader = new TextureLoader(ccc);

		loader.loadImages(
			images,
			{},
			(texture) => {
				textures.push(texture);

				texture
					.onSourceLoaded(() => {})
					.onSourceUploaded(() => {
						percentLoaded++;
						if (percentLoaded === images.length) {
							console.timeEnd('browser');
						}
					});
			},
			(image, error) => {
				console.warn('there has been an error', error, ' while loading this image', image);
			}
		);
	}

	$: if (browser) {
		ccc = new Curtains({
			container: 'canvas',
			pixelRatio: Math.min(1.5, window.devicePixelRatio)
		});

		preloadTextures();
	}
	//SLIDER FUNCTIONS
	const animSlider = async () => {
		slideshowState.maxTextures++;
		slideshowState.nextTextureIndex = slideshowState.maxTextures % (sliderData[0].length - 1);
		// console.log(slideshowState.nextTextureIndex);

		planes.forEach((plane, i) => {
			nextTex[i].setSource(plane.images[slideshowState.nextTextureIndex]);
		});
		try {
			await progress.set(1);
			slideshowState.activeTextureIndex = slideshowState.nextTextureIndex;

			planes.forEach((plane, i) => {
				activeTex[i].setSource(plane.images[slideshowState.activeTextureIndex]);
			});
			//RESET TWEEN
			progress = tweened(0, {
				duration: transitionDuration,
				easing: cubicOut
			});
		} catch (error) {
			return function stop() {
				console.log(error, 'Todos Store Stopped');
			};
		}
	};

	const initCurtains = (container) => {
		curtains = new Curtains({
			watchScroll: false,
			container: container,
			pixelRatio: Math.min(1.5, window.devicePixelRatio)
		});
	};
	// initCurtains();
	function loadImage() {
		loader = new TextureLoader(curtains);

		// load an image with the loader
		// const image = new Image();
		// image.crossOrigin = 'anonymous';
		// image.src = '/img/rev/480_dis3';
		loader.loadImage(
			'/img/rev/480_dis3.jpg',
			{
				// texture options (we're only setting its sampler name here)
				sampler: 'mapTex'
			},
			(texture) => {
				console.log('3st');
				texture.onSourceLoaded(() => console.log('onSourceLoaded'));
				texture.onSourceUploaded(() => console.log('onSourceUploaded'));
				mapTexture = texture;
				// texture has been successfully created, you can safely use it
			},
			(image, error) => {
				console.log(error);

				// there has been an error while loading the image
			}
		);
	}
	function handlePlanes(plane) {
		plane
			.onLoading((texture) => {
				texture.setMinFilter(curtains.gl.LINEAR_MIPMAP_NEAREST);
			})
			.onReady(() => {
				if (plane.index === planes.length - 1) {
					planesLoaded = true;
					console.timeEnd('onMount');
				}

				plane.createTexture({
					sampler: 'mapTex',
					fromTexture: plane.textures[8]
				});

				activeTex[plane.index] = plane.createTexture({
					sampler: 'activeTex',
					fromTexture: plane.textures[slideshowState.activeTextureIndex]
				});

				nextTex[plane.index] = plane.createTexture({
					sampler: 'nextTex',
					fromTexture: plane.textures[slideshowState.nextTextureIndex]
				});
			})
			.onRender(() => {
				plane.uniforms.progress.value = $progress;
			});
	}
	const initPlanes = (htmlEl) => {
		htmlEl.forEach((el, i) => {
			const plane = new Plane(curtains, el, params);
			planes.push(plane);
			handlePlanes(plane);
		});
	};
	let intervalId;
	onMount(() => {
		// ccc.setContainer(canvas2);
		// curtains.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
		// container: container,
		// pixelRatio: Math.min(1.5, window.devicePixelRatio)
		// initCurtains(canvas);
		// // loadImage();
		// initPlanes(planeElements);
		// intervalId = setInterval(() => {
		// 	planesLoaded && animSlider();
		// }, slideshowState.slideDuration);
	});
	// onDestroy(() => clearInterval(intervalId));
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:head>
	<link
		rel="preload"
		href="/fonts/RobotoMono-VariableFont_wght.ttf"
		as="font"
		crossOrigin="anonymous"
	/>
</svelte:head>
<!-- bind:clientWidth={w} bind:clientHeight={h} -->

<div bind:this={canvas2} id="canvas" class="canvas" class:curtains-ready={planesLoaded} />

<style>
	:root {
		--font-size-main: clamp(40px, 8vw + 10px, 90px);
		--font-size: clamp(40px, 8vw + 10px, 100px);
		--slider-height: calc(max(100vh, 500px) - var(--font-size-main) * 2);
		--slide-width: calc(var(--slider-height) * 0.66);
		--test-container-height: calc(100vh - var(--font-size-main) * 2);
		--test-container-gap: var(--font-size-main);
		--test-holder-width: calc(var(--test-container-height) * 0.66);
	}

	.font__prop {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		font-size: var(--font-size-main);
		line-height: 1;
	}
	.canvas {
		pointer-events: none;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		display: block;
		opacity: 0;
		transition: opacity 2s;
		/* display: none; */

		/* width: 100%;
		height: 100vh; */
	}

	.curtains-ready {
		opacity: 1;
	}
	/* .slider {
		max-width: calc(var(--slide-width) * 4);
		justify-content: space-around;
		margin: auto;
		position: relative;
		top: var(--font-size-main);
		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(max(calc(var(--slide-width) - 400px), var(--slide-width)), 1fr)
		);
		column-gap: 1vw;
		row-gap: var(--font-size-main);
		width: calc((100vw - 2ch));
		height: var(--slider-height);
		overflow: hidden;
	} */
	.slider {
		position: relative;
		top: var(--font-size-main);
		display: flex;
		flex-wrap: wrap;
		column-gap: 3vw;
		height: var(--slider-height);
		overflow: hidden;
		row-gap: var(--font-size-main);
		justify-content: center;
	}
	.slide__holder {
		/* border: 1px solid red; */
		width: var(--test-holder-width);
		height: var(--slider-height);
		/* overflow: hidden; */
		position: relative;
		place-self: center;
		border-radius: 5px;
	}
	.text {
		position: absolute;
		bottom: 0;
		transform: rotate(270deg);
		transform-origin: bottom left;
		display: flex;
		flex-wrap: nowrap;
		white-space: nowrap;
		min-width: var(--slider-height);
	}
	.text_anim {
		display: flex;
		flex-shrink: 0;
		height: 3vw;
		align-items: center;
		animation: slide-left 10s linear infinite;
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
	.text_anim > p {
		margin: 0;
		font-family: Comfortaa, Sentinel SSm A, Sentinel SSm B, system-ui, -apple-system,
			BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
			Segoe UI Symbol;
		font-size: clamp(14px, 1rem + 0.6vw, 32px);
		line-height: clamp(20px, 1.2rem + 0.7vw, 44px);
		font-weight: 150;
		margin-right: 2ch;
	}

	.slide__holder > picture {
		place-self: center;
		display: block;
		position: absolute;
		/*top: 0;
		left: 0;
		right: 0;
		bottom: 0; */
		width: 100%;
		height: 100%;
	}
	.slide__holder > picture > img {
		display: none;
		width: 100%;
		height: 100%;
		margin: auto;
		object-fit: cover;
		object-position: center;
	}

	@media (max-width: 500px) {
		.slider {
			display: grid;
			width: calc((100vw - 2ch));
		}
		.slider img {
			width: 100%;
			height: 90%;
			margin-top: 10%;
			object-fit: cover;
			object-position: center;
		}
		.slide__holder {
			height: var(--slider-height);
			overflow: hidden;
		}
	}
</style>

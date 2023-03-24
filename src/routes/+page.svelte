<script lang="ts">
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { Curtains, Plane } from 'curtainsjs';
	import fragment from '$lib/assets/sv.frag?raw';
	import vertex from '$lib/assets/sv.vert?raw';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import justifiedLayout from 'justified-layout';
	let w;
	let h;

	//SLIDER VARIABLES
	let progress = tweened(0, {
		duration: 1000,
		easing: cubicOut
	});
	let slideshowState = {
		activeTextureIndex: 1,
		nextTextureIndex: 2, // does not care for now
		maxTextures: 8, // planeElements[0].querySelectorAll('img').length - 1, // -1 because displacement image does not count
		isChanging: false
	};
	let canvas,
		activeTex = [],
		nextTex = [],
		planes = [],
		planeElements = [],
		curtains,
		innerWidth,
		innerHeight,
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
				}
			}
		};
	let actt = true,
		layoutData = [];

	//SLIDER FUNCTIONS
	const act = () => {
		actt = !actt;
		// console.log(planes);

		if (slideshowState.activeTextureIndex < slideshowState.maxTextures) {
			slideshowState.nextTextureIndex = slideshowState.activeTextureIndex + 1;
		} else {
			slideshowState.nextTextureIndex = 1;
		}
		nextTex[0].setSource(planes[0].images[slideshowState.nextTextureIndex]);
		nextTex[1].setSource(planes[1].images[slideshowState.nextTextureIndex]);
		nextTex[2].setSource(planes[2].images[slideshowState.nextTextureIndex]);

		progress.set(1).then(() => {
			slideshowState.activeTextureIndex = slideshowState.nextTextureIndex;
			activeTex[0].setSource(planes[0].images[slideshowState.activeTextureIndex]);
			activeTex[1].setSource(planes[1].images[slideshowState.activeTextureIndex]);
			activeTex[2].setSource(planes[2].images[slideshowState.activeTextureIndex]);
			progress = tweened(0, {
				duration: 1000,
				easing: cubicOut
			});
		});
	};

	let ss = 0;
	let sliderData = [
		[
			'/img/rev/480_dis3',
			'https://photoday.svobodinaphoto.store/720_21-10-27-11-49-02',
			'https://photoday.svobodinaphoto.store/720_23-01-21-14-13-57',
			'https://photoday.svobodinaphoto.store/720_21-01-04-12-10-19',
			'https://photoday.svobodinaphoto.store/720_21-01-06-13-39-15',
			'https://photoday.svobodinaphoto.store/720_22-07-16-15-12-14',
			'https://photoday.svobodinaphoto.store/720_21-01-04-12-42-47',
			'https://photoday.svobodinaphoto.store/720_22-11-07-13-40-04',
			'https://photoday.svobodinaphoto.store/720_22-10-03-12-17-08'
		],
		[
			'/img/rev/480_dis',
			'https://photoday.svobodinaphoto.store/720_22-06-02-11-39-41',
			'https://photoday.svobodinaphoto.store/720_22-11-30-11-53-38',
			'https://photoday.svobodinaphoto.store/720_21-12-18-15-12-08',
			'https://photoday.svobodinaphoto.store/720_22-06-02-11-10-36',
			'https://photoday.svobodinaphoto.store/720_21-05-08-18-58-57',
			'https://photoday.svobodinaphoto.store/720_21-03-09-11-42-38',
			'https://photoday.svobodinaphoto.store/720_23-01-24-15-21-37',
			'https://photoday.svobodinaphoto.store/720_22-07-16-16-39-20'
		],
		[
			'/img/rev/480_dis3',
			'https://photoday.svobodinaphoto.store/720_22-11-07-13-26-35',
			'https://photoday.svobodinaphoto.store/720_21-10-03-12-39-01',
			'https://photoday.svobodinaphoto.store/720_23-01-24-14-31-57',
			'https://photoday.svobodinaphoto.store/720_23-01-24-15-12-57',
			'https://photoday.svobodinaphoto.store/720_20-07-03-17-25-34',
			'https://photoday.svobodinaphoto.store/720_23-01-21-14-29-41',
			'https://photoday.svobodinaphoto.store/720_23-02-05-12-37-35',
			'https://photoday.svobodinaphoto.store/720_22-07-16-15-00-46'
		]
	];
	// onMount(() => {
	// 	// let i = 3;
	// 	// setInterval(() => {
	// 	// 	i++;
	// 	// 	ss = i % 3;
	// 	// }, 2500);
	// });
	const initCurtains = (container) => {
		curtains = new Curtains({
			container: container,
			watchScroll: false,
			pixelRatio: Math.min(1.5, window.devicePixelRatio)
		});
	};
	const initPlanes = (htmlEl) => {
		htmlEl.forEach((el, i) => {
			const plane = new Plane(curtains, el, params);
			if (plane) {
				plane
					.onLoading((texture) => {
						texture.setMinFilter(curtains.gl.LINEAR_MIPMAP_NEAREST);
					})
					.onReady(() => {
						plane.createTexture({
							sampler: 'map',
							fromTexture: plane.textures[0]
						});

						activeTex[i] = plane.createTexture({
							sampler: 'activeTex',
							fromTexture: plane.textures[slideshowState.activeTextureIndex]
						});

						nextTex[i] = plane.createTexture({
							sampler: 'nextTex',
							fromTexture: plane.textures[slideshowState.nextTextureIndex]
						});
						planes.push(plane);
					})
					// .onReady(() => {
					// })
					.onRender(() => {
						plane.uniforms.progress.value = $progress;
					});
			}
		});
	};
	onMount(() => {
		console.log(planeElements);

		initCurtains(canvas);
		initPlanes(planeElements);
		// curtains.disableDrawing();
		setInterval(() => {
			act();
			// slideshowState.maxTextures++;
			// slideshowState.activeTextureIndex = slideshowState.maxTextures % 3;
		}, 6000);
	});
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
<div class="slider font__prop">
	<div bind:this={planeElements[0]} class="slide__holder">
		{#each sliderData[0] as img}
			<picture>
				<source srcSet="{img}.avif" type="image/avif" />
				<source srcSet="{img}.webp" type="image/webp" />
				<img
					crossorigin="anonymous"
					decoding="async"
					draggable="false"
					src="{img}.jpg"
					alt="SvobodinaPhot"
				/>
			</picture>
		{/each}
	</div>

	<div bind:this={planeElements[1]} class="slide__holder">
		{#each sliderData[1] as img}
			<picture>
				<source srcSet="{img}.avif" type="image/avif" />
				<source srcSet="{img}.webp" type="image/webp" />
				<img
					crossorigin="anonymous"
					decoding="async"
					draggable="false"
					src="{img}.jpg"
					alt="SvobodinaPhot"
				/>
			</picture>
		{/each}
		<div class="text">
			<div class="text_anim">
				<p>Super puper photographer ever!</p>
			</div>
			<div class="text_anim">
				<p>Super puper photographer ever!</p>
			</div>
			<div class="text_anim">
				<p>Super puper photographer ever!</p>
			</div>
		</div>
	</div>

	<div bind:this={planeElements[2]} class="slide__holder">
		{#each sliderData[2] as img}
			<picture>
				<source srcSet="{img}.avif" type="image/avif" />
				<source srcSet="{img}.webp" type="image/webp" />
				<img
					crossorigin="anonymous"
					decoding="async"
					draggable="false"
					src="{img}.jpg"
					alt="SvobodinaPhot"
				/>
			</picture>
		{/each}
	</div>
</div>

<div bind:this={canvas} id="canvas" />

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
		font-size: clamp(14px, 0.7rem + 0.35vw, 24px);
		line-height: clamp(20px, 1.2rem + 0.45vw, 32px);
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

	#canvas {
		pointer-events: none;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		display: block;
		/* display: none; */

		/* width: 100%;
		height: 100vh; */
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

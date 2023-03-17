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
	let col = [1, 2, 3];
	const columnResult = (w: 1920, h: 1080) => {
		console.log(w / (h * 0.66));

		if (Math.floor(w / (h * 0.66)) === 3) {
			col = [1, 2, 3];
		}
		if (Math.floor(w / (h * 0.66)) === 2) {
			col = [1, 2];
		}
		if (Math.floor(w / (h * 0.66)) === 1) {
			col = [1];
		}
	};
	$: columnResult(w, h);

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
			'/img/rev/dis3.jpeg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-10-27-11-49-02.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/23-01-21-14-13-57.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-01-04-12-10-19.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-01-06-13-39-15.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-07-16-15-12-14.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-01-04-12-42-47.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-11-07-13-40-04.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-10-03-12-17-08.jpg'
		],
		[
			'/img/rev/dis.jpeg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-06-02-11-39-41.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-11-30-11-53-38.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-12-18-15-12-08.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-06-02-11-10-36.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-05-08-18-58-57.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-03-09-11-42-38.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/23-01-24-15-21-37.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-07-16-16-39-20.jpg'
		],
		[
			'/img/rev/dis3.jpeg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-11-07-13-26-35.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/21-10-03-12-39-01.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/23-01-24-14-31-57.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/23-01-24-15-12-57.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/20-07-03-17-25-34.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/23-01-21-14-29-41.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/23-02-05-12-37-35.jpg',
			'https://ik.imagekit.io/svobodinaphoto/tr:w-480/22-07-16-15-00-46.jpg'
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

		// const layout = justifiedLayout([0.66, 0.66, 0.66], {
		// 	// fullWidthBreakoutRowCadence: 4,
		// 	// showWidows: false, //CUT SOME PICTURES IN THE END
		// 	targetRowHeight: h,
		// 	containerWidth: w, //* 2,
		// 	containerPadding: {
		// 		top: 0,
		// 		right: 0, // innerWidth * 0.1, // window.innerinnerWidth * paddingCoef,
		// 		bottom: 0,
		// 		left: 0 //innerWidth * 0.1 // window.innerinnerWidth * paddingCoef
		// 	},
		// 	boxSpacing: {
		// 		horizontal: 10,
		// 		vertical: 50
		// 	}
		// });
		// layoutData = layout.boxes.map((el, i) => {
		// 	return {
		// 		boxStyle: `
		// 		position: absolute;
		// 		margin:0;
		// 		left:${Math.floor(el.left)}px;
		// 		top:${Math.floor(el.top)}px;
		// 		width: ${Math.floor(el.width)}px;
		// 		height: ${Math.floor(el.height)}px;
		// 			`
		// 	};
		// });
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
<!-- <p style="background-color: black;">size: {w}px x {h}px {Math.floor(w / (h * 0.66))}</p> -->
<!-- <div bind:clientWidth={w} bind:clientHeight={h} class="test">
	{#each col as item}
		<div class="block" />
	{/each}
</div> -->
<div bind:clientWidth={w} bind:clientHeight={h} class="slider font__prop">
	{#each col as item, i}
		<div bind:this={planeElements[i]} class="slide__holder">
			{#each sliderData[i] as img}
				<img decoding="async" src={img} alt="svph" crossorigin="anonymous" />
			{/each}
		</div>
	{/each}
</div>

<div bind:this={canvas} id="canvas" />

<style>
	:root {
		--slider-height: calc(max(100vh, 500px) - var(--font-size) * 2);
		--slide-width: calc(var(--slider-height) * 0.66);
		--test-container-height: calc(100vh - var(--font-size) * 2);
		--test-container-gap: var(--font-size);
		--test-holder-width: calc(var(--test-container-height) * 0.66);
	}

	.slider {
		position: fixed;
		/* z-index: 99; */
		display: grid;
		/* overflow: hidden; */
		grid-auto-flow: column;
		/* grid-template-columns: repeat(auto-fill, minmax(var(--test-holder-width), 1fr)); */
		top: var(--font-size);
		left: calc(var(--font-size) * 2);
		right: calc(var(--font-size) * 2);
		bottom: var(--font-size);
		/* width: calc(100vw - var(--font-size) * 2); */
		height: var(--test-container-height);
		justify-content: space-around;
		/* column-gap: max(2vw, 5px); */
		margin: auto;
		/* border: 1px solid green; */
	}
	.block {
		border: 1px solid red;
		width: var(--test-holder-width);
	}

	.font__prop {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		font-size: var(--font-size);
		line-height: 1;
	}
	/* .slider {
		position: relative;
		top: var(--font-size);
		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(max(calc(var(--slide-width) - 400px), var(--slide-width)), 1fr)
		);
		column-gap: 1vw;
		row-gap: 10vh;
		width: calc((100vw - 2ch));
		height: var(--slider-height);
		overflow: hidden;
	} */
	.slide__holder {
		border: 1px solid red;
		width: var(--test-holder-width);
		height: var(--slider-height);
		overflow: hidden;
		display: grid;
		/* width: 90%; */
		place-self: center;
		border-radius: 5px;
	}
	.slider img {
		display: none;
		place-self: center;
		width: 100%;
		height: 100%;
		margin: auto;
		object-fit: contain;
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

<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { Curtains, Plane } from 'curtainsjs';
	import fragment from '$lib/assets/sv.frag?raw';
	import vertex from '$lib/assets/sv.vert?raw';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let progress = tweened(0, {
		duration: 1000,
		easing: cubicOut
	});
	let slideshowState = {
		activeTextureIndex: 1,
		nextTextureIndex: 2, // does not care for now
		maxTextures: 3, // planeElements[0].querySelectorAll('img').length - 1, // -1 because displacement image does not count

		isChanging: false,
		transitionTimer: 0
	};
	let canvas,
		activeTex = [],
		nextTex = [],
		planes = [],
		planeElement = [],
		curtains,
		innerWidth,
		innerHeight,
		params = {
			vertexShader: vertex,
			fragmentShader: fragment,
			widthSegments: 40,
			heightSegments: 40, // 40*40*6 = 9600 vertices
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
	let actt = true;
	const act = () => {
		actt = !actt;

		if (slideshowState.activeTextureIndex < slideshowState.maxTextures) {
			slideshowState.nextTextureIndex = slideshowState.activeTextureIndex + 1;
		} else {
			slideshowState.nextTextureIndex = 1;
		}
		nextTex.setSource(planes[0].images[slideshowState.nextTextureIndex]);

		progress.set(1).then(() => {
			slideshowState.activeTextureIndex = slideshowState.nextTextureIndex;
			activeTex.setSource(planes[0].images[slideshowState.activeTextureIndex]);
			progress = tweened(0, {
				duration: 1000,
				easing: cubicOut
			});
		});
	};

	onMount(() => {
		setInterval(() => {
			act();
			// slideshowState.maxTextures++;
			// slideshowState.activeTextureIndex = slideshowState.maxTextures % 3;
		}, 6000);

		curtains = new Curtains({
			container: canvas,
			watchScroll: false,
			pixelRatio: Math.min(1.5, window.devicePixelRatio)
		});
		planeElement.forEach((el, i) => {
			const plane = new Plane(curtains, el, params);
			if (plane) {
				plane
					.onLoading((texture) => {
						// improve texture rendering on small screens with LINEAR_MIPMAP_NEAREST minFilter
						texture.setMinFilter(curtains.gl.LINEAR_MIPMAP_NEAREST);
					})
					.onReady(() => {
						activeTex = plane.createTexture({
							sampler: 'activeTex',
							fromTexture: plane.textures[slideshowState.activeTextureIndex]
						});

						nextTex = plane.createTexture({
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
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="planes__holder">
	<div on:click={act} bind:this={planeElement[0]} class="plane">
		<img src="/img/rev/8.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/9.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/12.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/17.jpg" crossorigin="anonymous" alt="" />
		<img data-sampler="map" id="map" src="/img/rev/dis3.jpeg" crossorigin="anonymous" alt="" />
	</div>

	<!-- <div on:click={act} bind:this={planeElement[1]} class="plane">
		<img data-sampler="activeTex" src="/img/rev/10.jpg" crossorigin="anonymous" alt="" />
		<img data-sampler="nextTex" src="/img/rev/12.jpg" crossorigin="anonymous" alt="" />
		<img data-sampler="map" id="map" src="/img/rev/dis2.jpeg" crossorigin="anonymous" alt="" />
	</div> -->
</div>

<div bind:this={canvas} id="canvas" />

<style>
	#canvas {
		pointer-events: none;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 100vh;
	}
	.planes__holder {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.plane {
		position: relative;
		width: 80vw;
		height: calc(80vw * 1.5);
		margin: auto;
		place-self: center;
	}
	.plane img {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: none;
	}
</style>

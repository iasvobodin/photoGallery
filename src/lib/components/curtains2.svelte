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
		maxTextures: 7, // planeElements[0].querySelectorAll('img').length - 1, // -1 because displacement image does not count

		isChanging: false,
		transitionTimer: 0
	};
	let canvas,
		activeTex,
		nextTex,
		planes = [],
		planeElement = [],
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

	// onMount(() => {
	// 	setInterval(() => {
	// 		act();
	// 		// slideshowState.maxTextures++;
	// 		// slideshowState.activeTextureIndex = slideshowState.maxTextures % 3;
	// 	}, 6000);

	// 	curtains = new Curtains({
	// 		container: canvas,
	// 		watchScroll: false,
	// 		pixelRatio: Math.min(1.5, window.devicePixelRatio)
	// 	});
	// 	planeElement.forEach((el, i) => {
	// 		const plane = new Plane(curtains, el, params);
	// 		if (plane) {
	// 			plane
	// 				.onLoading((texture) => {
	// 					// improve texture rendering on small screens with LINEAR_MIPMAP_NEAREST minFilter
	// 					texture.setMinFilter(curtains.gl.LINEAR_MIPMAP_NEAREST);
	// 				})
	// 				.onReady(() => {
	// 					activeTex = plane.createTexture({
	// 						sampler: 'activeTex',
	// 						fromTexture: plane.textures[slideshowState.activeTextureIndex]
	// 					});

	// 					nextTex = plane.createTexture({
	// 						sampler: 'nextTex',
	// 						fromTexture: plane.textures[slideshowState.nextTextureIndex]
	// 					});
	// 					planes.push(plane);
	// 				})
	// 				// .onReady(() => {
	// 				// })
	// 				.onRender(() => {
	// 					plane.uniforms.progress.value = $progress;
	// 				});
	// 		}
	// 	});
	// });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="gallery">
	<div class="hor image">
		<img src="https://img.svobodinaphoto.ru/1024_22-11-30-12-00-39.jpg" alt="" />
	</div>
	<div class="text">
		<h2>Семейная</h2>
	</div>
	<div class="ver-large image">
		<img src="https://img.svobodinaphoto.ru/720_23-01-21-14-13-57.jpg" alt="" />
	</div>
	<div class="ver-small image">
		<img src="https://img.svobodinaphoto.ru/480_22-11-28-13-06-26.jpg" alt="" />
	</div>
</div>
<!-- <div class="planes__holder">
	<div on:click={act} bind:this={planeElement[0]} class="plane">
		<img data-sampler="map" id="map" src="/img/rev/dis3.jpeg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/8.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/9.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/12.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/17.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/18.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/2.jpg" crossorigin="anonymous" alt="" />
		<img src="/img/rev/19.jpg" crossorigin="anonymous" alt="" />
	</div>
</div> -->

<div bind:this={canvas} id="canvas" />

<style>
	.gallery {
		height: 100vh;
		display: grid;
		grid-template-columns:
			var(--font-size) var(--font-size) 1fr calc(var(--font-size) * 2) var(--font-size) var(
				--font-size
			)
			calc(var(--font-size) * 2) 1fr var(--font-size)
			var(--font-size);
		grid-template-rows:
			var(--font-size) var(--font-size) 1fr calc(var(--font-size) * 2) var(--font-size) var(
				--font-size
			)
			calc(var(--font-size) * 2) 1fr var(--font-size)
			var(--font-size);
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	.image,
	.text {
		/* border: 1px solid orange; */
	}
	.text {
		grid-area: 2/7/4/9;
		place-self: center;
		align-self: flex-start;
	}
	.hor {
		grid-area: 3/2/8/8;
		place-self: center;
		width: 58vw;
		aspect-ratio: 3/2;
		/* place-self: center; */
	}
	.ver-large,
	.ver-small {
		aspect-ratio: 2/3;
	}
	.ver-large {
		height: 68vh;
		grid-area: 3/8/10/10;
		justify-self: end;
		align-self: end;
	}
	.ver-small {
		height: 42vh;
		grid-area: 5/7/9/8;
		justify-self: start;
		align-self: end;
	}
	.text {
		width: fit-content;
		font-size: max(6vw, 40px);
	}
	@media (max-width: 1150px) {
		.hor {
			display: none;
		}
		.text {
			grid-area: 1/3/4/9;
			place-self: start center;
		}
		.ver-small {
			height: 70vh;
			grid-area: 3/3/9/6;
			justify-self: center;
			align-self: end;
		}
		.ver-large {
			height: 70vh;
			grid-area: 3/6/9/9;
			justify-self: center;
			align-self: end;
		}
	}
	@media (max-width: 900px) {
		.ver-small {
			display: none;
		}
		.ver-large {
			height: 70vh;
			grid-area: 3/3/9/9;
			justify-self: center;
			align-self: end;
		}
	}
	@media (max-width: 450px) {
		.gallery {
			height: 100vh;
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
		}
		.ver-large {
			height: 70vh;
			grid-area: auto;
			place-self: center;
		}
		.text {
			grid-area: auto;
			place-self: center;
		}
	}

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

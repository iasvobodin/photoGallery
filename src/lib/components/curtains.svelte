<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { Curtains, Plane } from 'curtainsjs/src/index.mjs';
	import { gsap } from 'gsap';

	const vs = `
        precision mediump float;

        // default mandatory variables
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;

        // varyings : notice we've got 3 texture coords varyings
        // one for the displacement texture
        // one for our visible texture
        // and one for the upcoming texture
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
        varying vec2 vActiveTextureCoord;
        varying vec2 vNextTextureCoord;

        // textures matrices
        uniform mat4 activeTexMatrix;
        uniform mat4 nextTexMatrix;

        // custom uniforms
        uniform float uTransitionTimer;


        void main() {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

            // varyings
            vTextureCoord = aTextureCoord;
            vActiveTextureCoord = (activeTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
            vNextTextureCoord = (nextTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;

            vVertexPosition = aVertexPosition;
        }
    `;
	const fs = `
        precision mediump float;

        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
        varying vec2 vActiveTextureCoord;
        varying vec2 vNextTextureCoord;

        // custom uniforms
        uniform float uTransitionTimer;
		uniform float uProgress;

        // our textures samplers
        // notice how it matches the sampler attributes of the textures we created dynamically
        uniform sampler2D activeTex;
        uniform sampler2D nextTex;
        uniform sampler2D displacement;

		mat2 getRotM(float angle) {
		    float s = sin(angle);
		    float c = cos(angle);
		    return mat2(c, -s, s, c);
		}
		const float PI = 3.1415;
		const float angle1 = PI *0.25;
		const float angle2 = -PI *0.75;


        void main() {
            // our displacement texture
            // vec4 displacementTexture = texture2D(displacement, vTextureCoord);

			// vec2 dispVec = vec2(displacementTexture.r, displacementTexture.g);


            // // slides transitions based on displacement and transition timer
            // vec2 firstDisplacementCoords = vActiveTextureCoord + displacementTexture.r * ((cos((uTransitionTimer + 90.0) / (90.0 / 3.141592)) + 1.0) / 1.25);
            // vec4 firstDistortedColor = texture2D(activeTex, vec2(vActiveTextureCoord.x, firstDisplacementCoords.y));

            // // same as above but we substract the effect
            // vec2 secondDisplacementCoords = vNextTextureCoord - displacementTexture.r * ((cos(uTransitionTimer / (90.0 / 3.141592)) + 1.0) / 1.25);
            // vec4 secondDistortedColor = texture2D(nextTex, vec2(vNextTextureCoord.x, secondDisplacementCoords.y));

            // // mix both texture
            // vec4 finalColor = mix(firstDistortedColor, secondDistortedColor, 1.0 - ((cos(uTransitionTimer / (90.0 / 3.141592)) + 1.0) / 2.0));

            // // handling premultiplied alpha
            // finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

            // gl_FragColor = finalColor;

			vec4 displacementTexture = texture2D(displacement, vTextureCoord);

			vec2 dispVec = vec2(displacementTexture.r, displacementTexture.g);

			vec2 distortedPosition1 = vActiveTextureCoord + getRotM(angle1) * dispVec * 1.0 * uProgress;
			vec4 t1 = texture2D(activeTex, distortedPosition1);
			vec2 distortedPosition2 = vNextTextureCoord + getRotM(angle2) * dispVec * 1.0 * (1.0 - uProgress);
			vec4 t2 = texture2D(nextTex, distortedPosition2);
			gl_FragColor = mix(t1, t2, uProgress);
        }
    `;

	let webgl,
		plane,
		activeTex,
		nextTex,
		curtains,
		multiTexturesPlane,
		params = {
			vertexShader: vs,
			fragmentShader: fs,
			uniforms: {
				transitionTimer: {
					name: 'uTransitionTimer',
					type: '1f',
					value: 0
				},
				progress: {
					name: 'uProgress',
					type: '1f',
					value: 0
				}
			}
		},
		slideshowState = {
			activeTextureIndex: 1,
			nextTextureIndex: 2, // does not care for now
			maxTextures: 4, // planeElements[0].querySelectorAll('img').length - 1, // -1 because displacement image does not count

			isChanging: false,
			transitionTimer: 0
		};
	let actt = true;
	const act = () => {
		actt = !actt;
		!actt &&
			gsap.to(multiTexturesPlane.uniforms.progress, {
				value: 1
			});
		actt &&
			gsap.to(multiTexturesPlane.uniforms.progress, {
				value: 0
			});
	};
	const planeclick = () => {
		act();
		// planeElements[0].addEventListener('click', () => {
		if (!slideshowState.isChanging) {
			// enable drawing for now
			curtains.enableDrawing();

			slideshowState.isChanging = true;

			// check what will be next image
			if (slideshowState.activeTextureIndex < slideshowState.maxTextures) {
				slideshowState.nextTextureIndex = slideshowState.activeTextureIndex + 1;
			} else {
				slideshowState.nextTextureIndex = 1;
			}
			// apply it to our next texture
			nextTex.setSource(multiTexturesPlane.images[slideshowState.nextTextureIndex]);

			setTimeout(() => {
				// disable drawing now that the transition is over
				curtains.disableDrawing();

				slideshowState.isChanging = false;
				slideshowState.activeTextureIndex = slideshowState.nextTextureIndex;
				// our next texture becomes our active texture
				activeTex.setSource(multiTexturesPlane.images[slideshowState.activeTextureIndex]);
				// reset timer
				slideshowState.transitionTimer = 0;
			}, 1700); // add a bit of margin to the timer
		}
	};
	onMount(() => {
		setInterval(() => {
			slideshowState.maxTextures++;
			ss = slideshowState.maxTextures % 3;
		}, 2500);

		// set up our WebGL context and append the canvas to our wrapper
		curtains = new Curtains({
			container: webgl,
			watchScroll: false, // no need to listen for the scroll in this example
			pixelRatio: Math.min(1.5, window.devicePixelRatio) // limit pixel ratio for performance
		});

		curtains
			.onError(() => {})
			.onContextLost(() => {
				// on context lost, try to restore the context
				curtains.restoreContext();
			});

		// disable drawing for now
		curtains.disableDrawing();

		multiTexturesPlane = new Plane(curtains, plane, params);

		multiTexturesPlane
			.onLoading((texture) => {
				// improve texture rendering on small screens with LINEAR_MIPMAP_NEAREST minFilter
				texture.setMinFilter(curtains.gl.LINEAR_MIPMAP_NEAREST);
			})
			.onReady(() => {
				// the idea here is to create two additionnal textures
				// the first one will contain our visible image
				// the second one will contain our entering (next) image
				// that way we will deal with only activeTex and nextTex samplers in the fragment shader
				// and we could easily add more images in the slideshow...

				// first we set our very first image as the active texture
				activeTex = multiTexturesPlane.createTexture({
					sampler: 'activeTex',
					fromTexture: multiTexturesPlane.textures[slideshowState.activeTextureIndex]
				});
				// next we set the second image as next texture but this is not mandatory
				// as we will reset the next texture on slide change
				nextTex = multiTexturesPlane.createTexture({
					sampler: 'nextTex',
					fromTexture: multiTexturesPlane.textures[slideshowState.nextTextureIndex]
				});
			})
			.onRender(() => {
				// increase or decrease our timer based on the active texture value
				if (slideshowState.isChanging) {
					// use damping to smoothen transition
					slideshowState.transitionTimer += (90 - slideshowState.transitionTimer) * 0.04;

					// force end of animation as damping is slower the closer we get from the end value
					if (slideshowState.transitionTimer >= 88.5 && slideshowState.transitionTimer !== 90) {
						slideshowState.transitionTimer = 90;
					}
				}

				// update our transition timer uniform
				multiTexturesPlane.uniforms.transitionTimer.value = slideshowState.transitionTimer;
			});
	});
</script>

<div bind:this={plane} class="flex-wrapper multi-textures">
	<span on:click={planeclick}>Click me !</span>
	<!-- notice here we are using the data-sampler attribute to name our displacement sampler uniform -->
	<img src="/img/rev/dis.jpeg" crossorigin="" data-sampler="displacement" alt="" />
	<img src="/img/rev/1.jpg" crossorigin="" alt="" />
	<img src="/img/rev/2.jpg" crossorigin="" alt="" />
	<img src="/img/rev/8.jpg" crossorigin="" alt="" />
	<img src="/img/rev/5.jpg" crossorigin="" alt="" />
</div>

<div bind:this={webgl} id="canvas" />
<button on:click={act}>GSAP</button>

<style>
	#canvas {
		display: block;
		width: 100%;
		height: 100vh;
	}
	.multi-textures {
		position: absolute;
		top: 5%;
		right: 5%;
		bottom: 5%;
		left: 5%;
		z-index: 15;

		cursor: pointer;
		font-size: 3em;
		color: white;

		justify-content: center;
		align-items: center;
		align-content: center;
	}

	.multi-textures img {
		display: none;
		min-width: 100%;
		min-height: 100%;
		object-fit: cover;
	}
	img {
		overflow-clip-margin: content-box;
		overflow: clip;
	}
</style>

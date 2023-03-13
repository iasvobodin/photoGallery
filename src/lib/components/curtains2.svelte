<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { Curtains, Plane } from 'curtainsjs/src/index.mjs';
	import { gsap } from 'gsap';
	// import { Curtains } from 'curtainsjs/src/core/Curtains.js';
	// import { Plane } from 'curtainsjs/src/core/Plane.js';
	// const { Curtains, Plane } = pkg;
	let actt = true;
	const vs = `
	#ifdef GL_ES
  precision mediump float;
  #endif

  // those are the mandatory attributes that the lib sets
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;

  // those are mandatory uniforms that the lib sets and that contain our model view and projection matrix
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  uniform mat4 texture0Matrix;
  uniform mat4 texture1Matrix;
  uniform mat4 mapMatrix;

  // if you want to pass your vertex and texture coords to the fragment shader
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord0;
  varying vec2 vTextureCoord1;
  varying vec2 vTextureCoordMap;

  void main() {
    vec3 vertexPosition = aVertexPosition;

    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    // set the varyings
    vTextureCoord0 = (texture0Matrix * vec4(aTextureCoord, 0., 1.)).xy;
    vTextureCoord1 = (texture1Matrix * vec4(aTextureCoord, 0., 1.)).xy;
    vTextureCoordMap = (mapMatrix * vec4(aTextureCoord, 0., 1.)).xy;
    vVertexPosition = vertexPosition;
  }`;
	const fs = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define PI2 6.28318530718
  #define PI 3.14159265359
  #define S(a,b,n) smoothstep(a,b,n)

  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uReso;
  uniform vec2 uMouse;
  
  // get our varyings
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord0;
  varying vec2 vTextureCoord1;
  varying vec2 vTextureCoordMap;

  // the uniform we declared inside our javascript

  // our texture sampler (default name, to use a different name please refer to the documentation)
  uniform sampler2D texture0;
  uniform sampler2D texture1;
  uniform sampler2D map;

  // http://www.flong.com/texts/code/shapers_exp/
  float exponentialEasing (float x, float a){

    float epsilon = 0.00001;
    float min_param_a = 0.0 + epsilon;
    float max_param_a = 1.0 - epsilon;
    a = max(min_param_a, min(max_param_a, a));

    if (a < 0.5){
      // emphasis
      a = 2.0 * a;
      float y = pow(x, a);
      return y;
    } else {
      // de-emphasis
      a = 2.0 * (a-0.5);
      float y = pow(x, 1.0 / (1.-a));
      return y;
    }
  }

  vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;
    color += texture2D(image, uv) * 0.1964825501511404;
    color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
    return color;
  }

  void main(){
    vec2 uv0 = vTextureCoord0;
    vec2 uv1 = vTextureCoord1;

    float progress0 = uProgress;
    float progress1 = 1. - uProgress;

    vec4 map = blur13(map, vTextureCoordMap, uReso, vec2(2.)) + 0.5;

    uv0.x += progress0 * map.r;
    uv1.x -= progress1 * map.r;

    vec4 color = texture2D( texture0, uv0 );
    vec4 color1 = texture2D( texture1, uv1 );

    gl_FragColor = mix(color, color1, progress0 );          
  }`;

	let canvas,
		plane,
		planeElement,
		webGLCurtain,
		innerWidth,
		innerHeight,
		params = {
			vertexShader: vs,
			fragmentShader: fs,
			widthSegments: 40,
			heightSegments: 40, // 40*40*6 = 9600 vertices
			uniforms: {
				time: {
					name: 'uTime',
					type: '1f', // this means our uniform is a float
					value: 0
				},
				mousepos: {
					name: 'uMouse',
					type: '2f',
					value: [0, 0]
				},
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

	const act = () => {
		actt = !actt;
		!actt &&
			gsap.to(plane.uniforms.progress, 0.8, {
				value: 1
			});
		actt &&
			gsap.to(plane.uniforms.progress, 0.8, {
				value: 0
			});
	};
	onMount(() => {
		webGLCurtain = new Curtains({
			container: canvas,
			watchScroll: false,
			pixelRatio: Math.min(1.5, window.devicePixelRatio)
		});

		plane = new Plane(webGLCurtain, planeElement, params);

		if (plane) {
			plane.onReady(() => {
				plane.onRender(() => {
					plane.uniforms.time.value += 0.01;
					plane.uniforms.resolution.value = [innerWidth, innerHeight];
				});
				// gsap.to(plane.uniforms.progress, 0.8, {
				// 	value: 1
				// });
				// gsap.to(plane.uniforms.progress, 0.8, {
				// 	value: 0
				// });
			});
		}
		// webgl = new WebglHover({
		// 	canvas,
		// 	plane
		// });
		// webgl.initPlane();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div on:click={act} bind:this={planeElement} class="plane">
	<img data-sampler="texture0" id="texture0" src="/img/rev/8.jpg" crossorigin="anonymous" alt="" />
	<img data-sampler="texture1" id="texture1" src="/img/rev/9.jpg" crossorigin="anonymous" alt="" />
	<img data-sampler="map" id="map" src="/img/rev/dis.jpeg" crossorigin="anonymous" alt="" />
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
	.plane {
		position: relative;
		width: calc(80vh * 0.66);
		height: 80vh;
		margin: auto;
	}
	.plane img {
		position: absolute;
		object-fit: cover;
		object-position: center;
		display: none;
	}
</style>

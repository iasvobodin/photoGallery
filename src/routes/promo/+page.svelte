<script lang="ts">
	//@ts-nocheck
	import { Curtains, TextureLoader, Plane, Vec3 } from 'curtainsjs';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import vertex from '$lib/assets/photoday.vert?raw';
	import fragment from '$lib/assets/photoday.frag?raw';
	import { getContext } from 'svelte';
	import { browser } from '$app/environment';
	import Contact from '$lib/components/contact.svelte';

	let showDis = false;

	let canvas,
		curtains,
		scrollEffect = 0,
		noiseFreq = 0.9,
		noiseAmp = 0.04,
		noiseEffect = 0,
		planes = [],
		animate;
	// trans = { count: 0 };
	let link = 'https://content.svobodinaphoto.ru/promo/';

	let pricedata = [
			{
				title: '"Первый пакет"',
				body: [
					'Съемка 40 минут',
					'20 фотографий с цветокоррекцией и ретушью, где она необходима',
					'Все удачные исходники в день съёмки',
					'Срок отдачи: 2 недели'
				],
				price: '2.000р.'
			},
			{
				title: '"Второй пакет"',
				body: [
					'Съемка 60 минут',
					'40 фотографий с цветокоррекцией и ретушью, где она необходима',
					'Все удачные исходники в день съёмки',
					'Срок отдачи: 10 дней'
				],
				price: '3.500р.'
			}
			// {
			// 	title: 'Третий пакет»',
			// 	body: [
			// 		'Съемка 40 минут',
			// 		' 40-50 фотографий с цветокоррекцией и ретушью, где она необходима',
			// 		'Макияж от профессионального визажиста',
			// 		'Срок отдачи: 1 неделя'
			// 	],
			// 	price: '4.500р.'
			// }
		],
		photos = [
			'12-05-23-10-26-5',
			'12-05-23-10-16-3',
			'12-05-23-10-28-0',
			'12-05-23-10-38-2',
			'12-05-23-10-22-1',
			'12-05-23-10-39-0',
			'12-05-23-10-22-5',
			'12-05-23-10-39-4',
			'12-05-23-10-50-1'
		];
	// ==========================
	let lenis;
	$: if (browser) {
		lenis = getContext('lenis');
	}

	function initPlane(planesElement) {
		for (const iterator of planesElement) {
			const plane = new Plane(curtains, iterator, {
				vertexShader: vertex,
				fragmentShader: fragment,
				widthSegments: 16,
				heightSegments: 16,
				//   autoloadSources: false,
				fov: 75,
				alwaysDraw: false,
				shareProgram: true,
				texturesOptions: {
					minFilter: curtains.gl.LINEAR_MIPMAP_NEAREST
				},
				uniforms: {
					noiseFreq: {
						name: 'uNoiseFreq',
						type: '1f',
						value: noiseFreq
					},
					noiseAmp: {
						name: 'uNoiseAmp',
						type: '1f',
						value: noiseAmp
					},
					noiseEffect: {
						name: 'uNoiseEffect',
						type: '1f',
						value: 0
					},
					scrollEffect: {
						name: 'uScrollEffect',
						type: '1f',
						value: 0
					},
					time: {
						name: 'uTime',
						type: '1f',
						value: 0
					}
				}
			});

			planes.push(plane);

			handlePlanes(plane);
		}
	}

	function initAnimate() {
		animate = gsap.timeline({
			ease: 'linear',
			paused: true
		});
		animate.fromTo(
			'.webgl',
			{ scale: 1.13, opacity: 0 },
			{
				scale: 1,
				opacity: 1,
				onUpdate: function () {
					scrollEffect = 100 - this.progress() * 100;
				}
			},
			0
		);
	}

	function handlePlanes(plane) {
		plane
			.onReady(() => {
				if (plane.index === planes.length - 1) {
					document.body.classList.add('planes-loaded');
					animate.play();
				}
			})
			.onRender(() => {
				noiseEffect += 100 / 45000;
				plane.uniforms.time.value += 0.01;
				plane.uniforms.scrollEffect.value = scrollEffect / 80;
				plane.uniforms.noiseEffect.value = noiseEffect;
				// scale plane and its texture
				// plane.setScale(new Vec2(1, 1 + Math.abs(this.scrollEffect) / 1500))
				// plane.textures[0].setScale(
				//   new Vec2(1, 1 + Math.abs(this.scrollEffect) / 1550)
				// )
			});
	}

	function initCurtains() {
		curtains = new Curtains({
			container: canvas,
			production: true,
			watchScroll: false,
			pixelRatio: Math.min(1.5, window.devicePixelRatio)
		});

		curtains
			.onError(() => {
				document.body.classList.add('no-curtains', 'planes-loaded');
			})
			.onContextLost(() => {
				curtains.restoreContext();
			});
	}

	onMount(() => {
		lenis.on('scroll', (e: any) => {
			curtains.updateScrollValues(0, e.scroll);
			scrollEffect = e.velocity;
		});

		const planeElements = document.getElementsByClassName('plane');
		initCurtains();
		initPlane(planeElements);
		initAnimate();
		const frontPlane = new Vec3(0, 0, 80);
		const rearPlane = new Vec3(0, 0, -80);
		planes[1].setRelativeTranslation(frontPlane);
		planes[3].setRelativeTranslation(frontPlane);
		planes[8].setRelativeTranslation(frontPlane);
		planes[7].setRelativeTranslation(frontPlane);
		planes[0].setRelativeTranslation(rearPlane);
		planes[2].setRelativeTranslation(rearPlane);
	});
</script>

<svelte:head>
	<title>Photoproject</title>
</svelte:head>
<main>
	<div bind:this={canvas} class="webgl" />
	<div class="plane__wrapper">
		<h1 class="main__hedlain">Фотопроект<br />"Весеннее волшебство"</h1>
		<p class="description part1">
			Фотосессия, которую можно снять только раз в году: среди цветущих яблонь
		</p>
		<p class="description part2" />
		<div class="description part4">
			<p class="date">Даты</p>
			<p class="date">с 15 по 21 мая</p>
		</div>

		<div class="whom">
			<p class="description">Подходит для:</p>
			<ul>
				<li class="description2">Семейной фотосессии</li>
				<li class="description2">Love Story</li>
				<li class="description2">Портретов</li>
			</ul>
		</div>
		<div class="where">
			<p class="description date">Место</p>
			<p class="description">Центр города или северо-запад</p>
		</div>

		{#each photos as photo, index (index)}
			<div class="plane plane{index}">
				<picture>
					<source media="(max-width: 799px)" srcset="{link}480_{photo}.avif" type="image/avif" />
					<source media="(min-width: 800px)" srcset="{link}720_{photo}.avif" type="image/avif" />
					<source media="(max-width: 799px)" srcset="{link}480_{photo}.webp" type="image/webp" />
					<source media="(min-width: 800px)" srcset="{link}720_{photo}.webp" type="image/webp" />
					<img
						data-sampler="planeTexture"
						alt="SvobodinaPhoto"
						crossorigin="anonimous"
						decoding="async"
						draggable="false"
						src="{link}720_{photo}.jpg"
					/>
				</picture>
			</div>
		{/each}
	</div>
	<section class="price">
		<h2 class="description date">Цены</h2>
		<div class="price__holder">
			{#each pricedata as el}
				<div class="price__tarif">
					<h3>{el.title}</h3>
					<ul style="align-self: stretch;">
						{#each el.body as element}
							<li>{element}</li>
						{/each}
					</ul>
					<h4 style="align-self: end;justify-self: center;">
						Цена : {el.price}
					</h4>
				</div>
			{/each}
		</div>
	</section>
	<button on:click={() => (showDis = !showDis)} class="button-38" type="button"
		>Посмотреть backstage</button
	>

	{#if showDis}
		<div>
			<iframe
				class="vimeo"
				src="https://player.vimeo.com/video/826298202?h=d8eabd1b31&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
				frameborder="0"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
				title="backStage"
			/>
		</div>
	{/if}
	<h3 class="contactme">Записаться можно любым удобным способом</h3>
	<Contact />
</main>

<style>
	.contactme {
		text-align: center;
		margin: 5vh 0;
	}
	.button-38 {
		margin: auto;
		width: min(1000px, 90%);
		display: block;
		background-color: #ffffff;
		border: 0;
		border-radius: 0.5rem;
		color: #111827;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.25rem;
		padding: 0.75rem 0px;
		text-align: center;
		text-decoration: none #d1d5db solid;
		text-decoration-thickness: auto;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
	}

	.button-38:hover {
		background-color: rgb(249, 250, 251);
	}

	.button-38:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	.button-38:focus-visible {
		box-shadow: none;
	}
	main {
		background-color: #fff;
	}
	.vimeo {
		/* width: max(600px, 95vw); */
		height: 90vh;
		margin: auto;
		margin-left: 2.5%;
		width: 95%;
	}
	.vp-title {
		display: none !important;
	}
	:global(body) {
		margin: 0;
	}
	p,
	li,
	h2,
	h3 {
		color: black;
		font-family: 'Cormorant Infant', serif;
	}

	:root {
		--vh: 1vh;
		--row__height: calc(var(--column__width) * 1.5);
		--column__width: min(8.5vw, 140px);
	}
	h2 {
		font-size: max(32px, 8vw);
		font-weight: 300;
		margin: 0;
		text-align: center;
	}
	h3,
	h4 {
		margin: 0;
	}
	p {
		margin: 0;
	}
	.half {
		background-color: black;
		width: 100%;
		height: calc(50 * var(--vh));
		position: fixed;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	/* .bottom h2 {
		grid-column: 2/3;
	}
	.top h2 {
		justify-self: end;
		align-self: end;
		grid-column: 1/2;
	} */
	.bottom {
		top: calc(50 * var(--vh));
	}
	.main__hedlain {
		color: black;
		text-align: center;
		margin: 0;
		z-index: 2;
		grid-row: 3 / 4;
		grid-column: 6/11;
		font-size: max(40px, 5vw);
		font-family: 'Cormorant Infant', serif;
		font-weight: 400;
	}
	.description {
		font-size: max(26px, 2.7vw);
		margin: 0;
		z-index: 2;
	}
	.description2 {
		font-size: max(22px, 2vw);
		margin: 0;
	}
	.description3 {
		font-size: max(24px, 5vw);
		margin: 0;
	}
	.part1 {
		grid-row: 7 / 8;
		grid-column: 1/6;
		align-self: center;
	}
	.part2 {
		grid-row: 9 / 10;
		grid-column: 6/11;
		margin-top: calc(3 * var(--vh));
		align-self: start;
	}
	.part4 {
		grid-row: 18 / 19;
		grid-column: 1/5;
		font-size: max(32px, 32px + 1.7vw);
		align-self: start;
		transform: translateY(-30%);
	}
	.date {
		font-size: max(24px, 5vw);
	}
	.whom {
		grid-row: 11 / 13;
		grid-column: 8/11;
		transform: translateY(-30%);
	}
	.part4 > p {
		text-align: center;
	}
	.where {
		grid-row: 24 / 26;
		grid-column: 6/11;
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
	.where > p {
		text-align: center;
	}
	.price {
		grid-row: 26 / 30;
		grid-column: 1/11;
		align-self: center;
	}
	.price__holder {
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(auto-fit, minmax(max(22vw, 250px), 1fr));
		row-gap: calc(5 * var(--vh));
		column-gap: max(5px, 2vw);
		width: min(1400px, 95vw);
		margin: auto;
		margin-top: calc(5 * var(--vh));
	}

	.price__tarif {
		position: relative;
		display: grid;
		grid-template-rows: 10% min(calc(30 * var(--vh)) 600px) 10%;
		border-radius: 5px;
		/* padding:calc( 3 * var(--vh)) 1vw; */
	}
	.price__tarif > h3 {
		font-size: max(24px, 2.7vw);
		align-self: start;
		justify-self: center;
		white-space: pre-wrap;
		text-align: center;
	}
	.price__tarif > ul {
		align-self: stretch;
		margin-top: calc(5 * var(--vh));
		margin-bottom: calc(5 * var(--vh));
	}
	li {
		font-size: max(22px, 1.5vw);
		font-weight: 400;
		/* list-style-type: '📷'; */
		/* padding-inline-start: 1ch; */
	}
	.price__tarif > h4 {
		font-size: max(24px, 2.7vw);
		place-self: center;
		white-space: pre-wrap;
	}
	.contact {
		width: 98%;
		margin-top: calc(30 * var(--vh));
		margin-right: 2vw;
	}
	.contact > p {
		text-align: center;
		font-size: max(16px, 1.35vw);
	}
	.animate__contact {
		font-size: 56px;
		line-height: 1.2;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.first {
		position: relative;
		/* height: calc(56px * 1.2); */
		/* overflow: hidden; */
	}
	.first > p {
		display: block;
		text-align: end;
	}

	.plane0 {
		width: 100%;
		height: 100%;
		grid-row: 2 / 7;
		grid-column: 2/7;
		align-self: start;
	}
	.plane1 {
		grid-row: 6 / 9;
		grid-column: 6/9;
	}
	.plane2 {
		width: 90%;
		height: 90%;
		justify-self: center;
		align-self: center;
		grid-row: 8 / 13;
		grid-column: 1/6;
	}
	.plane3 {
		width: 120%;
		height: 120%;
		grid-row: 10 / 12;
		grid-column: 5/7;
		justify-self: center;
		align-self: end;
	}
	.plane4 {
		width: 80%;
		height: 80%;
		grid-row: 13 / 18;
		grid-column: 1/6;
		justify-self: center;
		align-self: center;
	}
	.plane5 {
		width: 95%;
		height: 95%;
		grid-row: 13 / 18;
		grid-column: 6/11;
		justify-self: center;
		align-self: center;
	}
	.plane6 {
		grid-row: 18 / 23;
		grid-column: 5/10;
	}
	.plane7 {
		width: 70%;
		height: 70%;
		grid-row: 19 / 23;
		grid-column: 1/5;
		justify-self: center;
		align-self: start;
	}
	.plane8 {
		width: 90%;
		height: 90%;
		grid-row: 22 / 26;
		grid-column: 2/6;
		justify-self: center;
		align-self: center;
	}
	.plane9 {
		width: 100%;
		height: 100%;
		grid-row: 28 / 32;
		grid-column: 2/6;
		justify-self: center;
		align-self: center;
	}
	.webgl {
		position: fixed;
		pointer-events: none;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		/* opacity: 0.3; */
	}

	.plane__wrapper {
		height: auto;
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(10, var(--column__width));
		grid-template-rows: 20px repeat(24, var(--row__height));
		/* background-color: #aeb4b8; */
		/* grid-gap: 2vw; */
	}
	.plane > picture > img {
		display: none;
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
	@media (max-width: 800px) {
		.plane__wrapper {
			display: grid;
			justify-content: center;
			grid-template-columns: 1fr;
			grid-template-rows: auto;
		}
		.plane {
			width: 95vw;
			height: calc(95vw * 1.6);
		}
		.plane0 {
			grid-row: 2/3;
			grid-column: auto;
			align-self: start;
		}

		.plane1 {
			grid-row: 4/5;
			grid-column: auto;
			place-self: center;
		}
		.plane1,
		.plane3 {
			width: 70vw;
			height: calc(70vw * 1.6);
		}
		.plane2 {
			justify-self: center;
			align-self: center;
			grid-row: 6/7;
			grid-column: auto;
		}
		.plane3 {
			grid-row: 8/9;
			grid-column: auto;
			justify-self: center;
			align-self: center;
		}
		.plane4 {
			grid-row: 10/11;
			grid-column: auto;
			justify-self: center;
			align-self: center;
		}
		.plane5 {
			grid-row: auto;
			grid-column: auto;
			justify-self: center;
			align-self: center;
		}
		.plane6 {
			grid-row: auto;
			grid-column: auto;
			display: none;
		}
		.plane7 {
			grid-row: auto;
			grid-column: auto;
			justify-self: center;
			align-self: start;
			display: none;
		}
		.plane8 {
			grid-row: auto;
			grid-column: auto;
			justify-self: center;
			align-self: center;
			display: none;
		}
		.plane9 {
			grid-row: auto;
			grid-column: auto;
			justify-self: center;
			align-self: center;
			display: none;
		}
		.main__hedlain {
			grid-column: 1/2;
			grid-row: 1/2;
			text-align: center;
			margin-top: calc(2 * var(--vh));
		}
		.part1 {
			grid-row: 3/4;
			grid-column: auto;
			align-self: center;
			/* height: calc(30 * var(--vh)); */
			margin-top: calc(10 * var(--vh));
			margin-bottom: calc(10 * var(--vh));
			padding: calc(1 * var(--vh));
		}
		.part2 {
			grid-row: 5/6;
			grid-column: auto;
			padding: calc(1 * var(--vh));
			align-self: start;
			margin-bottom: calc(5 * var(--vh));
		}
		.part4 {
			grid-row: 7/8;
			grid-column: auto;
			margin: calc(5 * var(--vh)) 0;
			align-self: start;
			transform: translateY(20%);
		}
		.part4 > p {
			font-size: max(52px, 32px + 1.7vw);
		}
		.whom {
			grid-row: 9/10;
			grid-column: auto;
			transform: translateY(0%);
			margin: calc(5 * var(--vh)) 0;
			width: 90vw;
			margin-left: 8vw;
		}
		.where {
			grid-row: 11/12;
			grid-column: auto;
			height: 100%;
			width: 100%;
			object-fit: cover;
			object-position: center;
			margin: calc(5 * var(--vh)) 0;
		}
		.date {
			font-size: 36px;
		}
	}
</style>

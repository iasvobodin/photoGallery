<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	const anim = () => {
		gsap
			.timeline({
				// onComplete: () => (isAnimating = false)
			})
			.set('.overlay__path', {
				attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' }
			})
			.to(
				'.overlay__path',
				{
					duration: 0.8,
					ease: 'power4.in',
					attr: { d: 'M 0 100 V 50 Q 50 0 100 50 V 100 z' }
				},
				0
			)
			.to('.overlay__path', {
				duration: 0.3,
				ease: 'power2',
				attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
				onComplete: () => {
					console.log('aaaa');
					// frame.classList.add('frame--menu-open');
					// menuWrap.classList.add('menu-wrap--open');
				}
			})
			.set('.overlay__path', {
				attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' }
			})
			.to('.overlay__path', {
				duration: 0.3,
				ease: 'power2.in',
				attr: { d: 'M 0 0 V 50 Q 50 0 100 50 V 0 z' }
			})
			.to('.overlay__path', {
				duration: 0.8,
				ease: 'power4',
				attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }
			});
	};

	let isAnimating = true;
	onMount(() => {});
</script>

<h1 class="main__title">SVOBODINA <span>PHOTO</span></h1>
<div class="menu__items">
	<a data-splitting href="#" class="main__title menu__item">домой</a><br />
	<a data-splitting href="#" class="main__title menu__item">фотосерии</a><br />
	<a data-splitting href="#" class="main__title menu__item">отзывы</a><br />
	<a data-splitting href="#" class="main__title menu__item">цены</a><br />
	<a data-splitting href="#" class="main__title menu__item">о себе</a><br />
</div>

<a href="/photoseries">photoseries</a>
<br />
<a href="/reviews">reviews</a>
<br />
<a href="/price">price</a>
<br />
<p on:click={anim}>button</p>

<svg class="overlay" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
	<path
		class="overlay__path"
		vector-effect="non-scaling-stroke"
		d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
	/>
</svg>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap');
	.menu__item {
		text-decoration: none;
		text-decoration-line: none;
		text-decoration-color: white;
		color: white;
	}
	.overlay {
		/* grid-area: 1 / 1 / 2 / 2; */
		position: relative;
		z-index: 1000;
		pointer-events: none;
		width: 100%;
		height: 100%;
		fill: white;
	}
	.main__title {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		text-align: end;
	}
</style>

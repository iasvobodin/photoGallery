<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	let menuIsOpen = false;
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

<h1 class="main__title main">SVOBODINA</h1>
<div class="menu__button__holder">
	<img
		on:click={() => (menuIsOpen = !menuIsOpen)}
		class="button__menu"
		src="/icons/menu.svg"
		alt=""
	/>
</div>
<!-- br />A<br />W<br />E<br />S<br />O<br />M<br />E<br />Й<br />И<br
		/>Ы<br />Ы<br />Е -->
<div class="menu__holder">
	{#if !menuIsOpen}
		<div class="photo_holder">
			P<br />H<br />O<br />T<br />O
		</div>
	{/if}

	{#if menuIsOpen}
		<div class="menu__items">
			<a data-splitting href="/" class="main__title menu__item">ДОМОЙ</a>
			<a data-splitting href="/photoseries" class="main__title menu__item">ФОТОСЕРИИ</a>
			<a data-splitting href="/reviews" class="main__title menu__item">ОТЗЫВЫ</a>
			<a data-splitting href="/price" class="main__title menu__item">ЦЕНЫ</a>
			<a data-splitting href="#" class="main__title menu__item">О СЕБЕ</a>
		</div>
	{/if}
</div>
<!-- <div data-splitting class="test__block main__title">PAWESOMEЙ</div> -->

<!-- <a href="/photoseries">photoseries</a>
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
</svg> -->
<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap');
	.menu__button__holder {
		position: absolute;
		top: 0;
		right: 0;
		border-radius: 50%;
		width: clamp(40px, 6.5vw + 12px, 90px);
		height: clamp(40px, 6.5vw + 12px, 90px);
	}
	.button__menu {
		width: 100%;
		height: 100%;
	}
	.word {
		display: grid;
	}
	[data-word='PAWESOMEЙ'] {
		display: grid;
	}
	.menu__item {
		text-decoration: none;
		text-decoration-line: none;
		text-decoration-color: white;
		color: white;
		width: 100%;
		display: block;
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
	.photo_holder {
		font-family: 'Roboto Mono', monospace;
		width: fit-content;
		font-weight: 100;
		position: absolute;
		right: 0.5ch;
		text-align: center;
		padding: 0;
		font-size: clamp(36px, 6vw + 12px, 80px);
		line-height: clamp(40px, 6.5vw + 12px, 90px);
	}
	.menu__holder {
		/* margin-right: 1vw; */
		position: relative;
	}
	.menu__items {
		position: absolute;
		top: 0;
		font-size: clamp(36px, 6vw + 12px, 80px);
		line-height: clamp(40px, 6.5vw + 12px, 90px);
		right: 0.5ch;
	}
	.main__title {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		text-align: end;
		padding: 0;
	}
	span .main__title {
		display: block;
		width: 100%;
	}
	.main {
		padding-right: 2ch;
	}
</style>

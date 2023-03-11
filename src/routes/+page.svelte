<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	let menuIsOpen = false;
	const navigation = [
		{ name: '    ДОМОЙ', route: '/' },
		{ name: 'ФОТОСЕРИИ', route: '/photoseries' },
		{ name: '   ОТЗЫВЫ', route: '/reviews' },
		{ name: '     ЦЕНЫ', route: '/price' },
		{ name: '   О СЕБЕ', route: '/about' }
	];
	let staggerItem: Array<Array<HTMLSpanElement>> = [[]];
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
	let st;

	const stag = () => {
		menuIsOpen = !menuIsOpen;
		st.reversed() ? st.play() : st.reverse();
		// st.play();
	};
	let isAnimating = true;
	onMount(() => {
		// CSSRulePlugin.getRule("#t1:after")
		// console.log(staggerItem);
		st = gsap
			.timeline({
				paused: true,
				reversed: true
			})
			.set('.menu__items', {
				display: 'grid'
			})
			.to(
				'.menu__title__ver',
				{
					duration: 0.3,
					width: '100%',
					background: 'linear-gradient(to left, rgba(0, 0, 0, 1), transparent)'
				},
				0
			)
			.to('.ph__char', {
				duration: 0.3,
				x: '100%',
				ease: 'none'
			})
			.to(
				'.char',
				{
					duration: 0.3,
					x: '0',
					ease: 'none',
					stagger: {
						each: 0.08,
						grid: [5, 9],
						from: 'end',
						axis: 'x'
					}
				},
				'-=0.22'
			);
	});
</script>

<div class="menu">
	<h1 class="menu__title__hor font__prop">SVOBODINA</h1>
	{#if !menuIsOpen}
		<img on:click={stag} class="menu__button font__prop" src="/icons/menu.svg" alt="" />
	{:else}
		<img on:click={stag} class="menu__button close font__prop" src="/icons/plus.svg" alt="" />
	{/if}
	<!-- {#if !menuIsOpen} -->
	<div class="menu__title__ver font__prop">
		{#each 'PHOTO' as item}
			<div class="char__holder">
				<span class="ph__char">{item}</span>
			</div>
		{/each}
	</div>
	<!-- {/if} -->

	<div class="menu__items font__prop">
		{#each navigation as item, i (i)}
			<a href={item.route} class="font__prop menu__item">
				{#each item.name as el, j (j)}
					<div class="char__holder">
						<span class="char">{el}</span>
					</div>
				{/each}
			</a>
		{/each}
	</div>
</div>
<div class="slider font__prop">
	<img src="https://ik.imagekit.io/svobodinaphoto/tr:w-1680/23-01-24-14-38-44.jpg" alt="" />
	<img src="https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-30-16-27-21.jpg" alt="" />
	<img src="https://ik.imagekit.io/svobodinaphoto/tr:w-1680/22-07-16-15-09-54.jpg" alt="" />
</div>

<!-- <svg class="overlay" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
	<path
		class="overlay__path"
		vector-effect="non-scaling-stroke"
		d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
	/>
</svg> -->
<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap');
	.font__prop {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		font-size: clamp(36px, 6vw + 12px, 80px);
		line-height: 1;
	}
	.menu {
		position: relative;
	}
	.menu__title__hor {
		text-align: end;
		padding: 0;
		padding-right: 2ch;
	}
	.menu__title__ver {
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
	}

	.ph__char {
		display: inline-block;
		height: inherit;
	}
	.menu__button {
		position: absolute;
		cursor: pointer;
		top: 0.36ch;
		right: 0.5ch;
		width: 1ch;
		height: 1ch;
	}
	.close {
		rotate: 45deg;
	}
	.menu__items {
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
		display: none;
	}
	.menu__item {
		height: clamp(36px, 6vw + 12px, 80px);
		width: 100%;
		text-decoration: none;
		text-decoration-line: none;
		text-decoration-color: white;
		justify-self: end;
	}
	.char__holder {
		display: inline-block;
		width: 1ch;
		overflow: hidden;
	}
	.char {
		display: inline-block;
		height: inherit;
		transform: translateX(-100%);
	}
	.slider {
		display: grid;
		column-gap: 1vw;
		padding-left: 1vw;
		grid-auto-flow: column;
		width: calc((100vw - 2ch));
		height: calc(100vh - clamp(36px, 6vw + 12px, 80px) * 2);
	}
	.slider img {
		aspect-ratio: 3/2;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: top right;
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

	span .main__title {
		display: block;
		width: 100%;
	}
	.main {
	}

	@media (max-width: 1500px) {
		.slider img:nth-child(1) {
			display: none;
		}
	}
	@media (max-width: 1000px) {
		.slider img:nth-child(2) {
			display: none;
		}
	}
</style>

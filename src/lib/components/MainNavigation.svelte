<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import { SplitText } from 'gsap/SplitText';

	gsap.registerPlugin(SplitText);

	export let isOpen = false;

	const dispatch = createEventDispatcher();
	const STAGGER_DURATION = 0.02;
	const ANIMATION_DURATION = 0.8;

	let containerEl: HTMLDivElement;
	let timeline: gsap.core.Timeline | null = null;

	let split: globalThis.SplitText | null;

	const handleClick = () => {
		dispatch('navigate');
	};

	const createTimeline = () => {
		if (!containerEl || !split) return;

		timeline = gsap.timeline({
			paused: true,
			onComplete: () => {
				if (!isOpen) {
					gsap.set(containerEl, { opacity: 0 });
				}
			}
		});

		timeline.set(containerEl, { opacity: 1 });

		timeline.fromTo(
			split.chars,
			{ x: '100%' },
			{
				x: '0%',
				duration: 0.6,
				delay: 0.16,

				stagger: {
					grid: [5, 9],
					each: 0.06,
					from: 'end',

					axis: 'x'
					// ease: 'steps(9)'
				}
			}
		);
	};

	$: if (timeline && containerEl) {
		if (isOpen) {
			timeline.play();
		} else {
			timeline.reverse();
		}
	}

	onMount(async () => {
		if (document.fonts) await document.fonts.ready;

		split = SplitText.create('.menu__item', {
			type: 'chars',
			mask: 'chars',
			reduceWhiteSpace: false,
			charsClass: 'char'
		});
		// 	// Изначально скрываем
		console.log(split.chars);

		gsap.set(split.chars, { x: '100%' });

		gsap.set(containerEl, { opacity: isOpen ? 1 : 0 });

		createTimeline();

		if (isOpen) {
			timeline?.play();
		}
	});

	onDestroy(() => {
		// Очищаем timeline
		if (timeline) {
			timeline.kill();
			timeline = null;
		}

		// Очищаем split
		if (split) {
			gsap.killTweensOf(split.chars);
			split.revert();
			split = null;
		}
	});
</script>

<div bind:this={containerEl} class="menu__items font__prop">
	<a on:click={handleClick} href="/" class="font__prop menu__item">&nbsp&nbsp&nbsp&nbspДОМОЙ</a>
	<a on:click={handleClick} href="/photoseries" class="font__prop menu__item">ФОТОСЕРИИ</a>
	<a on:click={handleClick} href="/reviews" class="font__prop menu__item">&nbsp&nbsp&nbspОТЗЫВЫ</a>
	<a on:click={handleClick} href="/price" class="font__prop menu__item"
		>&nbsp&nbsp&nbsp&nbsp&nbspЦЕНЫ</a
	>
	<a on:click={handleClick} href="/about" class="font__prop menu__item">&nbsp&nbsp&nbspО&nbspСЕБЕ</a
	>
</div>

<style>
	.font__prop {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		font-size: var(--font-size-main);
		line-height: 1;
	}

	.menu__items {
		pointer-events: all;
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
		opacity: 0;
	}

	.menu__item {
		position: relative;
		-webkit-text-stroke: 1px rgb(255, 255, 255);
		color: white;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		height: var(--font-size-main);
		width: 100%;
		text-decoration: none;
		justify-self: end;
		overflow: hidden;
		white-space: nowrap;
		text-align: right;
	}

	/* SplitText с mask автоматически создает обертки с классом char-mask */
	/* :global(.char-mask) {
		display: inline-block;
		overflow: clip;
	} */

	:global(.char) {
		/* display: inline-block; */
		will-change: transform;
		/* background-color: rgb(32, 85, 190); */
	}
</style>

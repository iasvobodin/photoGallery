<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { page } from '$app/stores';
	import gsap from 'gsap';

	export let isOpen = false;
	export let scrollY = 0;

	const dispatch = createEventDispatcher();

	let overlayEl: HTMLDivElement;
	let photoChars: HTMLSpanElement[] = [];
	let svobodinaEl: HTMLHeadingElement;
	let photoContainerEl: HTMLDivElement;
	let showOverlay = false; // Управляет отображением в DOM

	const handleClick = () => {
		dispatch('toggle');
	};

	$: shouldHideText = $page.url.pathname !== '/' || scrollY >= 150;

	// Анимация fade для текстов при скролле
	$: if (svobodinaEl && photoContainerEl) {
		gsap.to([svobodinaEl, photoContainerEl], {
			opacity: shouldHideText ? 0 : 1,
			duration: 1,
			ease: 'power2.inOut'
		});
	}

	// Анимация overlay (clip-path circle)
	$: if (isOpen && !showOverlay) {
		// Показываем элемент в DOM перед анимацией
		showOverlay = true;
	}

	$: if (overlayEl && isOpen) {
		// Анимация появления
		gsap.fromTo(
			overlayEl,
			{
				clipPath: 'circle(0%)'
			},
			{
				clipPath: 'circle(100%)',
				duration: 0.6,
				ease: 'power2.inOut'
			}
		);
	} else if (overlayEl && !isOpen && showOverlay) {
		// Анимация исчезновения только если элемент отображается
		gsap.to(overlayEl, {
			clipPath: 'circle(0%)',
			duration: 0.6,
			ease: 'power2.inOut',
			onComplete: () => {
				// Удаляем элемент из DOM после завершения анимации
				showOverlay = false;
			}
		});
	}

	// Анимация букв PHOTO
	$: if (photoChars.length > 0) {
		if (!isOpen) {
			// Показываем контейнер
			if (photoContainerEl) {
				gsap.set(photoContainerEl, { display: 'grid' });
			}
			// Появление: все буквы с задержкой 100ms
			photoChars.forEach((char, i) => {
				gsap.fromTo(
					char,
					{
						x: '-100%'
					},
					{
						x: '0%',
						duration: 0.06,
						delay: 0.1,
						ease: 'power2.inOut'
					}
				);
			});
		} else {
			// Исчезновение: мгновенно без задержки
			photoChars.forEach((char, i) => {
				gsap.to(char, {
					x: '-100%',
					duration: 0.6,
					delay: 0,
					ease: 'power2.inOut',
					onComplete:
						i === photoChars.length - 1
							? () => {
									// Скрываем контейнер после анимации последней буквы
									if (photoContainerEl) {
										gsap.set(photoContainerEl, { display: 'none' });
									}
							  }
							: undefined
				});
			});
		}
	}

	onMount(() => {
		// Начальное состояние для overlay
		if (overlayEl && !isOpen) {
			gsap.set(overlayEl, { clipPath: 'circle(0%)' });
		}

		// Начальное состояние для PHOTO контейнера
		if (photoContainerEl) {
			gsap.set(photoContainerEl, { display: isOpen ? 'none' : 'grid' });
		}

		// Начальное состояние для букв PHOTO
		if (photoChars.length > 0 && isOpen) {
			photoChars.forEach((char) => {
				gsap.set(char, { x: '-100%' });
			});
		}
	});
</script>

{#if showOverlay}
	<div bind:this={overlayEl} class="overlay">
		<slot name="overlay" />
	</div>
	<slot name="navigation" />
{/if}

<h1 bind:this={svobodinaEl} class="menu__title__hor font__prop">SVOBODINA</h1>

<button
	id="mb"
	aria-label="Menu Button"
	type="button"
	on:click={handleClick}
	class="menu__button font__prop"
	class:menuIsOpen={isOpen}
/>

<div bind:this={photoContainerEl} class="menu__title__ver font__prop">
	{#each 'PHOTO' as item, i}
		<div class="char__holder">
			<span bind:this={photoChars[i]} class="ph__char">{item}</span>
		</div>
	{/each}
</div>

<style>
	.font__prop {
		font-family: 'Roboto Mono', monospace;
		font-weight: 100;
		font-size: var(--font-size-main);
		line-height: 1;
	}

	.menu__title__hor {
		pointer-events: none;
		text-align: end;
		padding: 0;
		padding-right: 2ch;
		margin: 0;
	}

	.menu__title__ver {
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
	}

	.char__holder {
		display: inline-block;
		width: 1ch;
		overflow: hidden;
	}

	.ph__char {
		display: inline-block;
		height: inherit;
	}

	.menu__button {
		pointer-events: all;
		background-image: url('/icons/menu3.svg');
		position: absolute;
		cursor: pointer;
		top: 0.36ch;
		right: 0.5ch;
		width: 1ch;
		height: 1ch;
		transform: scale(1.7);
	}

	.menuIsOpen {
		background-image: url('/icons/plus.svg');
	}

	.overlay {
		display: grid;
		pointer-events: all;
		position: absolute;
		top: -100vh;
		top: calc(var(--vh, 1vh) * -100);
		left: 0;
		width: 200%;
		height: 200%;
		background-color: black;
	}
</style>

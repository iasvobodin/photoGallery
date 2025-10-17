<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Logo from '$lib/components/logo.svelte';
	import { gsap } from '$lib/gsap/core';

	export let scrollY: number = 0;

	// Состояния
	let menuIsOpen = false;
	let numbers: number[] = [];
	let way = true;

	// Ref элементы
	let overlayEl: HTMLElement;
	let menuButtonEl: HTMLElement;
	let menuItemsEl: HTMLElement;
	let verticalTitleEl: HTMLElement;
	let horizontalTitleEl: HTMLElement;

	// GSAP контексты для удобной очистки
	let ctx: gsap.Context;

	const navigation = [
		{ name: '    ДОМОЙ', route: '/' },
		{ name: 'ФОТОСЕРИИ', route: '/photoseries' },
		{ name: '   ОТЗЫВЫ', route: '/reviews' },
		{ name: '     ЦЕНЫ', route: '/price' },
		{ name: '   О СЕБЕ', route: '/about' }
	];

	// Генерация случайных стилей для логотипов
	const getRandomStyle = () => {
		const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
		const randomX = Math.floor(Math.random() * window.innerWidth * 0.85);
		const randomY = Math.floor(Math.random() * window.innerHeight * 0.85);
		const randomDeg = Math.floor(Math.random() * 360);
		const randomScale = Math.random() + 0.85;

		return `fill: ${randomColor}; transform: translate(${randomX}px, -${randomY}px) rotate(${randomDeg}deg) scale(${randomScale})`;
	};

	// Добавление/удаление логотипов
	function toggleLogos() {
		if (numbers.length >= 25) way = false;
		if (numbers.length === 0) way = true;
		way ? (numbers = [...numbers, numbers.length + 1]) : (numbers = numbers.slice(1));
	}

	// Главная функция переключения меню
	function toggleMenu() {
		menuIsOpen = !menuIsOpen;

		if (menuIsOpen) {
			// Даём время на рендеринг элементов меню
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					openMenu();
				});
			});
		} else {
			closeMenu();
		}
	}

	// Открытие меню
	function openMenu() {
		// Проверяем, что элементы меню существуют
		if (!menuItemsEl) return;

		const menuItems = menuItemsEl.querySelectorAll('.menu__item');
		if (!menuItems.length) return;

		// Overlay появление
		gsap.to(overlayEl, {
			clipPath: 'circle(150% at 50% 50%)',
			duration: 0.6,
			ease: 'power2.inOut'
		});

		// Скрываем вертикальный заголовок PHOTO
		if (verticalTitleEl) {
			gsap.to(verticalTitleEl, {
				opacity: 0,
				duration: 0.3,
				ease: 'power2.out'
			});
		}

		// Устанавливаем начальное состояние для элементов меню
		gsap.set(menuItems, {
			x: 100,
			opacity: 0
		});

		// Появление элементов меню с задержкой
		gsap.to(menuItems, {
			x: 0,
			opacity: 1,
			duration: 0.5,
			stagger: 0.08,
			ease: 'power3.out',
			delay: 0.2
		});

		// Анимация символов в каждом пункте меню
		menuItems.forEach((item, index) => {
			const chars = item.querySelectorAll('.char');
			gsap.fromTo(
				chars,
				{ x: 100 },
				{
					x: 0,
					duration: 0.6,
					stagger: 0.02,
					ease: 'power3.out',
					delay: 0.2 + index * 0.08
				}
			);
		});
	}

	// Закрытие меню
	function closeMenu() {
		if (!menuItemsEl) return;

		const menuItems = menuItemsEl.querySelectorAll('.menu__item');
		if (!menuItems.length) return;

		// Анимация символов (в обратном порядке)
		menuItems.forEach((item, index) => {
			const chars = item.querySelectorAll('.char');
			gsap.to(chars, {
				x: 100,
				duration: 0.4,
				stagger: 0.01,
				ease: 'power2.in',
				delay: index * 0.03
			});
		});

		// Скрытие элементов меню
		gsap.to(menuItems, {
			x: 100,
			opacity: 0,
			duration: 0.4,
			stagger: 0.05,
			ease: 'power2.in'
		});

		// Overlay скрытие
		gsap.to(overlayEl, {
			clipPath: 'circle(0% at 50% 50%)',
			duration: 0.6,
			ease: 'power2.inOut',
			delay: 0
		});

		// Возврат вертикального заголовка
		if (verticalTitleEl && scrollY < 150 && $page.url.pathname === '/') {
			gsap.to(verticalTitleEl, {
				opacity: 1,
				duration: 0.5,
				ease: 'power2.out',
				delay: 0.4
			});
		}

		// Кнопка меню возврат
		gsap.to(menuButtonEl, {
			rotation: 0,
			duration: 0.3,
			ease: 'power2.inOut'
		});
	}

	onMount(() => {
		// Создаём GSAP контекст для всех анимаций
		ctx = gsap.context(() => {
			// Начальное состояние overlay
			gsap.set(overlayEl, {
				clipPath: 'circle(0% at 50% 50%)'
			});

			// Анимация скрытия заголовков при скролле (только на главной)
			if ($page.url.pathname === '/') {
				gsap.to([horizontalTitleEl, verticalTitleEl], {
					opacity: 0,
					scrollTrigger: {
						trigger: 'body',
						start: 'top top',
						end: '150px top',
						scrub: true
					}
				});
			}
		});
	});

	onDestroy(() => {
		// Очистка всех анимаций при размонтировании
		ctx?.revert();
	});
</script>

<div class="menu">
	<!-- Overlay с логотипами -->
	<div bind:this={overlayEl} class="overlay">
		{#if menuIsOpen}
			<img on:click={toggleLogos} class="logo" src="/icons/logo.svg" alt="logo" />
			{#each numbers as item, i (item)}
				<div style={getRandomStyle()} class="logo-fake">
					<Logo color={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
				</div>
			{/each}
		{/if}
	</div>

	<!-- Горизонтальный заголовок SVOBODINA -->
	<h1 bind:this={horizontalTitleEl} class="menu__title__hor font__prop">SVOBODINA</h1>

	<!-- Кнопка меню -->
	<button
		bind:this={menuButtonEl}
		aria-label="Menu Button"
		type="button"
		on:click={toggleMenu}
		class="menu__button font__prop"
		class:menuIsOpen
	/>

	<!-- Вертикальный заголовок PHOTO -->
	{#if !menuIsOpen}
		<div bind:this={verticalTitleEl} class="menu__title__ver font__prop">
			{#each 'PHOTO' as char}
				<div class="char__holder">
					<span class="ph__char">{char}</span>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Элементы навигации -->
	{#if menuIsOpen}
		<nav bind:this={menuItemsEl} class="menu__items font__prop">
			{#each navigation as item}
				<a on:click={toggleMenu} href={item.route} class="font__prop menu__item">
					{#each item.name as char}
						<div class="char__holder">
							<span class="char">{char}</span>
						</div>
					{/each}
				</a>
			{/each}
		</nav>
	{/if}
</div>

<style>
	.menu {
		pointer-events: none;
		position: fixed;
		top: 0;
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		right: 0;
		width: 100%;
		overflow: hidden;
		z-index: 999;
	}

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
		color: white;
		mix-blend-mode: difference;
	}

	.menu__title__ver {
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
		color: white;
		mix-blend-mode: difference;
		pointer-events: none;
	}

	.ph__char,
	.char {
		display: inline-block;
		height: inherit;
	}

	.menu__button {
		pointer-events: all;
		background-image: url('/icons/menu3.svg');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		position: absolute;
		cursor: pointer;
		top: 0.36ch;
		right: 0.5ch;
		width: 1ch;
		height: 1ch;
		transform: scale(1.7);
		z-index: 1001;
		border: none;
		background-color: transparent;
		transition: transform 0.2s ease;
	}

	.menu__button:hover {
		transform: scale(1.9);
	}

	.menuIsOpen {
		background-image: url('/icons/plus.svg');
	}

	.overlay {
		display: grid;
		pointer-events: all;
		clip-path: circle(0% at 50% 50%);
		position: absolute;
		top: -100vh;
		top: calc(var(--vh, 1vh) * -100);
		left: 0;
		width: 200%;
		height: 200%;
		background-color: black;
	}

	.logo {
		position: absolute;
		cursor: pointer;
		width: 15vh;
		height: 15vh;
		place-self: end start;
		margin: 3vw;
		transition: transform 0.3s ease;
	}

	.logo:hover {
		transform: scale(1.1) rotate(10deg);
	}

	.logo-fake {
		position: absolute;
		pointer-events: none;
		width: 15vh;
		height: 15vh;
		place-self: end start;
		margin: 3vw;
		will-change: transform;
	}

	.logo-fake :global(svg) {
		display: block;
		width: 15vh;
		height: 15vh;
	}

	.menu__items {
		pointer-events: all;
		position: absolute;
		display: grid;
		justify-content: end;
		right: 0.5ch;
		gap: 0.5rem;
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
		cursor: pointer;
		display: flex;
		overflow: hidden;
		transition: opacity 0.3s ease;
	}

	.menu__item:hover {
		opacity: 0.7;
	}

	.char__holder {
		display: inline-block;
		width: 1ch;
		overflow: hidden;
	}
</style>

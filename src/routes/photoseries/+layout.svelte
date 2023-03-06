<script lang="ts">
	import { wWidth } from '$lib/store.js';
	import { wHeight } from '$lib/store.js';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { clickOutside } from '$lib/assets/clickOutside';
	import { getStores, navigating, page, updated } from '$app/stores';

	console.log($page);

	let tl: gsap.core.Timeline;
	let menuAnimationOpen: gsap.core.Tween, menuAnimationClose: gsap.core.Tween;
	let menuIsOpen = false,
		showSubMenu = false;

	const activeMenu = () => {
		console.log(tl.reversed(), 'click');

		tl.reversed() ? tl.play() : tl.reverse();
		!menuAnimationOpen.reversed() && menuAnimationOpen.reverse();
	};
	const handleClickOutside = () => {
		console.log(tl.reversed(), 'clickoutside');
		!tl.reversed() && tl.reverse();
		!menuAnimationOpen.reversed() && menuAnimationOpen.reverse();
	};
	const toogleMenu = () => {
		menuAnimationOpen.reversed() ? menuAnimationOpen.play() : menuAnimationOpen.reverse();
		menuIsOpen && (showSubMenu = false);
	};
	onMount(() => {
		tl = gsap.timeline({ paused: true, reversed: true });
		tl.to('.menu', {
			x: `-=${window.innerWidth / 2 + 140}`,
			duration: 0.7
		});
		tl.to('.menu', {
			width: 'min(80vw, 400px)',
			borderRadius: '10px',
			duration: 0.7,
			backgroundColor: 'black',
			margin: 'auto'
		});
		tl.to('.dumm', {
			opacity: 1
		});

		menuAnimationOpen = gsap.to('.menu', {
			duration: 0.3,
			height: '+=500px',
			reversed: true,
			// yoyo: true,
			// y: '-=500px',
			ease: 'none',
			onReverseComplete: () => {
				// showSubMenu = !showSubMenu;
				console.log('onReverseComplete');
				menuIsOpen = !menuIsOpen;
			},
			onComplete: () => {
				showSubMenu = true;
				console.log('onComplete');
			},
			onStart: () => {
				console.log('onStart');
				menuIsOpen = !menuIsOpen;
			},
			onRepeat: () => {
				console.log('onRepeat');
			},

			paused: true
			// repeat: -1
		});
	});
</script>

<div class="main">
	<a href={$page.params.Route ? '/photoseries' : '/'}>
		<img class="button back" src="/icons/back.svg" alt="" />
	</a>
	<slot />
</div>

<div use:clickOutside on:click_outside={handleClickOutside} class="header">
	<div class="menu">
		<img on:click={toogleMenu} class="button button__menu" src="/icons/menu.svg" alt="" />
	</div>
	<div class="dumm">
		<img on:click={activeMenu} class="button degr" src="/icons/plus.svg" alt="" />
	</div>
	<!-- <div class="dumm" /> -->
</div>

<style>
	.degr {
		rotate: 45deg;
		background-color: black;
	}
	.dumm {
		overflow: hidden;
		position: fixed;
		bottom: 20px;
		left: calc(100vw - 60px);
		border: 1.5px solid rgb(0, 183, 255);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		transform-origin: center right;
		opacity: 0;
		/* background-color: #fff; */
	}
	.button__menu {
		position: absolute;
		bottom: 0;
	}
	.menu {
		position: fixed;
		bottom: 20px;
		left: calc(100vw - 60px);
		border: 1.5px solid rgb(0, 183, 255);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		transform-origin: center right;
	}
	.main {
		/* padding-top: 65px; */
		padding-bottom: 10vh;
		position: relative;
	}
	.header {
		/* background-color: black; */
		/* width: 100%;
		height: 65px;
		position: fixed;
		top: 0; */
	}
	.button {
		width: 37px;
		height: 37px;
		cursor: pointer;
	}
	.back {
		position: absolute;
		top: 20px;
		left: 20px;
		border: 1.5px solid rgb(0, 183, 255);
		border-radius: 50%;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import type { AllPhoto } from '$lib/types/type';
	import { photoseries } from '$lib/store';

	export let photoseriesList: AllPhoto;
	export let Route: string;

	let menuAnimationOpen: gsap.core.Tween, menuAnimationClose: gsap.core.Tween;
	let menuIsOpen = false,
		showSubMenu = false;
	onMount(() => {
		menuAnimationOpen = gsap.to('.navigation__main', {
			duration: 0.3,
			height: '+=360px',
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
				menuIsOpen = !menuIsOpen;
				console.log('onStart', menuIsOpen);
			},
			onRepeat: () => {
				console.log('onRepeat');
			},
			paused: true
		});
	});

	function navigateNext() {
		photoseriesList.findIndex((e) => e.Route === Route);
		// console.log(+photoSeries!.id + 1 === photoseriesList!.length);
		// if (photoSeries && photoseriesList) {
		if (photoseriesList.findIndex((e) => e.Route === Route) + 1 === photoseriesList.length) {
			return photoseriesList[0].Route;
		} else {
			return photoseriesList[
				photoseriesList.findIndex((e) => e.Route === Route) + 1
			]?.Route.toLowerCase();
		}
		// } else {
		// 	return '/';
		// }
	}

	const toogleMenu = () => {
		menuAnimationOpen.reversed() ? menuAnimationOpen.play() : menuAnimationOpen.reverse();
		menuIsOpen && (showSubMenu = false);
	};
</script>

<div class="navigation__main">
	{#if showSubMenu && photoseriesList}
		<div class="holder__photoserieslink">
			{#each photoseriesList as item}
				<a
					class="contact__link"
					data-sveltekit-reload
					href={photoseriesList ? `/photoseries/${item.Route.toLowerCase()}` : '/'}
					><p class="naviganion__next">{item.Title}</p></a
				>
			{/each}
		</div>
	{/if}
	<div class="navigstion">
		<!-- <img class="navigstion__top" src="/icons/menu.svg" alt="" /> -->
		<a class="contact__link" data-sveltekit-reload href={`/photoseries/${navigateNext()}`}
			><p class="naviganion__next next__link">Следующая фотосерия</p></a
		>
		<img
			class:reverse__button={menuIsOpen}
			on:click={toogleMenu}
			class="navigstion__top"
			src="/icons/top.svg"
			alt=""
		/>
	</div>
</div>

<style>
	.navigation__main {
		margin: auto;
		position: absolute;
		left: 0;
		bottom: 40px;
		right: 0;
		bottom: 20px;
		border-radius: 10px;
		background-color: #141414;
		border: 1px solid rgb(0, 183, 255);
		height: 40px;
		width: min(80vw, 240px);
	}
	.holder__photoserieslink {
		overflow-y: scroll;
		/* position: absolute; */
		height: 360px;
		scrollbar-width: none;
	}
	.holder__photoserieslink::-webkit-scrollbar {
		display: none;
	}
	.reverse__button {
		rotate: 180deg;
	}
	.navigstion__top {
		cursor: pointer;
		align-self: end;
		justify-self: center;
		margin-bottom: 10px;
		margin-left: 10px;
		height: 20px;
		width: 20px;
	}
	.contact__link {
		position: relative;
		text-decoration: none;
		text-decoration-line: none;
		text-decoration-color: white;
		color: white;
		/* padding: 1vh; */
		justify-self: center;
		align-self: end;
		font-size: max(1.2vw, 20px);
		/* border-radius: 5px; */
		/* background-color: black; */
		width: fit-content;
		text-align: center;
	}
	.navigstion {
		display: grid;
		grid-auto-flow: column;
		/* grid-template-columns: auto 40px; */
		margin: auto;
		height: 40px;
		width: min(80vw, 240px);
		position: absolute;
		bottom: 0;
		justify-content: center;
	}

	.naviganion__next {
		cursor: pointer;
		/* font-family: Cormorant Infant; */
		margin: 0;
		text-align: center;
		font-size: 18px;
		line-height: 35px;
		font-weight: 300;
		color: #ffffff;
		vertical-align: middle;
		margin: 0;
		place-self: center;
		/* box-shadow: 0px 3px 15px -10px rgb(0 183 255); */
	}
	.naviganion__next:before {
		content: '';
		position: absolute;

		bottom: -1px;
		right: 0;
		left: 0;
		margin: auto;
		width: 80%;
		height: 0.5px;
		background: linear-gradient(89deg, #57ebdb, #403ddb 60%, #070047 100%);
	}
	.next__link {
		line-height: 40px;
	}
</style>

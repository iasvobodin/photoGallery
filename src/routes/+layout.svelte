<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	// console.log($page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/')));
	const goSomeWhereBack = () => {
		goto(
			$page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'))
				? $page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/'))
				: '/'
		);
	};
	let y: number;
	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<svelte:window bind:scrollY={y} />

<slot />
{#if $page.url.pathname !== '/'}
	<button
		style="background-image: url('/icons/arrow.svg');"
		on:click={goSomeWhereBack}
		type="button"
		class="menu__back unbutton"
	/>
{/if}
{#if y >= 150}
	<button
		transition:fly={{ y: 200, duration: 1500 }}
		on:click={scrollTop}
		type="button"
		class="scroll__top"
	/>
{/if}

<style>
	.menu__back {
		width: calc(clamp(40px, 6.5vw + 12px, 90px) + 4vh);
		height: calc(clamp(40px, 6.5vw + 12px, 90px) + 4vh);
		cursor: pointer;
		position: absolute;
		top: 0;
		left: 10px;
	}
	/* linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent), */
	.scroll__top {
		background-image: url('/icons/scroll.svg');
		position: fixed;
		bottom: 10px;
		right: 10px;
		width: calc(clamp(40px, 6.5vw + 12px, 90px) + 4vh);
		height: calc(clamp(40px, 6.5vw + 12px, 90px) + 4vh);
	}
</style>

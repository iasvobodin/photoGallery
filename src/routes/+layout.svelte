<script>
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
</script>

<slot />
{#if $page.url.pathname !== '/'}
	<button
		style="background-image: url('/icons/arrow.svg');"
		on:click={goSomeWhereBack}
		type="button"
		class="menu__back unbutton"
	>
		<!-- <svg
			fill="white"
			width="10"
			height="182"
			viewBox="0 0 10 121"
			preserveAspectRatio="xMidYMin meet"
		>
			<path d="M5 0 .5 9h9L5 0Zm.5 120.5V8h-1v113h1v-.5Z" />
		</svg> -->
	</button>
	<!-- <button
		type="button"
		style="background-image: url('/icons/arrow.svg');"
		on:click={goSomeWhereBack}
		class="back__button"
	/> -->
	<!-- <img on:click={goSomeWhereBack} class="back__button" src="/icons/back.svg" alt="" /> -->
{/if}

<style>
	.menu__back svg {
		display: block;
		margin: auto;
		transition: transform 0.3s;
	}

	.menu__back {
		width: calc(clamp(40px, 6.5vw + 12px, 90px) + 4vh);
		height: calc(clamp(40px, 6.5vw + 12px, 90px) + 4vh);
		cursor: pointer;
		position: absolute;
		/* padding: 2vh; */
		top: 0;
		left: 10px;
	}
</style>

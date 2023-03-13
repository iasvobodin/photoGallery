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
		type="button"
		style="background-image: url('/icons/back.svg');"
		on:click={goSomeWhereBack}
		class="back__button"
	/>
	<!-- <img on:click={goSomeWhereBack} class="back__button" src="/icons/back.svg" alt="" /> -->
{/if}

<style>
</style>

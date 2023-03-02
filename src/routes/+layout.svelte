<script>
	import { wWidth } from '$lib/store.js';
	import { wHeight } from '$lib/store.js';
	import { onMount } from 'svelte';
</script>

<div class="main"><slot /></div>

<div class="header">
	<img class="button" src="/icons/menu.svg" alt="" />
	<a href="/">
		<img class="button back" src="/icons/back.svg" alt="" />
	</a>
</div>

<style>
	.main {
		padding-top: 65px;
		padding-bottom: 10vh;
	}
	.header {
		background-color: black;
		width: 100%;
		height: 65px;
		position: fixed;
		top: 0;
	}
	.button {
		position: fixed;
		top: 10px;
		right: 10px;
		width: 45px;
		height: 45px;
		/* fill: white; */
		cursor: pointer;
	}
	.back {
		right: 70px;
	}
</style>

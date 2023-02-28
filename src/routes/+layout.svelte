<script>
	import { wWidth } from '$lib/store.js';
	import { wHeight } from '$lib/store.js';
	import { onMount } from 'svelte';

	// console.log($wWidth, $wHeight);
	onMount(() => {
		// console.log('layout is mounting');
	});
</script>

<slot />

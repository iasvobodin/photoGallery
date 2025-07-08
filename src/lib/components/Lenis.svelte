<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { setContext } from 'svelte';

	let lenis: Lenis;

	onMount(() => {
		lenis = new Lenis({
			lerp: 0.08
		});

		const raf = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
		raf(0);

		// Передаём объект lenis в контекст
		setContext('lenis', lenis);

		return () => {
			lenis.destroy();
		};
	});
</script>

<style>
	/* стили для компонента Lenis */
</style>

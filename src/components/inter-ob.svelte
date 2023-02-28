<script lang="ts">
	import { onMount } from 'svelte';

	export let once = false;
	export let top = 0;
	export let bottom = 0;
	export let left = 0;
	export let right = 0;
	let intersectionRatio;
	let intersecting = false;
	let container: HTMLElement;

	onMount(() => {
		// console.log('iterob is mounting');
		if (typeof IntersectionObserver !== 'undefined') {
			const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;

			const observer = new IntersectionObserver(
				(entries) => {
					intersecting = entries[0].isIntersecting;
					intersectionRatio = entries[0].intersectionRatio;
					intersectionRatio == 1 && console.log(intersecting);
					if (intersecting && once) {
						observer.unobserve(container);
					}
				},
				{
					rootMargin
				}
			);

			observer.observe(container);
			// console.log(intersectionRatio, intersecting);

			return () => observer.unobserve(container);
		}
	});
</script>

<div bind:this={container}>
	<slot {intersecting} />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		border-radius: 4px;
		overflow: hidden;
	}
</style>

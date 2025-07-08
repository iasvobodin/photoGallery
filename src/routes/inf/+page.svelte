<script lang="ts">
	import type { PageData } from './$types';
	import CanvasGallery from '$lib/components/CanvasGallery.svelte';
	export let data: PageData;

	console.log(data);
</script>

<CanvasGallery allph={data.allph} />

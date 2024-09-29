<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	// console.log(data);
</script>

<h1>Фотосерии из базы</h1>
{#if data.photoseries}
	<ul>
		{#each data.photoseries as series}
			<li>{series.title}</li>
			<!-- <li>{series.Cover.photoName}</li> -->
		{/each}
	</ul>
{:else}
	<p>Нет данных для отображения</p>
{/if}

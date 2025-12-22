<script lang="ts">
	export let allph1: any[];
	export let allph2: any[];
	export let allph3: any[];
	export let allph: any;
	
	// Биндинги для DOM элементов - будут использоваться в GSAP анимациях
	export let galleryTopRef: HTMLDivElement;
	export let galleryMiddleRef: HTMLDivElement;
	export let galleryBottomRef: HTMLDivElement;
	export let galleryHolderRef: HTMLDivElement;
</script>

<div class="gallery_holder" bind:this={galleryHolderRef}>
	<div class="gallery gallery_top" bind:this={galleryTopRef}>
		{#each allph1 as item}
			<a data-sveltekit-reload href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
				<img
					style="aspect-ratio:{+item.Aspect};"
					class="gallery_img"
					src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
					alt={item.Title}
				/>
			</a>
		{/each}
		<div class="sub_title_portrait">
			<h2 class="sub_title">Фотосерии</h2>
		</div>
	</div>
	<div class="gallery gallery_middle" bind:this={galleryMiddleRef}>
		{#each allph2 as item}
			<a data-sveltekit-reload href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
				<img
					style="aspect-ratio:{+item.Aspect};"
					class="gallery_img"
					src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
					alt={item.Title}
				/>
			</a>
		{/each}
	</div>
	<div class="gallery gallery_bottom" bind:this={galleryBottomRef}>
		{#each allph3 as item}
			<a data-sveltekit-reload href={allph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
				<img
					style="aspect-ratio:{+item.Aspect};"
					class="gallery_img"
					src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
					alt={item.Title}
				/>
			</a>
		{/each}
	</div>
	<slot />
</div>

<style>
	.gallery_holder {
		position: relative;
		overflow: hidden;
		margin-top: 100vh;
		height: 100vh;
	}
	.gallery {
		display: flex;
		column-gap: 50px;
		width: fit-content;
		padding: 15px 0px;
	}
	.gallery_top,
	.gallery_bottom {
		height: 25vh;
	}
	.gallery_middle {
		height: 50vh;
	}
	.gallery_img {
		height: 100%;
		width: auto;
	}
	.sub_title_portrait {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 50vw;
	}
	.sub_title {
		font-size: clamp(24px, 24px + 4vw, 120px);
		margin: 0;
		font-weight: 400;
		mix-blend-mode: difference;
		color: rgb(255, 255, 255);
	}
</style>

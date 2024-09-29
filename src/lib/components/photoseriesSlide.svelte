<script lang="ts">
	export let ph: Photoseries;
    
	type Gallery = {
		Id: number;
		Route: string;
		Title: string;
		Cover: string;
		Aspect: number;
	};
	type Photoseries = {
		topGallery: Gallery[];
		middleGallery: Gallery[];
		bottomGallery: Gallery[];
	};
</script>

<div class="gallery gallery_top">
	{#each ph.topGallery as item}
		<a href={ph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
			<img
				decoding="async"
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
<div class="gallery gallery_middle">
	{#each ph.middleGallery as item}
		<a href={ph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
			<img
				decoding="async"
				style="aspect-ratio:{+item.Aspect};"
				class="gallery_img"
				src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
				alt={item.Title}
			/>
		</a>
	{/each}
</div>
<div class="gallery gallery_bottom">
	{#each ph.bottomGallery as item}
		<a href={ph ? `/photoseries/${item.Route.toLowerCase()}` : '/'}>
			<img
				decoding="async"
				style="aspect-ratio:{+item.Aspect};"
				class="gallery_img"
				src="https://img.svobodinaphoto.ru/320_{item.Cover}.webp"
				alt={item.Title}
			/>
		</a>
	{/each}
</div>

<style>
	.gallery {
		display: flex;
		column-gap: 50px;
		width: fit-content;
		padding: 15px 0px;
	}
	.gallery_top,
	.gallery_bottom {
		transform: translateX(-100%);
		height: 25vh;
	}
	.gallery_middle {
		height: 50vh;
		transform: translateX(75vw);
	}
	.gallery_img {
		height: 100%;
		object-fit: contain;
	}
	.gallery_img:hover {
		transform: scale(1.05);
		transition: transform 1s;
	}

	.sub_title_portrait {
		pointer-events: none;
		width: fit-content;
	}
	.sub_title {
		text-align: center;
		color: black;
		font-size: 20vh;
		line-height: 23vh;
		/* font-size: clamp(20px, 20px + 10vw, 80px); */
	}
	img {
		border-radius: 10px;
	}
</style>

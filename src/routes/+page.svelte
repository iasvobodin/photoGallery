<script>
	export let data;
</script>

<div class="wrapper">
	{#each data.photoseries as seriya, index (index)}
		<div class="plane plane__redy">
			<h3 class="main__head">
				{seriya?.Title}
			</h3>
			<picture class="standart__picture">
				<source
					media="(orientation: landscape)"
					srcset="image/720_{seriya.LandscapeFileName}.webp"
					type="image/webp"
				/>
				<!-- on:click={() => goto(`/${seriya.R÷oute}`)} -->
				<a href={`/${seriya.Route}`}>
					<img
						data-sampler="planeTexture"
						class="slider__img"
						alt="SvobodinaPhoto"
						crossorigin="anonimous"
						decoding="async"
						draggable="false"
						src="https://ik.imagekit.io/svobodinaphoto/tr:w-720/{seriya.LandscapeFileName}.jpg"
					/>
				</a>
			</picture>
		</div>
	{/each}
</div>

<!-- <div bind:this={webgl} id="curtains" /> -->
<style>
	.fullscreenTexture {
		pointer-events: none;
		position: absolute;
		width: 100%;
		height: 100vh;
	}
	.plane img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	:root {
		--plane__height: 55vh;
		--plane__width: calc(var(--plane__height) * 1.5);
	}
	.plane {
		position: relative;
		align-self: center;
		/* position: absolute; */
		box-sizing: border-box;
		/* height: var(--plane__height);
        width: var(--plane__width); */
		border-radius: 3px;
		overflow: hidden;
	}
	.main__head {
		/* opacity: 0; */
		/* z-index: 3; */
		white-space: pre;
		/* transform: translate(0, -50%); */
		/* position: absolute; */
		/* top: calc((100vh - var(--plane__height)) / 4); */
		/* left: 1vw; */
		font-family: Cormorant Infant, sans-serif;
		font-weight: 300;
		color: rgb(255, 255, 255);
		margin: 0;
		font-size: clamp(14px, 2vw + 12px, 40px);
		line-height: clamp(18px, 2.5vw + 12px, 40px);
	}
	.event {
		pointer-events: none;
	}

	.price__holder {
	}

	.wrapper {
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(auto-fill, minmax(max(38vw, 250px), 1fr));
		row-gap: 5vh;
		column-gap: 2vw;
		width: min(95vw, 1600px);
		margin: auto;
		margin-top: 3vh;
		color: white;
	}
</style>

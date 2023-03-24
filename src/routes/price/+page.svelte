<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1 class="main__head">Цены</h1>
<div class="price__image">
	<picture>
		<source
			srcSet="https://photoday.svobodinaphoto.store/1024_19-03-02-20-58-27.avif"
			type="image/avif"
		/>
		<source
			srcSet="https://photoday.svobodinaphoto.store/1024_19-03-02-20-58-27.webp"
			type="image/webp"
		/>
		<img
			decoding="async"
			loading="lazy"
			draggable="false"
			src="https://photoday.svobodinaphoto.store/1024_19-03-02-20-58-27.jpg"
			alt="SvobodinaPhot"
		/>
	</picture>
</div>
<div class="price__holder">
	{#each data.pricedata as el}
		<div class="price__tarif">
			<h3>{el.title}</h3>
			<ul style="align-self: stretch;">
				{#each el.body as element}
					<li class="price__body">{element}</li>
				{/each}
			</ul>
			<h4 style="align-self: end;justify-self: center;">
				Цена : {el.price}
			</h4>
		</div>
	{/each}
</div>

<style>
	.price__holder {
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(auto-fill, minmax(max(25vw, 250px), 1fr));
		row-gap: 5vh;
		column-gap: 2vw;
		width: 90vw;
		margin: auto;
		padding-bottom: 7vh;
	}
	.price__image {
		width: 100%;
		height: 50vh;
		margin-bottom: 5vh;
	}
	.price__image > picture > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 40%;
	}
	.price__tarif {
		position: relative;
		display: grid;
		border-radius: 5px;
		padding: 5px;
		background-image: radial-gradient(
				circle at 99% 33%,
				hsla(235, 0%, 48%, 0.03) 0%,
				hsla(235, 0%, 48%, 0.03) 37%,
				transparent 37%,
				transparent 100%
			),
			radial-gradient(
				circle at 46% 16%,
				hsla(235, 0%, 48%, 0.03) 0%,
				hsla(235, 0%, 48%, 0.03) 43%,
				transparent 43%,
				transparent 100%
			),
			radial-gradient(
				circle at 99% 25%,
				hsla(235, 0%, 48%, 0.03) 0%,
				hsla(235, 0%, 48%, 0.03) 22%,
				transparent 22%,
				transparent 100%
			),
			radial-gradient(
				circle at 57% 88%,
				hsla(235, 0%, 48%, 0.03) 0%,
				hsla(235, 0%, 48%, 0.03) 86%,
				transparent 86%,
				transparent 100%
			),
			radial-gradient(
				circle at 82% 78%,
				hsla(235, 0%, 48%, 0.03) 0%,
				hsla(235, 0%, 48%, 0.03) 22%,
				transparent 22%,
				transparent 100%
			),
			linear-gradient(90deg, rgb(0, 0, 0), rgb(0, 0, 0));
		box-shadow: 100px 100px 1px -99px rgba(255, 255, 255, 0.171);
	}
	.price__tarif > h3 {
		align-self: start;
		justify-self: center;
		white-space: pre-wrap;
	}
	.price__tarif > ul {
		align-self: stretch;
		margin-top: 5vh;
		margin-bottom: 5vh;
	}
	.price__tarif::before {
		content: '';
		z-index: -1;
		border-radius: 5px;
		background: linear-gradient(120deg, #57ebdb, #403ddb 41.07%, #070047 76.05%);
		position: absolute;
		top: -2px;
		left: -2px;
		width: calc(100% + 4px);
		height: calc(100% + 4px);
	}
	.price__body {
		font-family: Comfortaa, Sentinel SSm A, Sentinel SSm B, system-ui, -apple-system,
			BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
			Segoe UI Symbol;
		font-size: clamp(12px, calc(0.7rem + 0.25vw), 24px);
		line-height: clamp(18px, calc(1.2rem + 0.35vw), 32px);
		font-weight: 300;
		color: #ffffff;
		/* margin: 5vw; */
	}
</style>

<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let reviewsSlice = data.reviews;
	let toogleButton = true;
</script>

<svelte:head>
	<title>Отзывы</title>
</svelte:head>
<div class="reviews__holder">
	<h1 class="main__head rotate">Отзывы</h1>
	<div class="review__image">
		<picture>
			<source
				srcSet="https://photoday.svobodinaphoto.store/1024_20-07-03-19-19-22.avif"
				type="image/avif"
			/>
			<source
				srcSet="https://photoday.svobodinaphoto.store/1024_20-07-03-19-19-22.webp"
				type="image/webp"
			/>
			<img
				decoding="async"
				loading="lazy"
				draggable="false"
				src="https://photoday.svobodinaphoto.store/1024_20-07-03-19-19-22.jpg"
				alt="SvobodinaPhot"
			/>
		</picture>
		<!-- <img src="https://ik.imagekit.io/svobodinaphoto/tr:w-1000/20-07-03-19-19-22.jpg" alt="" /> -->
	</div>
	<div class="cont">
		{#each reviewsSlice as review}
			<div class="review">
				<div class="ava">
					<img src="/img/rev/{review.id}.jpg" alt="ava" />
				</div>
				<div class="review__decription">
					<h5 class="review__name">{review.name}</h5>
					<p class="review__body">{review.body}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	:root {
		--card__height: 350px;
	}
	/* .rotate {
		transform: translateX(-100%) rotate(-90deg);
		transform-origin: right top;
		width: 70vh;
		text-align: center;
	} */
	.review__image {
		width: 100%;
		height: 50vh;
		margin-bottom: 5vh;
	}
	.review__image > picture > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 90%;
	}
	.reviews__holder {
		position: relative;

		height: auto;
		margin: auto;
		/* margin: 7vh; */
		padding-bottom: 7vh;
	}
	.cont {
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(auto-fill, minmax(max(40vw, 250px), 1fr));
		width: 95%;
		margin: auto;
		grid-gap: 3vh;
	}
	.review {
		/* height: var(--card__height); */
		box-shadow: -3rem 0 3rem -2rem #000;
		border-radius: 5px;
		display: grid;
		grid-template-columns: minmax(30px, 200px) minmax(250px, 120ch);
	}
	/* <stop offset="0" stop-color="#57ebdb" />
        <stop offset="1" stop-color="#403ddb" /> */
	.review__body:before {
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
	.review__decription {
		position: relative;
		background: black;
		border-radius: 5px;
		display: grid;
	}
	.review__name {
		/* white-space: pre-wrap; */
		/* grid-area: 1/1; */
		align-self: start;
		justify-self: center;
		font-family: Cormorant Infant;
		padding: 5px;
		margin: 0;
		text-align: center;
		font-size: calc(20px + 1vw);
		line-height: calc(20px + 1.2vw);
		font-weight: 300;
		color: #ffffff;
	}

	.ava {
		/* box-shadow: 5px 5px 5px 0px #292929; */
		/* filter: grayscale(100%); */
		/* grid-area: 1/1; */
		/* align-self: start; */
		place-self: center;
		overflow: hidden;
		border-radius: 5px 5px 5px 5px;
		width: min(150px, 100%);
		height: min(300px, 100%);
	}
	.ava > img {
		height: 100%;
		width: 100%;
		object-fit: contain;
		object-position: top;
	}
	/* .arrow {
		align-self: end;
		justify-self: end;
		margin-right: 2%;
		margin-bottom: 2%;
		width: 25px;
	} */
	.review__body {
		place-self: stretch;
		margin: 0;
		padding: 1vw;
		font-family: Comfortaa, Sentinel SSm A, Sentinel SSm B, system-ui, -apple-system,
			BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
			Segoe UI Symbol;
		font-size: clamp(12px, calc(0.7rem + 0.25vw), 24px);
		line-height: clamp(18px, calc(1.2rem + 0.35vw), 32px);
		font-weight: 150;
		color: white;
		white-space: pre-wrap;
	}
	@media (max-width: 1200px) {
		.ava {
			display: none;
		}
		.review {
			height: auto;
			grid-template-columns: minmax(250px, 120ch);
		}
		.review__decription {
			height: auto;
		}
	}
</style>

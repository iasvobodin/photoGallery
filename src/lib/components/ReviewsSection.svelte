<script lang="ts">
	export let reviewsSlice: any[];
	export let reviewsRef: HTMLDivElement;
</script>

<div class="reviews" bind:this={reviewsRef}>
	<p class="reviews_title">Отзывы</p>
	{#each reviewsSlice as review}
		<div class="review_holder">
			<div class="review">
				<div class="ava">
					<img src="/img/rev/{review.id}.jpg" alt="ava" />
				</div>
				<div class="review__decription">
					<p class="review__name">{review.name}</p>
					<p class="review__body">{review.body}</p>
				</div>
			</div>
		</div>
	{/each}
	<a data-sveltekit-reload href="/reviews" class="reviews_link">Посмотреть все отзывы</a>
</div>

<style>
	.reviews {
		position: relative;
		width: 98vw;
		height: 100vh;
		margin: auto;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 12vh 1fr 10vh;
		row-gap: 2vh;
	}
	.reviews_title {
		font-size: clamp(24px, 24px + 4vw, 120px);
		margin: auto;
		font-weight: 400;
		color: rgb(0, 0, 0);
		text-decoration: none;
	}
	.review_holder {
		position: absolute;
		width: var(--rev_width);
	}
	.review {
		display: grid;
		grid-template-columns: 90px 1fr;
		column-gap: 20px;
		padding: 20px;
		background-color: rgb(245, 245, 245);
		border-radius: 10px;
	}
	.ava {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		overflow: hidden;
	}
	.ava img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.review__decription {
		display: grid;
		grid-template-rows: auto 1fr;
		row-gap: 10px;
	}
	.review__name {
		font-size: 18px;
		font-weight: 600;
		margin: 0;
		white-space: pre-line;
	}
	.review__body {
		font-size: 16px;
		margin: 0;
		line-height: 1.4;
	}
	.reviews_link {
		font-size: clamp(16px, 16px + 1vw, 30px);
		margin: auto;
		color: rgb(0, 0, 0);
		text-decoration: underline;
	}
	.reviews_link:hover {
		color: rgb(165, 0, 165);
	}
</style>

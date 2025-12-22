<script lang="ts">
	export let priceDescriptionByWords: string[];
	export let priceDescRef: HTMLDivElement;
</script>

<div class="price">
	<div class="price_desc" bind:this={priceDescRef}>
		{#each priceDescriptionByWords as word}
			<span class="words">{word}</span>
		{/each}
		<a class="price_link" data-sveltekit-reload href="/price">цены</a>
	</div>

	<p class="finish_desc">
		Я буду рада стать вашим фотографом и помочь вам запечатлеть ваши самые яркие моменты жизни в
		красивых и незабываемых фотографиях. Свяжитесь со мной, чтобы обсудить детали вашей будущей
		фотосессии и дайте мне возможность помочь вам сохранить ваши эмоции и чувства на долгие годы.
	</p>
	<div class="telegramm_bot">
		<p class="bot_desc">
			Подписывайтесь на моего <a
				href="https://t.me/SvobodinaPhoto_bot"
				rel="noreferrer"
				target="_blank"
				>телеграм бота
			</a>, там я публикую информацию о своих фотопроектах, акциях и скидках.
		</p>
		<a class="qr" href="https://t.me/SvobodinaPhoto_bot" rel="noreferrer" target="_blank">
			<img class="qr" src="/icons/qr-code.svg" alt="bot" />
		</a>
	</div>
</div>

<style>
	.price {
		position: relative;
		width: min(95%, 1500px);
		margin: 20vh auto;
		display: grid;
		row-gap: 5vh;
	}
	.price_desc {
		font-size: clamp(18px, 18px + 0.8vw, 30px);
		text-align: justify;
	}
	.words {
		opacity: 0;
	}
	.price_link {
		opacity: 0;
		color: rgb(0, 0, 0);
		text-decoration: underline;
		font-weight: 600;
	}
	.price_link:hover {
		color: rgb(165, 0, 165);
	}
	.finish_desc {
		font-size: clamp(18px, 18px + 0.8vw, 30px);
		text-align: justify;
		margin: 0;
	}
	.telegramm_bot {
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 20px;
		align-items: center;
	}
	.bot_desc {
		font-size: clamp(16px, 16px + 0.8vw, 26px);
		margin: 0;
	}
	.bot_desc a {
		color: rgb(0, 0, 0);
		text-decoration: underline;
	}
	.bot_desc a:hover {
		color: rgb(165, 0, 165);
	}
	.qr {
		width: min(150px, 20vw);
		height: auto;
	}
</style>

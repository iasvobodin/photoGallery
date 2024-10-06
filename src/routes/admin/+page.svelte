<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	import { onMount } from 'svelte';

	let widgetLoaded = false;

	// Динамически загружаем виджет Telegram при монтировании компонента
	onMount(() => {
		if (!widgetLoaded) {
			const script = document.createElement('script');
			script.src = 'https://telegram.org/js/telegram-widget.js?15';
			script.async = true;
			script.setAttribute('data-telegram-login', 'SvobodinaPhoto_bot');
			script.setAttribute('data-size', 'large');
			script.setAttribute('data-auth-url', '/.netlify/functions/telegram-auth'); // Замените на ваш обработчик
			script.setAttribute('data-request-access', 'write'); // Опционально, если нужны права на отправку сообщений
			document.getElementById('telegram-widget-container')!.appendChild(script);
			widgetLoaded = true;
		}
	});
</script>

<h1>Фотосерии из базы rrefd</h1>
{#if data.photoseries}
	<ul>
		{#each data.photoseries as series}
			<li>{series.title}</li>
			<img src="https://img.svobodinaphoto.ru/320_{series.Cover.photoName}.webp" alt="" />
		{/each}
	</ul>
{:else}
	<p>Нет данных для отображения</p>
{/if}

<main>
	<h1>Авторизация через Telegram!!!</h1>
	<div id="telegram-widget-container"></div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
</style>

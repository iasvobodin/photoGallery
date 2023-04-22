<script>
	import { onMount } from 'svelte';

	onMount(() => {
		VK.init({
			apiId: '51622968',
			onlyWidgets: true
		});
		VK.Widgets.Article(
			'vk_article_-163390211_40723',
			'@svobodinaphoto-zagsy-naiznanku-sovetskii-raion'
		);
		VK.Widgets.Article(
			'vk_article_-163390211_81528',
			'@svobodinaphoto-zagsy-naiznanku-kurchatovskii-raion'
		);
		VK.Widgets.Article(
			'vk_article_-163390211_60470',
			'@svobodinaphoto-zagsy-naiznanku-centralnyi-raion'
		);
		VK.Widgets.Article(
			'vk_article_-163390211_44003',
			'@svobodinaphoto-zagsy-naiznanku-kalininskii-raion'
		);
		VK.Widgets.Article(
			'vk_article_-163390211_89413',
			'@svobodinaphoto-kupit-gotovoe-plate-ili-sshit-svoe'
		);
		VK.Widgets.Article(
			'vk_article_-163390211_31609',
			'@svobodinaphoto-chelyabinskie-zagsy-glazami-hudozhnika-photoshop-i-nikakogo'
		);
	});
</script>

<svelte:head>
	<title>Статьи</title>
	<script
		type="text/javascript"
		src="https://vk.com/js/api/openapi.js?168"
		charset="windows-1251"
	></script>
</svelte:head>
<h1 class="main__head">Статьи</h1>
<div class="articles">
	<div id="vk_article_-163390211_40723" />
	<div id="vk_article_-163390211_81528" />
	<div id="vk_article_-163390211_60470" />
	<div id="vk_article_-163390211_44003" />
	<div id="vk_article_-163390211_89413" />
	<div id="vk_article_-163390211_31609" />
</div>

<style>
	.articles {
		width: max(1000px, 95%);
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(auto-fill, minmax(max(35vw, 250px), 1fr));
		row-gap: 5vw;
		column-gap: 5vw;
		margin: auto;
		padding-bottom: 10vh;
	}
</style>

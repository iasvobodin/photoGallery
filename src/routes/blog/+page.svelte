<script>
	import { onMount } from 'svelte';

	// let VK;
	// import * as VK from '$lib/assets/openapi.js';
	onMount(() => {
		window.VK.init({
			apiId: '51622968',
			onlyWidgets: true
		});
		console.log(window.VK);
		window.VK.Widgets.Article(
			'article_view_-163390211_40723',
			'/@svobodinaphoto-zagsy-naiznanku-sovetskii-raion'
		);
	});
</script>

<svelte:head>
	<title>Статьи</title>
	<script type="text/javascript" src="https://vk.com/js/api/openapi.js?169"></script>
</svelte:head>

<div id="article_view_-163390211_40723" />

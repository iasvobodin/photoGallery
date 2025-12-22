<script lang="ts">
	import Contact from '$lib/components/contact.svelte';
	
	export let showDis: boolean = false;
	export let order: () => void;
</script>

<div class="contact">
	<button class="disbut" aria-label="Button" on:click={order} type="button">
		<p class="cta">Заказать</p>
	</button>
	{#if showDis}
		<div class="dis">
			<p class="disclemer">
				<span>*</span> Я не хочу собирать и обрабатывать информацию о вас, размещать здесь никому
				не нужную "политику конфеденциальности" и прочие радости, которые необходимо соблюдать по закону, чтобы сделать форму для заказа с сайта.
				<br />
				<br />
				Поэтому ниже ссылки на <b>директ</b> во все разрешенные и запрещённые😎 на территории РФ соцсети
				<br />
				<br />
				Напишите мне, я всегда рада ответить 😊
			</p>
		</div>
		<Contact />
	{/if}
</div>

<style>
	.contact {
		width: 98%;
		margin: 5vh auto;
		display: grid;
		row-gap: 3vh;
	}
	.disbut {
		all: unset;
		cursor: pointer;
		margin: auto;
	}
	.cta {
		font-size: clamp(24px, 24px + 4vw, 120px);
		margin: 0;
		font-weight: 400;
		color: rgb(0, 0, 0);
		text-align: center;
	}
	.cta:hover {
		color: rgb(165, 0, 165);
	}
	.dis {
		width: min(95%, 800px);
		margin: auto;
	}
	.disclemer {
		font-size: clamp(16px, 16px + 0.6vw, 24px);
		text-align: justify;
	}
	.disclemer span {
		font-weight: 600;
		color: rgb(165, 0, 165);
	}
	.disclemer b {
		font-weight: 600;
	}
</style>

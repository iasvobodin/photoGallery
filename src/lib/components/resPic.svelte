<script lang="ts">
	export let imageP: string;
	export let imageH: string;
	export let orintation: boolean;
	export let size: number;
	const link = 'https://img.svobodinaphoto.ru';
</script>

<picture class={$$props.class}>
	{#if orintation}
		<source
			media="(orientation: portrait)"
			srcset="{link}/{size}_{imageP}.avif"
			type="image/avif"
		/>
		<source
			media="(orientation: portrait)"
			srcset="{link}/{size}_{imageP}.webp"
			type="image/webp"
		/>
		<source
			media="(orientation: landscape)"
			srcset="{link}/{size}_{imageH}.avif"
			type="image/avif"
		/>
		<source
			media="(orientation: landscape)"
			srcset="{link}/{size}_{imageH}.webp"
			type="image/webp"
		/>
	{:else}
		<source srcset="{link}/{size}_{imageH}.avif" type="image/avif" />
		<source srcset="{link}/{size}_{imageH}.webp" type="image/webp" />
	{/if}

	<img alt="SvobodinaPhoto" decoding="async" draggable="false" src="{link}/{size}_{imageH}.jpg" />
</picture>

<style>
	img {
		object-fit: cover;
		object-position: center;
		width: 100%;
		height: 100%;
		border-right: 20px;
	}
</style>

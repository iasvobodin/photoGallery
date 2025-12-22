<script lang="ts">
	// Биндинги для GSAP анимаций
	export let heroHolderRef: HTMLDivElement;
	export let heroRef: HTMLDivElement;
	export let heroTitleRef: HTMLParagraphElement;
	export let heroTitle2Ref: HTMLParagraphElement;
	export let heroListHolderRef: HTMLDivElement;
	export let dummy1Ref: HTMLDivElement;
	export let dummy2Ref: HTMLDivElement;
</script>

<div class="hero_holder" bind:this={heroHolderRef}>
	<div class="hx hero" bind:this={heroRef}>
		<img class="x1" src="/h_X/1x.webp" alt="x1" />
		<img class="x2" src="/h_X/2x.webp" alt="x2" />
		<img class="x3" src="/h_X/3x.webp" alt="x3" />
		<img class="x4" src="/h_X/4x.webp" alt="x4" />
	</div>
	<div class="hero_desc">
		<p class="hero_title" bind:this={heroTitleRef}>Профессиональное оборудование.</p>
		<p class="hero_title2" bind:this={heroTitle2Ref}>Качество в мельчайших деталях.</p>
		<div class="hero_list_holder" bind:this={heroListHolderRef}>
			<q class="hero_list">
				Я уверена, что лучшая фотосессия - это та, которая проходит гладко и без сбоев. Именно
				поэтому я всегда имею при себе резервный комплект оборудования, чтобы независимо от
				того, что произойдет, я смогу сохранить всё что снято непосильным трудом. Вы можете быть
				уверены, что я всегда буду готова к любым условиям!
			</q>
		</div>
		<div class="dummy1" bind:this={dummy1Ref} />
		<div class="dummy2" bind:this={dummy2Ref} />
	</div>
</div>

<style>
	.hero_holder {
		opacity: 0;
		position: absolute;
		top: 0;
		pointer-events: none;
		overflow: hidden;
		width: 100%;
		height: 100vh;
	}
	.hero {
		pointer-events: none;
		transform-origin: 0px 0px;
		transform: translate3d(-2050px, -2547.02px, 0px);
		border-radius: 10px;
		overflow: hidden;
	}
	.hx {
		width: 5381px;
		height: 8072px;
		position: relative;
	}
	.x1 {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 10px;
		z-index: 4;
	}
	.x2 {
		position: absolute;
		top: 1000px;
		height: 4000px;
		z-index: 3;
	}
	.x3 {
		position: absolute;
		height: 2000px;
		width: 3000px;
		top: 2000px;
		left: 1500px;
		z-index: 2;
	}
	.x4 {
		position: absolute;
		top: 2500px;
		left: 2000px;
		z-index: 1;
	}
	.hero_desc {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		display: grid;
		pointer-events: none;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr;
		grid-template-areas:
			'first'
			'second';
	}
	.hero_title,
	.hero_title2,
	.hero_list_holder {
		opacity: 0;
		font-size: clamp(16px, 18px + 1.5vw, 50px);
		color: black;
		text-align: center;
		padding: 0;
		line-height: 1.2;
		margin: 0;
	}
	.hero_title {
		width: min(1000px, 90%);
		align-self: start;
		justify-self: end;
		grid-area: first;
		margin-top: 5vh;
		margin-bottom: 5vh;
	}
	.hero_title2 {
		width: min(1000px, 90%);
		place-self: end end;
		grid-area: second;
		margin-top: 5vh;
		margin-bottom: 5vh;
	}
	.hero_list_holder {
		grid-area: 1/1/3/2;
		align-self: center;
		justify-self: end;
		width: min(1000px, 75%);
	}
	.hero_list {
		font-size: clamp(16px, 14px + 0.5vw, 24px);
		color: rgb(0, 0, 0);
		text-indent: 2ch;
		border-left: 2px solid rgb(1, 175, 255);
		margin: auto;
		width: max(600px, 100%);
		display: block;
		padding: 10px;
	}
	.dummy1,
	.dummy2 {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: white;
		z-index: 10;
	}
	.dummy1 {
		grid-area: first;
		top: -100%;
	}
	.dummy2 {
		grid-area: second;
		bottom: -100%;
	}
	
	@media (orientation: portrait) {
		.hero {
			transform: translate3d(-2960.19px, -2635.27px, 0px);
		}
		.hero_list_holder {
			display: none;
		}
		.hero_title,
		.hero_title2 {
			width: 100%;
			margin-top: 5vh;
			margin-bottom: 5vh;
		}
	}
</style>

<div class="menu-wrap">
	<div class="tiles">
		<div class="tiles__line">
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/slide/1.png)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/slide/2.png)" />
			<div class="tiles__line-img" style="background-image:url(img/slide/3.png)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/slide/1.png)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/slide/2.png)" />
			<div class="tiles__line-img" style="background-image:url(img/slide/3.png)" />
		</div>
		<div class="tiles__line">
			<div class="tiles__line-img" style="background-image:url(img/slide/2.png)" />
			<div class="tiles__line-img" style="background-image:url(img/slide/3.png)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/slide/1.png)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/slide/2.png)" />
			<div class="tiles__line-img" style="background-image:url(img/slide/3.png)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/slide/1.png)"
			/>
		</div>
		<div class="tiles__line">
			<div class="tiles__line-img" style="background-image:url(img/slide/3.png)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/slide/4.png)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/slide/2.png)" />
			<div class="tiles__line-img" style="background-image:url(img/slide/3.png)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/slide/4.png)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/slide/2.png)" />
		</div>
	</div>
</div>

<style>
	.menu-wrap {
		overflow: hidden;
		grid-area: 1 / 1 / 2 / 2;
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 100vh;
		position: relative;
		background: var(--color-bg-menu);
		pointer-events: none;
	}
	.tiles {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 170vh;
		display: flex;
		opacity: 0.7;
		flex-direction: column;
		justify-content: center;
		transform: translate3d(-50%, -50%, 0) rotate(25deg);
	}

	.tiles__line {
		display: flex;
		transform: translateX(25%);
		animation: runner 15s linear infinite;
	}

	.tiles__line:nth-child(2) {
		animation-duration: 25s;
	}

	.tiles__line:nth-child(3) {
		animation-duration: 30s;
	}

	@keyframes runner {
		to {
			transform: translateX(-25%);
		}
	}
	.tiles__line-img {
		--tile-margin: 0px;
		flex: none;
		width: 30vh;
		height: 55vh;
		margin: var(--tile-margin);
		background-size: cover;
		background-position: 50% 50%;
		border-radius: 5px;
	}

	.tiles__line-img--large {
		width: 150vh;
		border-radius: 10px;
	}
</style>

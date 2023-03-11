<div class="menu-wrap">
	<div class="tiles">
		<div class="tiles__line">
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/4.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/5.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/6.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/4.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/5.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/6.jpg)" />
		</div>
		<div class="tiles__line">
			<div class="tiles__line-img" style="background-image:url(img/rev/1.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/2.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/14.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/1.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/2.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/14.jpg)"
			/>
		</div>
		<div class="tiles__line">
			<div class="tiles__line-img" style="background-image:url(img/rev/7.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/8.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/7.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/8.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
		</div>
	</div>
</div>

<style>
	.menu-wrap {
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
		height: 150vh;
		display: flex;
		opacity: 0.5;
		flex-direction: column;
		justify-content: center;
		transform: translate3d(-50%, -50%, 0) rotate(22.5deg);
	}

	.tiles__line {
		display: flex;
		transform: translateX(25%);
		animation: runner 10s linear infinite;
	}

	.tiles__line:nth-child(2) {
		animation-duration: 16s;
	}

	.tiles__line:nth-child(3) {
		animation-duration: 22s;
	}

	@keyframes runner {
		to {
			transform: translateX(-25%);
		}
	}
	.tiles__line-img {
		--tile-margin: 3vw;
		flex: none;
		width: 30vh;
		height: 30vh;
		margin: var(--tile-margin);
		background-size: cover;
		background-position: 50% 50%;
		border-radius: 50%;
	}

	.tiles__line-img--large {
		width: 100vh;
		border-radius: 20vh;
	}
</style>

<div class="menu-wrap">
	<div class="tiles">
		<div class="tiles__line">
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/9.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/9.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
		</div>
		<div class="tiles__line">
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/9.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/9.jpg)"
			/>
		</div>
		<!-- <div class="tiles__line">
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/9.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
			<div
				class="tiles__line-img tiles__line-img--large"
				style="background-image:url(img/rev/9.jpg)"
			/>
			<div class="tiles__line-img" style="background-image:url(img/rev/9.jpg)" />
		</div> -->
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
	/* .tiles {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 170vh;
		display: flex;
		opacity: 0.7;
		flex-direction: column;
		justify-content: center;
		transform: translate3d(-50%, -50%, 0) rotate(20deg);
	} */

	/* .tiles__line {
		display: flex;
		transform: translateX(25%);
		animation: runner 15s linear infinite;
	} */
	.tiles {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 300vh;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		column-gap: 2vw;
		opacity: 0.7;
		/* flex-direction: column; */
		justify-content: center;
		transform: translate3d(-50%, -50%, 0) rotate(320deg);
	}
	.tiles__line {
		display: grid;
		grid-auto-flow: row;
		grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
		/* width: 30vw; */
		transform: translateY(-25%);
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
			transform: translateY(25%);
		}
	}
	.tiles__line-img {
		--tile-margin: 0px;
		flex: none;
		width: 35vw;
		height: calc(35vw * 1.5);
		margin: var(--tile-margin);
		background-size: cover;
		background-position: 50% 50%;
		border-radius: 5px;
		/* transform: rotate(-90deg); */
	}

	.tiles__line-img--large {
		/* width: 50vh; */
		border-radius: 10px;
		/* transform: rotate(270deg); */
	}
</style>

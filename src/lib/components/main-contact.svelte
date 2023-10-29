<div class="contact">
	<div class="icons">
		<a href="https://t.me/svobodinaphoto/" rel="noreferrer" target="_blank">
			<img src="/icons/Telegram.svg" alt="Telegram" />
		</a>
		<a href="https://ig.me/m/svobodinaphoto/" rel="noreferrer" target="_blank">
			<img src="/icons/Instagram.svg" alt="instagram" />
		</a>
		<a href="https://vk.me/aasvobodina/" rel="noreferrer" target="_blank">
			<img src="/icons/VK.svg" alt="VK" />
		</a>
		<a href="https://wa.me/%2B79514616243" rel="noreferrer" target="_blank">
			<img src="/icons/Whatsapp.svg" alt="Whatsapp" />
		</a>
	</div>
	<div id="b" />
</div>

<style>
	.contact {
		position: relative;
	}
	.icons {
		z-index: 1;
		position: relative;
		display: grid;
		grid-auto-flow: column;
		justify-content: space-evenly;
		width: 100%;
		padding-top: 5vh;
		padding-bottom: 5vh;
	}

	.icons > a,
	.icons > a > img {
		height: 5vh;
	}
	@media (orientation: portrait) {
		.icons {
			padding-bottom: 10vh;
		}
	}

	#b {
		top: 2.5vh;
		width: 95%;
		left: 0;
		right: 0;
		margin: auto;
		height: 10vh;
		position: absolute;
		border-radius: 50px;
		cursor: pointer;
	}

	/* #b:hover::after {
		opacity: 0.5;
	} */

	#b::after {
		content: '';
		display: block;
		position: absolute;
		background: #ffffff;
		inset: 2px;
		border-radius: 45px;
		/* z-index: 1; */
		transition: opacity 0.3s ease;
	}

	@property --r2 {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}

	@property --x {
		syntax: '<length>';
		inherits: false;
		initial-value: 0px;
	}

	#b {
		background: conic-gradient(
			from calc(var(--r2) - 80deg) at var(--x) 5vh,
			#fff 0%,
			rgb(1, 175, 255) 20%,
			#fff 25%
		);
		animation: -0.64s rotating2 5s linear infinite, -0.64s x 5s linear infinite;
	}
	@keyframes x {
		/* w:h === 6:1 */
		/* with a 80px x-margin */
		0% {
			--x: 80px;
		}
		/* 6/(6+3.14) * 50% */
		32.82275711% {
			--x: calc(95vw - 80px);
		}
		50% {
			--x: calc(95vw - 80px);
		}
		/* 50% + 32.8% */
		82.82275711% {
			--x: 80px;
		}
		100% {
			--x: 80px;
		}
	}

	@keyframes rotating2 {
		0% {
			--r2: 0deg;
		}
		32.82275711% {
			--r2: 0deg;
		}
		50% {
			--r2: 180deg;
		}
		82.82275711% {
			--r2: 180deg;
		}
		100% {
			--r2: 360deg;
		}
	}
</style>

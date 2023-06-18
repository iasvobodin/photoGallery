<script lang="ts">
	const fetchToFile = async () => {
		try {
			const req = await fetch('/api/hello');
			const res = await req.json();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};
</script>

<h1>Admin</h1>
<button on:click={fetchToFile}>Load data</button>

<div class="test">
	<img src="/covers/22-11-07-13-54-12.jpg" alt="" />
	<img src="/covers/22-11-07-13-54-12.svg" alt="" />
</div>

<style>
	.test {
		display: grid;
		width: 70vw;
		margin: auto;
	}
	.test > img {
		grid-area: 1/1/2/2;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transition: opacity 1s;
	}
	.test > img:last-child:hover {
		opacity: 0;
	}
	button {
		margin: 10vh;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import justifiedLayout from 'justified-layout';

	export let data: PageData;

	let slider,
		cover = <Array<HTMLDivElement>>[],
		allph = data.allph,
		block: HTMLDivElement,
		animationFrame,
		sliderState = {
			clickDown: <Array<number>>[],
			clickUp: <Array<number>>[],
			translation: [0, 0],
			currentPosition: [0, 0],
			planeCorrection: 0,
			isMouseDown: false,
			startPosition: [0, 0],
			endPosition: [0, 0],
			mousePosition: <Array<number>>[],
			moveSpeed: 2
		},
		isTrackpad = true;
	// $: eventAnimation = false;

	let test = allph.slice(0, 10);

	let allphHor = [...allph.filter((e) => e.Aspect > 1), ...allph.filter((e) => e.Aspect < 1)];

	const sliced_array = [];

	const subArray = allph.length / 5;

	for (let i = 0; i < allph.length; i += subArray) {
		console.log(i);

		sliced_array.push(allph.slice(i, i + subArray));
	}

	console.log(sliced_array);
	let containerHeightLoy: string;

	const aspect = allph.reduce((acc, el) => {
		acc.push(el.Aspect);
		return acc;
	}, <Array<number>>[]);

	const layout = justifiedLayout(aspect, {
		// fullWidthBreakoutRowCadence: 4,
		showWidows: false, //CUT SOME PICTURES IN THE END
		targetRowHeight: 300,
		containerWidth: 2350, //* 2,
		// containerPadding: {
		// 	// top: height * 0.03,
		// 	// right: width * 0.03, // window.innerWidth * paddingCoef,
		// 	// bottom: height * 0.03,
		// 	// left: width * 0.03 // window.innerWidth * paddingCoef
		// },

		boxSpacing: {
			horizontal: 20,
			vertical: 20
		}
	});
	containerHeightLoy = `${layout.containerHeight}px`;

	let layoutData = layout.boxes.map((el, i) => {
		return {
			Route: allph[i]!.Route,
			// Title: galleryData!.Title[i],
			// titleStyle: `font-size:calc(16px + ${Math.floor(el.width) / 40}px)`,
			imageSrc: `https://img.svobodinaphoto.ru/${imageWidth(el.width)}_${allph[i]!.Cover}`,
			boxStyle: `
				position: absolute;
				margin:0;
				left:${Math.floor(el.left)}px;
				top:${Math.floor(el.top)}px;
				width: ${Math.floor(el.width)}px;
				height: ${Math.floor(el.height)}px;
					`
		};
	});
	function imageWidth(x: number) {
		// [320, 480, 600, 720, 1024, 1440, 1920, 2560];
		const calcWidth =
			x < 320
				? 320
				: x < 480
				? 480
				: x < 600
				? 600
				: x < 720
				? 720
				: x < 1024
				? 1024
				: x < 1440
				? 1440
				: x < 1920
				? 1920
				: 2560;
		return calcWidth;
	}
	console.log(layout);

	function translateSlider() {
		// curtains.render();

		// if ($eventAnimation) {
		sliderState.translation[0] +=
			(sliderState.currentPosition[0] - sliderState.translation[0]) * 0.05;
		sliderState.translation[1] +=
			(sliderState.currentPosition[1] - sliderState.translation[1]) * 0.05;
		// console.log(sliderState.translation);
		// if (
		// 	sliderState.translation[0] - sliderState.currentPosition[0] < 0.01 ||
		// 	sliderState.translation[0] - sliderState.currentPosition[0] > 0.01
		// ) {
		// 	sliderState.translation[0] = sliderState.currentPosition[0];
		// }
		block.style.transform = `translate(${sliderState.translation[0]}px, ${sliderState.translation[1]}px)`;
		// cover.forEach((e) => {

		// 	// e.style.transform = `translate(${sliderState.translation[0]}px, ${sliderState.translation[1]}px)`;
		// });

		animationFrame = requestAnimationFrame(translateSlider);
	}
	// $: console.log(sliderState);
	// EVENT CONTROLS
	// function onPlaneClick(mouse) {
	// 	planes.forEach((el, i) => {
	// 		if (!el.isDrawn()) {
	// 			return;
	// 		}
	// 		const { left, width } = el.getWebGLBoundingRect();
	// 		if (!(mouse >= left / curtains.pixelRatio && mouse <= (left + width) / curtains.pixelRatio)) {
	// 			return;
	// 		}
	// 		// Clicked
	// 		activePlane = el;
	// 		//   testId = el.index;
	// 		//   activePlaneTitle = planesTitle[i];
	// 		eventAnimation.set(false);
	// 		// getUnifors(activePlane);
	// 		toRouteAnim();
	// 		goto(`/${el.userData.route}/`);
	// 	});
	// }
	function onMouseDown(e: MouseEvent | TouchEvent) {
		sliderState.isMouseDown = true;
		sliderState.clickDown = getMousePosition(e);
		sliderState.startPosition = sliderState.clickDown;
	}
	// function onChangeTitle() {
	// 	let index = -Math.round(sliderState.currentPosition / (angleStep * 1300)) % $photoseries.length;
	// 	// testId = index >= 1 ? $photoseries.length - index : Math.abs(index);
	// 	titleIndex.set(index >= 1 ? $photoseries.length - index : Math.abs(index));
	// }
	function onMouseMove(e: MouseEvent | TouchEvent) {
		if (!sliderState.isMouseDown) return;
		sliderState.mousePosition = getMousePosition(e);
		sliderState.currentPosition = [
			sliderState.endPosition[0] +
				(sliderState.mousePosition[0] - sliderState.startPosition[0]) * sliderState.moveSpeed,

			// sliderState.currentPosition[1] =
			sliderState.endPosition[1] +
				(sliderState.mousePosition[1] - sliderState.startPosition[1]) * sliderState.moveSpeed
		];
		// onChangeTitle(sliderState.currentPosition, e);
		console.log(sliderState.currentPosition);
	}
	function onMouseUp(e: MouseEvent | TouchEvent) {
		sliderState.isMouseDown = false;
		sliderState.endPosition = sliderState.currentPosition;
		sliderState.clickUp = getMousePosition(e);
		if (
			sliderState.clickUp[0] === sliderState.clickDown[0] &&
			// $eventAnimation &&
			sliderState.clickUp[1] === sliderState.clickDown[1]
		) {
			// onPlaneClick(sliderState.clickUp[0]);
		}
	}

	function getMousePosition(e: MouseEvent | TouchEvent) {
		let mousePosition: number[] = [];
		if (e instanceof TouchEvent) {
			if (e.targetTouches[0]) {
				mousePosition = [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
			}
			if (e.changedTouches[0]) {
				mousePosition = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
			}
		} else {
			mousePosition = [e.clientX, e.clientY];
		}

		return mousePosition;
	}

	function onWheel(e: WheelEvent) {
		// if ($eventAnimation) {
		e.preventDefault();
		if (isTrackpad) {
			if (e.deltaY) {
				if (Math.abs(e.deltaY) !== 120) {
					isTrackpad = false;
				}
			} else if (e.deltaMode === 0) {
				isTrackpad = false;
			}
		}
		const delta = window.navigator.userAgent.includes('Firefox') ? e.deltaY * 33 : e.deltaY;
		!isTrackpad
			? (sliderState.currentPosition[0] += e.deltaY * -1)
			: (sliderState.currentPosition[0] += delta * -1);
		sliderState.endPosition = sliderState.currentPosition;
		// onChangeTitle(sliderState.currentPosition, e);
		// }
	}
	onMount(() => {
		translateSlider();
		// console.log(cover);
	});
</script>

<!-- class:event={!$eventAnimation} -->
<p>{sliderState.translation[0]},,, {sliderState.currentPosition[0]}</p>
<div
	bind:this={slider}
	on:mousemove={onMouseMove}
	on:touchmove|passive={onMouseMove}
	on:mouseleave={onMouseUp}
	on:mouseup={onMouseUp}
	on:mousedown|preventDefault={onMouseDown}
	on:touchstart|preventDefault={onMouseDown}
	on:touchend={onMouseUp}
	on:wheel={onWheel}
	class="wrapper"
>
	<!-- style={`height: ${containerHeightLoy}`} -->
	<div class="test">
		<div class="hh">
			<div bind:this={block} class="holder">
				{#each layoutData as photo, index (index)}
					<div bind:this={cover[index]} class="tt" style={photo.boxStyle}>
						<picture>
							<source srcSet="{photo.imageSrc}.avif" type="image/avif" />
							<source srcSet="{photo.imageSrc}.webp" type="image/webp" />
							<img
								decoding="async"
								draggable="false"
								src="{photo.imageSrc}.jpg"
								alt="SvobodinaPhot"
							/>
						</picture>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- <div class="test">
		<div bind:this={block}>
			{#each sliced_array as item}
				<div class="gallery gallery_middle">
					{#each item as ttt}
						<img
							style="aspect-ratio:{+ttt.Aspect};"
							class="gallery_img"
							src="https://img.svobodinaphoto.ru/320_{ttt.Cover}.webp"
							alt={ttt.Title}
						/>
					{/each}
				</div>
			{/each}
		</div> -->

	<!-- <div bind:this={block} class="block">a</div> -->
	<!-- <div class="gallery gallery_middle">
			{#each test as ttt, i}
				<img
					bind:this={cover[i]}
					style="aspect-ratio:{+ttt.Aspect};"
					class="gallery_img"
					src="https://img.svobodinaphoto.ru/320_{ttt.Cover}.webp"
					alt={ttt.Title}
				/>
			{/each}
		</div> -->
	<!-- </div> -->
</div>

<!-- <script>
	import Slider from '$lib/components/slider.svelte';
</script> -->

<style>
	.test {
		width: 100%;
		height: 100vh;
		border: 1px solid red;
		display: grid;
		margin: auto;
		/* margin-top: 10vh; */
		overflow: hidden;
	}
	.block {
		width: 100px;
		height: 100px;
		background-color: red;
		border-radius: 10px;
	}
	.gallery {
		display: flex;
		column-gap: 50px;
		width: fit-content;
		padding: 15px 0px;
		height: 300px;
	}
	.tt {
		cursor: pointer;
		/* display: none; */
		border-radius: 5px;
		overflow: hidden;
		transition: transform 0.5s;
		margin: auto;
		margin-bottom: 10vh;
		height: 70vh;
		width: 80vw;
		/* opacity: 0; */
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.hh {
		position: absolute;
		top: 50vh;
		left: 50vw;
		transform: translate(-50%, -50%);
	}
	.holder {
		/* place-self: center; */
		position: relative;
		width: fit-content;
		height: fit-content;
		/* left: -50%;
		top: -50%; */
		transform: translate3d(-50%, 50% 0px);
		/* display: flex; */
		/* display: grid;
		grid-template-columns: repeat(auto-fill, minmax(max(38vw, 250px), 1fr));
		row-gap: 5vh;
		column-gap: 2vw; */
		/* height: 100vh; */
		/* overflow: hidden; */
		/* pointer-events: none; */
	}
</style>

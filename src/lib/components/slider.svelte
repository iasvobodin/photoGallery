<script lang="ts">
	import { onMount } from 'svelte';

	let slider,
		animationFrame,
		sliderState = {
			clickDown: <Array<number>>[],
			clickUp: <Array<number>>[],
			translation: 0,
			currentPosition: 0,
			planeCorrection: 0,
			isMouseDown: false,
			startPosition: 0,
			endPosition: 0,
			mousePosition: <Array<number>>[],
			moveSpeed: 3
		},
		isTrackpad = true;
	// $: eventAnimation = false;
	function translateSlider() {
		// curtains.render();

		// if ($eventAnimation) {
		sliderState.translation += (sliderState.currentPosition - sliderState.translation) * 0.05;
		// console.log(sliderState.translation);

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
		sliderState.startPosition = sliderState.clickDown[0];
	}
	// function onChangeTitle() {
	// 	let index = -Math.round(sliderState.currentPosition / (angleStep * 1300)) % $photoseries.length;
	// 	// testId = index >= 1 ? $photoseries.length - index : Math.abs(index);
	// 	titleIndex.set(index >= 1 ? $photoseries.length - index : Math.abs(index));
	// }
	function onMouseMove(e: MouseEvent | TouchEvent) {
		if (!sliderState.isMouseDown) return;
		sliderState.mousePosition = getMousePosition(e);
		sliderState.currentPosition =
			sliderState.endPosition +
			(sliderState.mousePosition[0] - sliderState.startPosition) * sliderState.moveSpeed;
		// onChangeTitle(sliderState.currentPosition, e);
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
			? (sliderState.currentPosition += e.deltaY * -1)
			: (sliderState.currentPosition += delta * -1);
		sliderState.endPosition = sliderState.currentPosition;
		// onChangeTitle(sliderState.currentPosition, e);
		// }
	}
	onMount(() => {
		translateSlider();
	});
</script>

<!-- class:event={!$eventAnimation} -->
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
	<slot />
</div>

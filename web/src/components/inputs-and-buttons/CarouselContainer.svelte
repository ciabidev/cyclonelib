<script lang="ts">
	import CarouselItem from '$components/inputs-and-buttons/CarouselItem.svelte';
	import { onMount } from 'svelte';
	import RightArrow from '~icons/mingcute/right-fill';
	import LeftArrow from '~icons/mingcute/left-fill';
	import type { CarouselItemType } from '$lib/types/carousel';

	let {
		id,
		items,
		onSelect,
		defaultSelected = 0
	}: { id: string; items: CarouselItemType[]; onSelect?: (item: CarouselItemType) => void; defaultSelected?: number } =
		$props();
	let activeItem = $state(defaultSelected);
	let carousel: HTMLElement;

	let showLeftScroll = $state(false);
	let showRightScroll = $state(false);

	onMount(() => {
		updateScrollState();
	});

	// update arrow visibility when scrolling
	const updateScrollState = () => {
		const maxPos = carousel.scrollWidth - carousel.clientWidth;

		showLeftScroll = carousel.scrollLeft > 1;
		showRightScroll = carousel.scrollLeft < maxPos - 1;
	};

	const scroll = (direction: 'left' | 'right') => {
		const currentPos = carousel.scrollLeft;
		const maxPos = carousel.scrollWidth - carousel.clientWidth;
		const step = carousel.querySelector<HTMLElement>('.carousel-item')?.offsetWidth ?? 250;

		const newPos = direction === 'left' ? currentPos - step : currentPos + step;

		carousel.scroll({
			left: newPos,
			behavior: 'smooth'
		});
	};
</script>

<div class="carousel" {id}>
	<div class="carousel-items" bind:this={carousel} onscroll={updateScrollState}>
		{#each items as item, index}
			<CarouselItem
				{item}
				onSelect={() => {
					activeItem = index;
					onSelect?.(item);
				}}
				isActive={index === activeItem}
			/>
		{/each}
	</div>
	<div class="carousel-arrows">
		<button
			class="carousel-arrow-left"
			onclick={() => scroll('left')}
			class:hidden={!showLeftScroll}
			aria-disabled={activeItem === 0}
			aria-label="Previous"
		>
			<LeftArrow class="icon" />
		</button>
		<button
			class="carousel-arrow-right"
			onclick={() => scroll('right')}
			class:hidden={!showRightScroll}
			aria-disabled={activeItem === items.length - 1}
			aria-label="Next"
		>
			<RightArrow class="icon" />
		</button>
	</div>
</div>

<style>
	.carousel {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		position: relative;
		width: 100%;
		/* SO ITEMS DONT GET CUT OFF AT BEGINNING DAMN THIS TOOK LONG */
		justify-content: flex-start;
		/* */
	}

	.carousel-items {
		display: flex;
		flex-direction: row;
		position: relative;
		width: 100%;
		gap: var(--padding);
		/* SO ITEMS DONT GET CUT OFF AT BEGINNING DAMN THIS TOOK LONG */
		padding: 1rem 1.5rem;

		align-items:flex-start;
		justify-content: flex-start;
		/* */
		overflow-x: scroll;
		overflow-y: hidden;
		scroll-padding-left: 6rem;
		scroll-padding-right: 6rem;
		mask-image: linear-gradient(
			/* this confused me so ill explain it */ to right,
			transparent,
			/* start fully invisible */ black 10%,
			/* fade to fully visible by 10px in */ black 90%,
			/* stay visible until 90% across */ transparent /* fade back out toward the end */
		);
	}

	.carousel::-webkit-scrollbar {
		display: none;
	}

	:global(button.carousel-item) {
		background: none;
		border: none;
		padding: 0;
		box-shadow: none;
		color: var(--text-color);
	}

	.carousel-arrows > * {
		position: absolute;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: var(--bg-color);
		border-radius: 50%;
		cursor: pointer;
	}
	.carousel-arrow-left {
		left: 10px;
	}

	.carousel-arrow-right {
		right: 10px;
	}
</style>

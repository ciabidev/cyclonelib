<script lang="ts">
	import type { CarouselItemType } from '$lib/types/carousel';

	let {
		item,
		isActive,
		onSelect,
	}: { item: CarouselItemType; isActive: boolean; onSelect?: (item: CarouselItemType) => void } = $props();

	let thisItem: HTMLElement;

	const scrollToTab = (ele: HTMLElement) => {
		if (ele) {
			console.log('ele exists');
			ele.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center'
			});
		}
	};

	$effect(() => {
		/* scroll to tab whenever the item is active */
		if (isActive) {
			scrollToTab(thisItem);
		}
	});
</script>

<button class="carousel-item" class:active={isActive} bind:this={thisItem} onclick={() => onSelect?.(item)}>
	<div class="title">{item.title}</div>
	<img src={item.image} alt={item.title} />
	{#if item.description}
		<div class="subtext">{item.description}</div>
	{/if}
</button>

<style>

	.carousel-item {
		display: flex;
		flex-direction: column;
		  flex: 0 0 auto;      /* don’t shrink the item completely */

		gap: calc(var(--padding) / 2);
		z-index: 10;
		background: none;
		max-width: 130px;
		color: var(--text-color);
	}

	.carousel-item img {
		width: 100%;
		height: 100%;
		max-width: 130px; /* force exact width */
		max-height: 130px; /* force exact height */
		flex-shrink: 0;
		aspect-ratio: 1/1;
		object-fit: cover;
		border-radius: var(--border-radius);
	}
	.carousel-item.active {
		transform: scale(1.1);
		z-index: 20;
	}

	.carousel-item.active img {
		border: var(--button-stroke) solid 1px;
		box-shadow: var(--button-box-shadow);
	}
</style>

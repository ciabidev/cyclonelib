<script lang="ts">
	import CarouselItem from './CarouselItem.svelte';

	type Item = {
		title: string;
		description: string;
		image: string;
	};
	let { id, items }: { id: string; items: Item[] } = $props();
	let activeItem = $state(0);

	const scrollToTab = (ele: HTMLElement) => {
		if (ele) {
		console.log("ele exists");
		ele.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});
		}
	};

</script>

	<div class="carousel" {id}>
		{#each items as item, index}
			<CarouselItem
				{item}
				isActive={index === activeItem}
				onSelect={() => {
					activeItem = index;
				}}
				{scrollToTab}
			/>
		{/each}
	</div>
<style>

	.carousel {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		position: relative;
		width: 100%;
		height: 500px;
	    overflow-x: scroll;
	    overflow-y: hidden;
		padding: var(--padding);

		will-change: transform, opacity;
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

</style>
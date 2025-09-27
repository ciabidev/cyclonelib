<script lang="ts">
	type Item = {
		title: string;
		description: string;
		image: string;
	};
	let { item, isActive, onSelect, scrollToTab }: { item: Item; isActive: boolean; onSelect: () => void; scrollToTab: (ele: HTMLElement) => void } = $props();
	let buttonElement: HTMLButtonElement;
</script>

<button
	class="carousel-item"
	class:active={isActive}
	bind:this={buttonElement}
	onclick={() => {
		onSelect();
		scrollToTab(buttonElement);
	}}
>
	<div class="carousel-item-text">
		<h3>{item.title}</h3>
		{#if item.description}
			<p>{item.description}</p>
		{/if}
	</div>
	<img src={item.image} alt={item.title} />
</button>

<style>
	.carousel-item {
		display: flex;
		flex-direction: column;

		gap: calc(var(--padding) / 2);
        z-index: 10;
	}

	.carousel-item img {
		min-width: 230px;
		min-height: 230px;
        max-width: 230px;
        max-height: 230px;
		object-fit: cover;
		border-radius: var(--border-radius);
	}

	.carousel-item-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(var(--padding) / 2);
	}


	.carousel-item.active {
		transform: scale(1.3);
        z-index: 20;
	}

	.carousel-item.active img {
		border: var(--button-stroke) solid 1px;
		box-shadow: var(--button-box-shadow);
	}
</style>
<script lang="ts">
	import type { DialogButton } from '$lib/types/dialog';
	import type { DialogPickerItem } from '$lib/types/dialog';

	import DialogContainer from '$components/dialog/DialogContainer.svelte';
	import PickerItem from '$components/dialog/PickerItem.svelte';
	import DialogButtons from './DialogButtons.svelte';

	let {
		id,
		items = undefined,
		buttons = undefined,
		onSelect = undefined,
		dismissable = true
	}: {
		id: string;
		items?: DialogPickerItem[];
		buttons?: DialogButton[];
		onSelect?: (item: DialogPickerItem) => void;
		dismissable?: boolean;
	} = $props();

	let close: () => void = $state(() => {});

</script>

<DialogContainer {id} {dismissable} bind:close>
	<div class="dialog-body picker-dialog" class:three-columns={items && items.length <= 3}>
			<div class="popup-header">
				<div class="popup-title-container">
					<!-- Icon would go here -->
					<h2 class="popup-title">Select Option</h2>
				</div>
				<div class="subtext popup-description">Choose from the available options below</div>
			</div>
			<div class="picker-body">
				{#if items}
					{#each items as item, i}
						{#if item?.url}
							<PickerItem {item} number={i + 1} {onSelect} />
						{/if}
					{/each}
				{/if}
			</div>
			{#if buttons}
				<DialogButtons {buttons} closeFunc={close} dialogId={id} />
			{/if}
		</div>
</DialogContainer>

<style>
	.picker-dialog {
		--picker-item-size: 7.5rem;
		--picker-item-gap: 0.25rem;
		--picker-item-area: calc(var(--picker-item-size) + var(--picker-item-gap));

		gap: var(--padding);
		max-height: calc(90% - env(safe-area-inset-bottom) - env(safe-area-inset-top));
		width: auto;
	}



	.popup-header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1875rem;
		width: 95%;
	}

	.popup-title-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: calc(var(--padding) / 2);
		color: var(--text-color);
	}

	.popup-title {
		font-size: 1.125rem;
		line-height: 1.1;
	}

	.popup-description {
		font-size: 0.8125rem;
		padding: 0;
	}

	.picker-body {
		overflow-y: scroll;
		display: grid;
		justify-items: center;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: var(--picker-item-gap);
	}

	.three-columns .picker-body {
		grid-template-columns: 1fr 1fr 1fr;
	}

	.three-columns .popup-header {
		max-width: calc(var(--picker-item-area) * 3);
	}

	:global(.picker-item) {
		width: var(--picker-item-size);
		height: var(--picker-item-size);
	}

	@media screen and (max-width: 37.5rem) {
		.picker-body {
			grid-template-columns: 1fr 1fr 1fr;
		}

		.popup-header {
			max-width: calc(var(--picker-item-area) * 3);
		}
	}

	@media screen and (max-width: 25.625rem) {
		.picker-dialog {
			--picker-item-size: 7.375rem;
		}
	}

	@media screen and (max-width: 25.3125rem) {
		.picker-dialog {
			--picker-item-size: 7.25rem;
		}
	}

	@media screen and (max-width: 24.875rem) {
		.picker-dialog {
			--picker-item-size: 7.1875rem;
		}
	}

	@media screen and (max-width: 24.25rem) {
		.picker-dialog {
			--picker-item-size: 6.875rem;
		}
	}

	@media screen and (max-width: 23.625rem) {
		.picker-dialog {
			--picker-item-size: 6.5625rem;
		}
	}

	@media screen and (max-width: 22.8125rem) {
		.picker-dialog {
			--picker-item-size: 6.25rem;
		}
	}

	@media screen and (max-width: 22rem) {
		.picker-dialog {
			--picker-item-size: 5.9375rem;
		}
	}

	@media screen and (max-width: 20.875rem) {
		.picker-dialog {
			--picker-item-size: 8.125rem;
		}

		.picker-body,
		.three-columns .picker-body {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media screen and (max-width: 18.75rem) {
		.picker-dialog {
			--picker-item-size: 7.5rem;
		}
	}

	@media screen and (max-width: 17.5rem) {
		.picker-dialog {
			--picker-item-size: 6.875rem;
		}
	}

	@media screen and (max-width: 15.9375rem) {
		.picker-dialog {
			--picker-item-size: 8.75rem;
		}

		.picker-body,
		.three-columns .picker-body {
			grid-template-columns: 1fr;
		}
	}
</style>

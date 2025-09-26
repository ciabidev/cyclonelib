<script lang="ts">
    import type { Flavor } from "$lib/types/flavor";
	import { createDialog } from "$lib/state/dialogs";
	import { flavor } from "$lib/state/flavors";
</script>

<button class="flavor-picker-button" onclick={() => createDialog({
				id: 'flavor-picker-dialog',
				type: 'picker',
				items: [
					{ type: 'photo', url: '/emotions/surprised.png', text: 'rain' },
					{ type: 'photo', url: '/emotions/surprised.png', text: 'desert-oasis'}
				],
				onSelect: (item) => {
					createDialog({
						id: 'selected-item',
						type: 'small',
						title: item.text,
						bodyText: '',
						buttons: [
							{
								text: 'continue',
								main: true,
								action: () => {}
							}
						]
					});
				}
})}>🍨</button>

<style>
.flavor-picker-button {
	color: white;
	background: none;
}

.flavor-picker-button:hover {
	background: none;
}
</style>
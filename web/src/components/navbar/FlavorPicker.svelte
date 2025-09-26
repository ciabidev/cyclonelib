<script lang="ts">
    import type { Flavor } from "$lib/types/flavor";
	import { createDialog, killDialog } from "$lib/state/dialogs";
	import { flavor } from "$lib/state/flavors";
	
</script>

<button class="flavor-picker-button" onclick={() => createDialog({
	
				id: 'flavor-picker-dialog',
				type: 'picker',
				items: [
					{ type: 'photo', url: 'https://i.pinimg.com/736x/37/c5/df/37c5dffd7ea7b2cdf169bf5e7ed6128d.jpg', text: 'rain' },
					{ type: 'photo', url: 'https://i.pinimg.com/736x/de/c7/85/dec785b10068f4f95ad4a30de0a78fbd.jpg', text: 'desert-oasis'}
				],
				onSelect: (item) => {
					if (item.text) {
						flavor.set(item.text);
						killDialog();
					}
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
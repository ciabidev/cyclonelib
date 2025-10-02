<script lang="ts">
	import { flavor } from '$lib/state/flavors';
	import { flavorPickerVisible } from "$lib/state/flavor-picker-visibility";
	import IceCream from '~icons/fluent-emoji-flat/ice-cream';</script>

<button id="flavor-picker-button" onclick={() => $flavorPickerVisible = !$flavorPickerVisible}>
	
<div class="icon-holder">
	<IceCream />
</div>
</button>

<style>
 #flavor-picker-button {
	pointer-events: all;
	background: var(--bg-color);
	padding: 7px;
	border-radius: 30px;
	filter: drop-shadow(0 0 3px var(--button-stroke));

	transition:
		background-color 0.2s,
		transform 0.2s;

	will-change: transform, background-color;
    }

	#flavor-picker-button:hover {
		transform: scale(1.1);
	}
	#flavor-picker-button:active {
		transform: scale(0.9);
	}
	.icon-holder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 25px;
		height: 25px;
		background: var(--sub-alt-color);
		border-radius: 50%;
		transition: all 0.2s;
		will-change: transform, background-color;
		pointer-events: all;
	}
</style>
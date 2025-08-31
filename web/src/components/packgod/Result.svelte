<script>
	import { packgod } from '$lib/shared.svelte.js'

	
</script>

<div class="result-wrapper">
	<div class="result" 
	>{packgod.resultText}</div>
</div>

<style>
	.result-wrapper {
		height: 200px;
		width: 100%;
		box-shadow: var(--button-stroke) 0 0 0 1.5px;
    	border-radius: var(--border-radius);
	}

	.result {
		font-size: 16px;
		border: none;
		overflow: auto;
		width: 100%;
		height: 100%;
		background: none;
		outline: none;
		resize: none;
		padding: 30px;
	}
</style>

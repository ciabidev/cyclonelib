<script>
	/** @type {string} */
	export let label = '';
	/** @type {string} */
	export let id = '';
	/** @type {string} */
	export let hint = '';
	/** @type {boolean} */
	export let long = false;
</script>

<div class="field">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	{#if hint}
		<p class="hint">{hint}</p>
	{/if}
	<div class="input-wrapper" class:long>
		<slot />
	</div>
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: bold;
	}

	.hint {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text-secondary, #666);
	}

	.input-wrapper {
		width: 100%;
	}

	.input-wrapper.long {
		min-height: 100px;
	}
</style>
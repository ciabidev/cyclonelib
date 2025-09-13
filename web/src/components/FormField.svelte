<script>
	/** @type {string} */
	export let label = '';
	/** @type {string} */
	export let id = '';
	/** @type {string} */
	export let hint = '';
	/** @type {boolean} */
	export let long = false;
	/** @type {boolean} */
	export let required = false;
	/** @type {string} */
	export let value = '';
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
	{#if required && !value.trim()}
		<small class="required-text">Required</small>
	{/if}
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

	.required-text {
		color: red;
		font-size: 0.8rem;
		margin-top: 0.25rem;
	}
</style>
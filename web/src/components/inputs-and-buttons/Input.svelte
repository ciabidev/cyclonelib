<script>
	let isFocused = $state(false);
	let { placeholder, value = $bindable(''), description = null, Icon = null, width = '100%', min_width='100%', id = null, type = 'text', long = false } = $props();
</script>

<div class="input-wrapper" class:focused={isFocused} style="--width: {width}; --min-width: {min_width}">
	{#if Icon}
		<div class="icon">
			<Icon />
		</div>
	{/if}
	{#if long}
		<textarea
			bind:value
			class="input"
			oninput={() => (isFocused = true)}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			{placeholder}
			{id}
			rows="4"
		></textarea>
	{:else}
		<input
			bind:value
			class="input"
			oninput={() => (isFocused = true)}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			{placeholder}
			{id}
			{type}
		/>
	{/if}

</div>
	{#if description}
		<div class="subtext">{description}</div>
	{/if}
<style>
	.input-wrapper {
		border: var(--popup-stroke) 2px solid;
		border-radius: var(--border-radius);
		width: var(--width);
		min-width: var(--min-width);
		max-height: fit-content;
		display: flex;
		flex-direction: row;
		gap: 5px;
		padding: 13px 15px;
		align-items: center;
		transition: all 300ms cubic-bezier(1, 0, 0, 1);
	}

	.input-wrapper.focused {
		border: var(--text-color) 2px solid;
	}

	.input {
		font-size: 14px;
		width: 100%;
		border: none;
		overflow: auto;
		background: none;
		outline: none;
		resize: none;
		color: var(--text-color);
	}

	@media (pointer: none), (pointer: coarse) {
		.input {
			font-size: 16px;
		}
		input:focus {
			font-size: 16px;
		}
	}

	.icon {
		opacity: 0.5;
		transition: all 300ms cubic-bezier(1, 0, 0, 1);
	}

	.input-wrapper.focused > .icon {
		opacity: 1;
	}
</style>

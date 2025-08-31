<script>
	let { Icon = null, content, href = null, onclick = null, variant = "default" } = $props();
</script>

{#if variant}
	{#if href}
		<a class="button button--{variant}" {href}>
			{#if Icon}<Icon class="icon" style="flex-shrink: 0; font-size: 20px" />{/if}
			{content}
		</a>
	{:else}
		<button class="button button--{variant}" {onclick}>
			{#if Icon}<Icon class="icon" style="flex-shrink: 0; font-size: 20px" />{/if}
			{content}
		</button>
	{/if}
{/if}

<style>
	.button {
		align-items: center;
		display: flex;
		flex-direction: row;
		gap: 5px;
		justify-content: center;
		padding: 8px 18px;
		border-radius: var(--border-radius);
		border: none;
		margin: 0;
		width: auto;
		overflow: visible;
		color: inherit;
		font: inherit;
		line-height: normal;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		/* background: var(--color-allgood); */
		box-shadow: var(--button-box-shadow);
		background: var(--button);
		width: fit-content;
		transition: background 200ms ease-out;
	}

	.button:hover {
		background: var(--button-hover);
	}

	a {text-decoration: none}


	.button--primary {
		background: var(--main-color);
		color: white;
	}

	@media not all and (hover: none) {
		.button--primary:hover {
			background: var(--dark-main-color);
		}
	}

	.button--success {
		background: var(--color-allgood);
		color: white;
	}

	@media not all and (hover: none) {
		.button--success:hover {
			background: var(--dark-color-allgood);
		}
	}

	.button--danger {
		background: var(--color-error);
		color: white;
	}

	@media not all and (hover: none) {
		.button--danger:hover {
			background: var(--dark-color-error);
		}
	}
</style>

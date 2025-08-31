<script>
	let { Icon, content, href, onclick } = $props();
</script>

<button class="button" {onclick}>
	<Icon class="icon" style="flex-shrink: 0; font-size: 20px" />
	{content}
</button>

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
		transition: all 300ms cubic-bezier(1, 0, 0, 1);
	}

	@media not all and (hover: none) {
		.button:hover {
			/* background: var(--button-inverted);
			color: var(--button-color-inverted); */
			background: var(--button-hover);
		}
	}
</style>

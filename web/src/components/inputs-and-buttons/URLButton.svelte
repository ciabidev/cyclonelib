<script>
	let { url, urlshort, name, img } = $props();
    import LinkIcon from '~icons/tabler/external-link'; 
</script>

<a class="url-button" target="_blank" href={url}>
	{#if img}
		<img src={img} alt={name} class="url-icon icon" />
	{/if}
	<div class="url-text">
		<div class="url-name">{name}</div>
		<span class="url-short small-text" data-sveltekit-replacestate
			><LinkIcon
				style="min-width: 1rem; min-height: 1rem; flex-shrink: 0;"
				class="icon"
			/>{urlshort}</span
		>
	</div>
</a>

<style>
	.url-text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-decoration: none;
		color: var(--text-color);
		position: relative;
        text-decoration: none;
	}

	.url-name {
		display: flex;
        text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.url-short {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 0.9rem;
		gap: 5px;
        text-decoration: underline;
	}

	.url-icon {
		width: 3rem;
		height: 3rem;
		border-radius: 12px;
	}
</style>

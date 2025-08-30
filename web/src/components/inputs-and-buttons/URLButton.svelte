<script>
	let { url, urlshort, name, img } = $props();
    import LinkIcon from '~icons/tabler/external-link'; 
</script>

<a class="url-button" target="_blank" href={url}>
	<img src={img} alt={name} class="url-icon icon" />
	<div class="url-text">
		<div class="url-name">{name}</div>
		<span class="url-short sub-text" data-sveltekit-replacestate
			><LinkIcon
				style="min-width: 1rem; min-height: 1rem; flex-shrink: 0;"
				class="icon"
			/>{urlshort}</span
		>
	</div>
</a>

<style>
	.url-button {
		 user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none;      /* old IE */
		flex-shrink: 0;
		display: flex;
		min-width: fit-content;
		flex-basis: content;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		position: relative;
		border-radius: var(--border-radius);
		padding: 7px 9px;
		width: max-content;
        text-decoration: none;
	}

	.url-button:hover {
		background: var(--hover-bg);
		filter: brightness(1.1);
	}

    
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

	a {
		cursor: pointer;
	}
</style>

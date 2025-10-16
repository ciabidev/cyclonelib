<script>
	import { onMount } from 'svelte';
	import { highlightCode } from '$lib/state/shiki';
	let copyText = 'Copy';

	export let code = "";
	export let language = "plaintext";
	export let filename = "code";
	let higlighted = '';
	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copyText = 'Copied!';
			setTimeout(() => (copyText = 'Copy'), 2000);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}


	async function highlight() {
		if (!code) return;
		higlighted = await highlightCode(code, language);
	}
	// Delay highlighting to avoid interfering with page loading animations
	onMount(() => {
		highlight();
	});
</script>

<div class="block">
	<div class="header">
		<div class="filename">{filename}</div>
		<button class="copy-btn" onclick={copyCode}>
			<span class="icon">📋</span>
			{copyText}
		</button>
	</div>
	{@html higlighted}
</div>

<style>
	.block {
		max-width: 100%;
		background-color: var(--code-bg);
		border-radius: .5rem;
		padding-left: .5rem;
		padding-right: .5rem;
		padding-top: .6rem;
		padding-bottom: .3rem;
		-webkit-border-radius: .5rem;
		-moz-border-radius: .5rem;
		-ms-border-radius: .5rem;
		-o-border-radius: .5rem;
		position: relative;
		border: 1px inset solid var(--code-stroke);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: .5rem;
	}

	.copy-btn {
		background-color: var(--code-bg);
		color: #fff;
		border: none;
		border-radius: var(--border-radius);
		padding: .25rem .5rem;
		border: 1px solid var(--code-stroke);
		font-size: .9rem;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		gap: .25rem;
		z-index: 2;
	}

	.icon {
		font-size: 1rem;
	}

	.copy-btn:hover {
		filter: brightness(1.25);
	}

	.filename {
		font-family: monospace;
		font-size: .9rem;
		flex: 1;
		color: #fff;
	}

	/* Override Shiki's background to match component */
	:global(.shiki) {
		background: var(--code-bg) !important;
		margin: 0;
		padding: .3rem 0;
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--code-scrollbar) var(--code-bg);
	}

	:global(.shiki code) {
		background: transparent !important;
		padding: 0;
		border-radius: 0;
		font-family: inherit;
		font-size: inherit;
	}
</style>

<!-- the basic page container used by most pages. Not all pages will have pading or be centered, which is why we cant just apply this to #loaf -->

<script>
	/** @type {string} */
	export let containerId = '';
	/** @type {string} */
	export let pageId = '';
	/** @type {string} */
	export let maxWidth = '700px';
</script>

<div id={containerId} class="page-container">
	<main id={pageId} class="page-main" style="--max-width: {maxWidth}">
		<slot />
	</main>
</div>

<style>
	.page-container {
		width: 100%;
		display: flex;
		justify-content: center;
		min-height: 100%;
		overscroll-behavior: none;
		padding: var(--padding);
	}

	.page-main {
		width: 100%;
		max-width: var(--max-width);
		gap: 20px;
		display: flex;
		flex-direction: column;
	}

	@media only screen and (max-height: 400px) {
		.page-container {
			justify-content: center;
			align-items: center;
			height: max-content;
		}
	}
</style>
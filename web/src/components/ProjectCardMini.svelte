<script>
	let { urlshort, url, name, description, img } = $props();
	// @ts-ignore
	import URLButton from './inputs-and-buttons/URLButton.svelte';
</script>

<div class="card">
	<URLButton {url} {urlshort} {name} {img} />
	<div class="contents">
		<div class="sub-text description">
			{description}
		</div>
	</div>
</div>

<style>
	/* i know all these random flex styles are a bandaid solution but for some reason items just wouldn't stay in the flexbox so i had to use this */

	.card {
		border-radius: var(--border-radius);
		box-shadow: var(--card-box-shadow);
		filter: drop-shadow(0 0 8px var(--card-stroke)) drop-shadow(0 0 10px var(--card-stroke));
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		position: relative;
		padding: 12px 22px 22px 12px;
		align-items: flex-start;
		flex-shrink: 0;
		min-height: 250px;
		transition: 0.3s var(--actions-and-stuff-ahh-transition);
		max-width: 500px;
	}



  .contents {
    padding-left: 10px;
  }

	.description {
		font-size: 0.9rem;
	}

	/* @media only screen and (max-width: 600px) {
     .card {
      width: 100%;
      padding: 14px 18px 18px 6px;
  }
  } */
</style>

<script>
	let {
		url,
		urlshort,
		name,
		description,
		img = null,
		banner = null,
		tiny = null,
	} = $props();
	
	// @ts-ignore
	import URLButton from '$components/inputs-and-buttons/URLButton.svelte';
</script>

<div class="card-wrapper">
	<div class="card">
		{#if banner}
			<div class="banner-container" style="--banner-url: url({banner})"></div>
		{/if}
		<div class="card-content">
			{#if url}
			<URLButton {url} {urlshort} {name} {img} />
			{/if}
			<div class="card-text">
				<h2 class="project-name">{name}</h2>
				<div class="subtext">{tiny}</div>
				<div class="project-description">{description}</div>
			</div>
		</div>
	</div>
	<!-- render any slotted content-->
	<slot></slot>
</div>

<style>
	/* i know all these random flex styles are a bandaid solution but for some reason items just wouldn't stay in the flexbox so i had to use this */
	.card-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.project-description {
		font-size: 0.9375rem;
	}
	.card {
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		position: relative;
		align-items: flex-start;
		min-width: fit-content;
		transition: all 0.3s var(--actions-and-stuff-ahh-transition);
		border: 0.0938rem inset var(--popup-stroke);
		background: var(--bg-color);
		box-shadow: var(--button-box-shadow);
	}

	.card-content {
		padding-left: 0.75rem;
		padding-right: 1.375rem; /* the right side should match the TOTAL of the left side */
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-text {
		padding-left: 0.625rem; /* to align with the URL Button */
		flex: 1;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		position: relative;
	}

	.banner-container {
		width: 100%;
		height: 9.375rem;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		background-image: var(--banner-url);
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
	}

	.tiny {
		font-size: 0.75rem;
	}

	/* @media only screen and (max-width: 37.5rem) {
     .card {
      width: 100%;
      padding: 0.875rem 1.125rem 1.125rem 0.375rem;
  }
  } */
</style>

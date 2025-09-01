<script>
	let { url, urlshort, name, description, img = null, banner = null, tiny = null, rhid = null } = $props();
	// @ts-ignore
	import LinkIcon from '~icons/tabler/external-link';
	import URLButton from './inputs-and-buttons/URLButton.svelte';
</script>

<div class="card-wrapper">
<div class="card">
	{#if banner}
		<div class="banner-container" style="--banner-url: url({banner})"></div>
	{/if}
	<div class="card-content">
		<URLButton {url} {urlshort} {name} {img} />
		<div class="card-text">
			<h2 class="project-name">{name}</h2>
			<div class="sub-text tiny">{tiny}</div>
			<div class="sub-text description">{description}</div>
		</div>
	</div>
</div>
{#if rhid}
<a class="button" href="/packages/{rhid}">View Package </a>
{/if}
</div>
<style>
	/* i know all these random flex styles are a bandaid solution but for some reason items just wouldn't stay in the flexbox so i had to use this */
	.card-wrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.card {
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		position: relative;
		align-items: flex-start;
		min-height: 250px;
		transition: all 0.3s var(--actions-and-stuff-ahh-transition);
		max-width: 500px;
		overflow: hidden;
		box-shadow: var(--card-box-shadow);
		filter: drop-shadow(0 0 8px var(--card-stroke)) drop-shadow(0 0 10px var(--card-stroke));
	}

	.card-content {
		padding-left: 12px;
		padding-right: 22px; /* the right side should match the TOTAL of the left side */
		padding-top: 12px;
		padding-bottom: 12px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
	}

	.card-text {
		padding-left: 10px; /* to align with the URL Button */
		flex: 1;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		position: relative;
		gap: 0.5rem;
	}

	.banner-container {
		width: 100%;
		height: 150px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		background-image: var(--banner-url);
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
	}

	.project-name {
		display: flex;
		font-weight: 600;
	}
	.tiny {
		font-size: 0.8rem;
	}
	.description {
		font-size: 1rem;
	}

	/* @media only screen and (max-width: 600px) {
     .card {
      width: 100%;
      padding: 14px 18px 18px 6px;
  }
  } */
</style>

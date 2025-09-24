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
	import LinkIcon from '~icons/tabler/external-link';
	import URLButton from './inputs-and-buttons/URLButton.svelte';
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
				<div class="small-text tiny">{tiny}</div>
				<div class="small-text description paragraph-text">{description}</div>
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
		gap: 12px;
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
		border: 1px inset var(--popup-stroke);
		background: var(--bg-color);
		box-shadow: var(--shadow-main);
	}

	.card-content {
		padding-left: 12px;
		padding-right: 22px; /* the right side should match the TOTAL of the left side */
		padding-top: 12px;
		padding-bottom: 12px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-text {
		padding-left: 10px; /* to align with the URL Button */
		flex: 1;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		position: relative;
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

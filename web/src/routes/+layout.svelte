<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import LoveNote from '$components/LoveNote.svelte';
	import Navbar from '$components/navbar/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import Toasts from '$components/toasts/Toasts.svelte';
	import DialogHolder from '$components/dialog/DialogHolder.svelte';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();

</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
	<link rel="shortcut icon" href="/favicon/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="ciabi" />
	<link rel="manifest" href="/favicon/site.webmanifest" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
	/>
</svelte:head>

<Toasts />
<DialogHolder />
<div id="basket">
	<!-- acts as a "body" tag that we have more control over. Example: when a mobile user reaches end of scroll. then the page starts scrolling to make typing and scrolling easier -->

	<div id="loaf">
		<!-- includes main content of the page only -->
		{@render children()}
	</div>

	<Navbar />
</div>

<style>
	#loaf {
		/* content of the page */
		/*border: solid red .3125rem;
   */

		overflow-y: auto;
		width: 100%;
		background-color: var(--bg-color);
		border-bottom-left-radius: calc(var(--border-radius) * 2);
		border-bottom-right-radius: calc(var(--border-radius) * 2);
		height: calc(100% - var(--navbar-height));
	}

	#basket {
		height: 100%;
		width: 100%;
		overscroll-behavior-y: none;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
	}
</style>

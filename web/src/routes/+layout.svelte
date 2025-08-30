<svelte:head>
<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
<link rel="shortcut icon" href="/favicon/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="wheat" />
<link rel="manifest" href="/favicon/site.webmanifest" />
</svelte:head>

<script lang="ts">
  import type { LayoutData } from "./$types";
	import type { Snippet } from "svelte";
  let { data, children }: { data: LayoutData; children: Snippet } = $props();
  
</script>


<div class="container">
  {@render children()}
</div>


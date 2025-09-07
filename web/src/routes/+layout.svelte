<svelte:head>
    <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
<link rel="shortcut icon" href="/favicon/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="ciabi" />
<link rel="manifest" href="/favicon/site.webmanifest" />
</svelte:head>

<script lang="ts">
  import "../app.css";
  import type { LayoutData } from "./$types";
  import LoveNote from "$components/LoveNote.svelte";
  import Navbar from "$components/navbar/Navbar.svelte";
  	import type { Snippet } from "svelte";
  import Toasts from "$components/toasts/Toasts.svelte";
  import DialogHolder from "$components/dialog/DialogHolder.svelte";
  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

  <Navbar />

  <Toasts />
  <DialogHolder />
  <div class="loaf"> <!-- includes main content of the page only -->
    {@render children()}
    
  </div>




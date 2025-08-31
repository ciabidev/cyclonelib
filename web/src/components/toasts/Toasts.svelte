<script lang="ts">
	import ToastItem from "./ToastItem.svelte";
	import { toasts } from '$lib/toasts/toasts.svelte.js'

    let toaster!: HTMLElement
    let loaded = $state(false)

    function onload() {
        loaded = true
        console.log(loaded);
    }
</script>

<div class="toaster" class:loaded={loaded} onload={onload}>
    {#each toasts as toastItem}
    <ToastItem content={toastItem.content} />
    {/each}
</div>

<style>
    .toaster {
        padding-top: 15px;
        gap: 10px;
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
		transition: height 0.2s var(--actions-and-stuff-ahh-transition);
    }
    .toaster, .toaster > * {
        z-index: 3000;
         user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
    }
</style>
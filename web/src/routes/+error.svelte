<script>
    import { page } from '$app/state';
    import Emotion from '$components/misc/Emotion.svelte';
</script>

{#if page.status === 404}
    <div class="error">
        <Emotion emotion="confused" size="large" />
        <h1>where am i</h1>
        <span class="giantahhparagraph">404 - page not found</span>
    </div>
{:else}
    <div class="error">
        <h1>error {page.status}</h1>
        <span class="giantahhparagraph">{page.error?.message || 'unknown error'}</span>
    </div>
{/if}

<style>
    .error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
</style>
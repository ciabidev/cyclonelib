<script>
    import { page } from '$app/state';
    import Emotion from '$components/misc/Emoticon.svelte';
</script>

<!-- emotions: confused" | "unamused" | "happy" | "awkward" | "surprised" | "sad" | "angry" -->
{#if page.status === 404}
    <div class="error">
        <Emotion emotion="confused" size="large" />
        <h1>where am i</h1>
        <span class="giantahhparagraph">{page.error?.message || '404 - page not found'}</span>
    </div>
{:else}
    <div class="error">
        <Emotion emotion="awkward" size="large" />
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
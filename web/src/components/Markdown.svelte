<script>
    import { marked } from 'marked';
    let { source } = $props();
    const html = marked.parse(source);
    console.log(html);
</script>

<div class="markdown">
    {@html html}
</div>

<style>
    .markdown {
        flex-direction: column;
        display: flex;
        max-width: 100%;
        gap: 0.85rem;
    }
</style>
<script>
    let { code, language, filename = undefined } = $props();
    let copyText = $state('Copy');

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(code);
            copyText = 'Copied!';
            setTimeout(() => copyText = 'Copy', 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
</script>

<div class="block">
    {#if filename}
        <div class="header">
            <div class="filename">{filename}</div>
            <button class="copy-btn" onclick={copyCode}>
                <span class="icon">📋</span>
                {copyText}
            </button>
        </div>
    {:else}
        <button class="copy-btn absolute" onclick={copyCode}>
            <span class="icon">📋</span>
            {copyText}
        </button>
    {/if}
    <pre><code class="language-{language}">{code}</code></pre>
</div>

<style>

    pre {
        white-space: pre;
        overflow-x: auto;
        max-width: 100%;
        scrollbar-width: thin;
        padding-bottom: 0.3rem;
        scrollbar-color: var(--code-scrollbar) var(--code-bg);
    }

    .block {
        max-width: 100%;
        background-color: var(--code-bg);
        border-radius: 0.5rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        padding-top: 0.6rem;
        padding-bottom: 0.3rem;
        -webkit-border-radius: 0.5rem;
        -moz-border-radius: 0.5rem;
        -ms-border-radius: 0.5rem;
        -o-border-radius: 0.5rem;
        position: relative;
        border: 1px inset solid var(--code-border);

    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        background-color: var(--code-scrollbar)

    }

    .copy-btn {
        background-color: var(--code-bg);
        color: #fff;
        border: none;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        border: 1px solid var(--code-border);
        font-size: 0.9rem;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .copy-btn.absolute {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        margin-left: 0;
    }

    .icon {
        font-size: 1rem;
    }

    .copy-btn:hover {
        filter: brightness(1.25);
    }

    .filename {
        font-family: monospace;
        font-size: 0.9rem;
        flex: 1;
    }


</style>

import { writable, get } from "svelte/store";

type HighlightedCode = {    
    code: string;
    language: string;
    highlightedCode: string;
};

export const highlighterInstance = writable<any>(null);
export const highlightedCache = writable<HighlightedCode[]>([]);

async function initHighlighter() {
    // Move dynamic import here
    const { createHighlighter } = await import('shiki/dist/bundle-web.mjs');
    const highlighter = await createHighlighter({
        themes: ['dark-plus'],
        langs: ['python', 'javascript', 'html', 'css', 'json', 'plaintext', 'markdown', 'svelte', 'typescript'],
    });
    highlighterInstance.set(highlighter);
}

initHighlighter();

export const highlightCode = async (code: string, language: string) => {
    let highlighter = get(highlighterInstance);
    if (!highlighter) {
        await initHighlighter();
        highlighter = get(highlighterInstance);
    }

    // check cache
    const cache = get(highlightedCache);
    const cachedCode = cache.find(item => item.code === code && item.language === language);
    if (cachedCode) {
        return cachedCode.highlightedCode;
    }

    try {
        const highlightedCode = await highlighter.codeToHtml(code, { lang: language, theme: 'dark-plus' });
        // Update cache
        highlightedCache.update(arr => [...arr, { code, language, highlightedCode }]);
        return highlightedCode;
    } catch (error: any) {
        return `Error highlighting code: ${error.message}\n\n<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    }
};
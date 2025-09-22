<script lang="ts">
    import type { Emotions } from "$lib/types/emoticon";
	import { on } from "events";
    
    type Props = {
        emotion: Emotions;
        size?: "small" | "medium" | "large";
    }

    const { emotion, size = "medium" }: Props = $props();

    let loaded = $state(false)
</script>

<img
    class="emotion {emotion}"
    src="/emotions/{emotion}.png"
    onload={() => loaded = true}
    alt={emotion}
    aria-hidden="true"
    class:small={size === "small"}
    class:medium={size === "medium"}
    class:large={size === "large"}
/>

<style>
    .emotion {
        width: 1em;
        height: 1em;
        border-radius: var(--border-radius); 
    }

    .emotion.small {
        width: 4rem;
        height: 4rem;
    }

    .emotion.medium {
        width: 8rem;
        height: 8rem;
    }

    .emotion.large {
        width: 15rem;
        height: 15rem;
    }
</style>
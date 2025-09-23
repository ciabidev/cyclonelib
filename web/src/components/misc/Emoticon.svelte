<script lang="ts">
    import type { Emotion } from "$lib/types/emoticon";

    type Props = {
        emotion: Emotion;
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
        width: 8rem;
        height: 8rem;
    }

    .emotion.medium {
        width: 12rem;
        height: 12rem;
    }

    .emotion.large {
        width: 16rem;
        height: 16rem;
    }
</style>
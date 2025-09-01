<script lang="ts">
    import type { DialogPickerItem } from "$lib/types/dialog";

    type Props = {
        item: DialogPickerItem;
        number: number;
    };

    const { item, number }: Props = $props();

    const itemType = $derived(item.type ?? "photo");

    let imageLoaded = $state(false);

    let validUrl = false;
    try {
        new URL(item.url);
        validUrl = true;
    } catch {}

    const loaded = () => {
        imageLoaded = true;
    }
</script>

<button
    class="picker-item"
    onclick={() => {
        if (validUrl) {
            // Handle download here
            console.log('Download:', item.url);
        }
    }}
>
    <div class="picker-type">
        {#if itemType === "video"}
            🎥
        {:else if itemType === "gif"}
            🎞️
        {:else}
            📷
        {/if}
    </div>

    <img
        class="picker-image"
        src={item.thumb ?? item.url}
        class:loading={!imageLoaded}
        class:video-thumbnail={["video", "gif"].includes(itemType)}
        onload={loaded}
        alt="{itemType} {number}"
    />
    {#if !imageLoaded}
        <div class="skeleton"></div>
    {/if}
</button>

<style>
    .picker-item {
        position: relative;
        background: none;
        padding: 0;
        box-shadow: none;
        border-radius: calc(var(--border-radius) / 2 + 2px);
    }

    .picker-item:focus-visible::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        outline: 2px solid var(--main-color);
        outline-offset: 2px;
        border-radius: inherit;
    }

    .picker-image {
        width: 100%;
        height: 100%;

        aspect-ratio: 1/1;
        pointer-events: all;

        object-fit: cover;
        border-radius: inherit;

        position: absolute;
        z-index: 2;

        opacity: 1;
        transition: opacity 0.2s;
    }

    .skeleton {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        background: var(--button);
        border-radius: inherit;
    }

    .picker-image.loading {
        opacity: 0;
    }

    .picker-image.video-thumbnail {
        pointer-events: none;
    }

    .picker-item:active .picker-image {
        opacity: 0.75;
    }

    @media (hover: hover) {
        .picker-item:hover:not(:active) .picker-image {
            opacity: 0.8;
        }
    }

    .picker-type {
        position: absolute;
        color: var(--white);
        background: rgba(0, 0, 0, 0.5);
        width: 24px;
        height: 24px;
        z-index: 3;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        top: 6px;
        left: 6px;

        border-radius: 6px;

        pointer-events: none;
        font-size: 12px;
    }
</style>
<script lang="ts">
    import type { DialogPickerItem } from "$lib/types/dialog";

    type Props = {
        item: DialogPickerItem;
        number: number;
        onSelect?: (item: DialogPickerItem) => void;
    };

    const { item, number, onSelect }: Props = $props();

    const itemType = $derived(item.type ?? "photo");

    let imageLoaded = $state(false);

    let validUrl = false;
    try {
        if (item.url) {
            new URL(item.url);
            validUrl = true;
        }
    } catch {}

    const loaded = () => {
        imageLoaded = true;
    }
</script>

<button
    class="picker-item"
    onclick={() => {
        if (onSelect) {
            onSelect(item);
        } else if (validUrl) {
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
    {#if item.text}
    <div class="picker-text absolute">
        {item.text}
    </div>
    {/if}
    {#if !imageLoaded}
        <div class="skeleton"></div>
    {/if}
</button>

<style>
    .picker-item {
        position: relative;
        background: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        box-shadow: none;
        border-radius: calc(var(--border-radius) / 2 + 0.125rem);
        overflow: hidden;
    }

    .picker-item:focus-visible::after {
        content: "";
        width: 100%;
        height: 100%;
        outline: 0.125rem solid var(--main-color);
        outline-offset: 0.125rem;
        border-radius: inherit;
    }

    .picker-image {
        width: 100%;
        height: 100%;

        aspect-ratio: 1/1;
        pointer-events: all;

        object-fit: cover;
        border-radius: inherit;
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
        width: 1.5rem;
        height: 1.5rem;
        z-index: 3;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        top: 0.375rem;
        left: 0.375rem;

        border-radius: 0.375rem;

        pointer-events: none;
        font-size: 0.75rem;
    }

    .picker-text {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        color: var(--white);
        padding: 0.25rem 0.375rem;
        font-size: 0.75rem;
        text-align: center;
        z-index: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
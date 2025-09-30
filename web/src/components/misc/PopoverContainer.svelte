<script lang="ts">
    import { flavorPickerVisible } from "$lib/state/flavor-picker-visibility";
    let { expanded, id, title, description }: { expanded: boolean; id: string; title?: string; description?: string } = $props();
</script>

<div id={id + "-popover"} class="popover-container" aria-hidden={!expanded} class:expanded>
    <div id={id + "-header"} class="popover-header">
        {#if title}
            <h3>{title}</h3>
        {/if}
        {#if description}
            <div class="popover-description">{description}</div>
        {/if}
    </div>
    <slot></slot>
    
</div>

<style>
    

    .popover-header {
        display: flex;
        flex-direction: column;
        gap: calc(var(--padding) / 2);
    }

    .popover-container {
        padding: var(--padding);
        background: var(--popover-bg);
        border-radius: calc(var(--border-radius) * 2);
        border: var(--button-stroke) solid 1px;
        display: flex;
        flex-direction: column;
        border-radius: 18px;
        filter: drop-shadow(0 0 8px var(--popover-glow))
            drop-shadow(0 0 10px var(--popover-glow));
        position: relative;
        gap: 6px;
        top: 6px;
        z-index: 10;
        opacity: 0;
        transform: scale(0);
        transform-origin: top right;
        transition:
            transform 0.3s cubic-bezier(0.53, 0.05, 0.23, 1.15),
            opacity 0.25s cubic-bezier(0.53, 0.05, 0.23, 0.99);

        will-change: transform, opacity;

        pointer-events: all;
        width: 100%;
    }

    .popover-container.expanded {
        opacity: 1;
        transform: scale(1);
    }
</style>
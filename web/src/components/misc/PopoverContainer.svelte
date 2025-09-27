<script>
    import { flavorPickerVisible } from "$lib/state/flavor-picker-visibility";
    let { expanded, id } = $props();
</script>

<div {id} class="popover-container" aria-hidden={!expanded} class:expanded>
    <slot></slot>
    
</div>

<style>
    .popover-container {
        padding: 0;
        padding-bottom: 0;
        background: var(--bg-color);
        border-radius: calc(var(--border-radius) * 2);
        box-shadow: var(--button-box-shadow);
        display: flex;
        flex-direction: column;
        border-radius: 18px;
        filter: drop-shadow(0 0 8px var(--popover-glow))
            drop-shadow(0 0 10px var(--popover-glow));
        position: relative;
        padding: var(--padding);
        gap: 6px;
        top: 6px;
        z-index: 2;

        opacity: 0;
        transform: scale(0);
        transform-origin: top right;
        transition:
            transform 0.3s cubic-bezier(0.53, 0.05, 0.23, 1.15),
            opacity 0.25s cubic-bezier(0.53, 0.05, 0.23, 0.99);

        will-change: transform, opacity;

        pointer-events: all;
    }

    .popover-container.expanded {
        opacity: 1;
        transform: scale(1);
    }
</style>
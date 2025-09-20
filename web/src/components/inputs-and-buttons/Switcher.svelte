<script lang="ts">
    export let full: boolean = false;
    export let description: string = "";
</script>

<div class="switcher-parent">
    <div class="switcher" class:full={full}>
        <slot></slot>
    </div>
    {#if description}
        <div class="subtext">{description}</div>
    {/if}
</div>

<style>
    .switcher-parent {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .switcher {
        display: flex;
        width: auto;
        flex-direction: row;
        flex-wrap: nowrap;
        scrollbar-width: none;
        overflow-x: scroll;
        max-width: fit-content;
        border-radius: var(--border-radius);
    }

    .switcher.full {
        max-width: 100%;
    }

    .switcher :global(.button) {
        white-space: nowrap;
    }

    .switcher {
        background: var(--button-default);
        border: var(--button-stroke) solid 1px;
        box-shadow: var(--shadow-main);
        padding: var(--switcher-padding);
        gap: calc(var(--switcher-padding) - 1.5px);
    }

    .switcher :global(.button.active) {
        pointer-events: none;
    }

    .switcher :global(.button) {
        width: 100%;
        /* [base button height] - ([switcher padding] * [padding factor to accommodate for]) */
        height: calc(40px - var(--switcher-padding) * 2);
        border-radius: calc(var(--border-radius) - var(--switcher-padding));
        border: 1px solid transparent; /* without this the border will flash black when :active */
        box-shadow: none;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .switcher :global(.button:not(.active, :hover, :active)) {
        background-color: transparent;
    }

    .switcher :global(.button:active:not(.active)) {
        border-color: var(--button-stroke);
    }

</style>

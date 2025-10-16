<script lang="ts">
    /**
     * DialogHolder - Root dialog renderer and backdrop manager
     *
     * This component serves as the central hub for all dialogs in the application.
     * It subscribes to the global dialog state and renders all active dialogs.
     * Also manages the backdrop overlay that appears behind dialogs.
     *
     * Architecture:
     * - Renders all dialogs from the global state stack
     * - Manages backdrop visibility and blur effects
     * - Handles dialog-specific styling and animations
     * - Global styles for all dialogs
     *
     * The component is typically rendered once in the root layout and
     * manages all dialog instances throughout the application lifecycle.
     */

    import { dialog } from "$lib/state/dialogs";
    import SmallDialog from "$components/dialog/SmallDialog.svelte";
    import PickerDialog from "$components/dialog/PickerDialog.svelte";
    import type { DialogInfo } from "$lib/types/dialog";

    // Subscribe to single dialog store
    let currentDialog: DialogInfo | null = null;
    dialog.subscribe((d: DialogInfo | null) => {
        currentDialog = d;
    });

    // Show backdrop when there is an active dialog
    $: backdropVisible = !!currentDialog;
</script>

<div id="dialog-holder">
    {#if currentDialog}
        {#key currentDialog.id}
            {#if currentDialog.type === "small"}
                <SmallDialog {...currentDialog} />
            {:else if currentDialog.type === "picker"}
                <PickerDialog {...currentDialog} />
            {/if}
        {/key}
    {/if}
    <div id="dialog-backdrop" class:visible={backdropVisible}></div>
</div>

<style>
    :global(dialog) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: none;
        
        max-height: 100%;
        max-width: 100%;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        pointer-events: all;

        inset-inline-start: unset;
        inset-inline-end: unset;

        overflow: hidden;
    }

    :global(dialog:modal) {
        inset-block-start: 0;
        inset-block-end: 0;
    }

    :global(dialog:modal::backdrop) {
        display: none;
    }

    #dialog-holder {
        position: fixed;
        padding-top: env(safe-area-inset-top);
        height: 100vh;
        width: 100vw;
        z-index: 100000;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1.25rem;
        pointer-events: none;
    }

    #dialog-backdrop {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: -1;

        background-color: var(--dialog-backdrop);

        backdrop-filter: blur(0.4375rem);
        -webkit-backdrop-filter: blur(0.4375rem);

        opacity: 0;

        will-change: opacity;
        transition: opacity 0.2s;
    }

    #dialog-backdrop.visible {
        opacity: 1;
    }

    :global([data-reduce-transparency="true"]) #dialog-backdrop {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
    }

    :global(.dialog-body) {
        --popup-padding: 1.125rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        background: var(--popup-bg);
        box-shadow: 0 0 0 0.125rem var(--popup-stroke) inset;
        border-radius: 1.8125rem;

        filter: drop-shadow(0 0 2.5rem var(--button));

        padding: var(--popup-padding);

        position: relative;
        will-change: transform, opacity, filter;
    }

    :global(dialog.open .dialog-body) {
        animation: modal-in 0.35s;
        animation-delay: 0.06s;
        animation-fill-mode: backwards;
    }

    :global(dialog.closing .dialog-body) {
        animation: modal-out 0.15s;
        opacity: 0;
    }

    @media screen and (max-width: 37.5rem) {
        :global(dialog) {
            justify-content: flex-end;
        }

        :global(dialog.open .dialog-body) {
            animation: modal-in-mobile 0.4s;
        }

        :global(dialog .dialog-body) {
            margin-bottom: calc(
                var(--padding) + calc(
                    env(safe-area-inset-bottom) - 0.9375rem * sign(
                        env(safe-area-inset-bottom)
                    )
                )
            ) !important;
            box-shadow: 0 0 0 0.125rem var(--popup-stroke) inset;
        }
    }

    @keyframes modal-in {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        35% {
            opacity: 1;
        }
        50% {
            transform: scale(1.01);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes modal-out {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: scale(0.9);
            visibility: hidden;
        }
    }

    @keyframes modal-in-mobile {
        0% {
            transform: translateY(0);
            opacity: 0;
        }
        1% {
            transform: translateY(12.5rem);
        }
        35% {
            opacity: 1;
        }
        50% {
            transform: translateY(-0.3125rem);
        }
        100% {
            transform: translateY(0rem);
        }
    }
</style>
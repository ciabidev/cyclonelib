<script lang="ts">
    /**
     * SmallDialog - Standard dialog component for the application
     *
     * The primary dialog component used throughout the application.
     * Provides a consistent interface for displaying messages, confirmations,
     * and user interactions.
     *
     * Features:
     * - Title and body text support
     * - Icon support for visual context
     * - Configurable buttons with actions
     * - Dismissable/backdrop click support
     * - Left-aligned layout option
     * - Meowbalt integration for special dialogs
     *
     * Usage:
     * ```typescript
     * createDialog({
     *   id: 'confirm-delete',
     *   type: 'small',
     *   title: 'Delete Item',
     *   bodyText: 'Are you sure?',
     *   buttons: [
     *     { text: 'Cancel', action: () => {} },
     *     { text: 'Delete', main: true, action: () => deleteItem() }
     *   ]
     * });
     * ```
     */

    import type { DialogButton, SmallDialogIcons } from "$lib/types/dialog";
    import DialogContainer from "$components/dialog/DialogContainer.svelte";
    import DialogButtons from "$components/dialog/DialogButtons.svelte";

    // Props with defaults
    let {
        id,
        meowbalt = undefined,
        icon = undefined,
        title = "",
        bodyText = "",
        bodySubText = "",
        buttons = undefined,
        dismissable = true,
        leftAligned = false
    }: {
        id: string;
        meowbalt?: string;
        icon?: SmallDialogIcons;
        title?: string;
        bodyText?: string;
        bodySubText?: string;
        buttons?: DialogButton[];
        dismissable?: boolean;
        leftAligned?: boolean;
    } = $props();

    // Reference to close function from DialogContainer
    let close: () => void = () => {};
</script>

<DialogContainer {id} {dismissable} bind:close>
    <div
        class="dialog-body small-dialog"
        class:meowbalt-visible={meowbalt}
        class:align-left={leftAligned}
    >
        <div class="dialog-inner-container">
            {#if title || icon}
                <div class="popup-header">
                    {#if icon === "warn-red"}
                        <div class="popup-icon {icon}">
                            <!-- Icon would go here -->
                        </div>
                    {/if}
                    {#if title}
                        <h2 class="popup-title" tabindex="-1">{title}</h2>
                    {/if}
                </div>
            {/if}
            {#if bodyText}
                <div class="body-text" tabindex="-1">{bodyText}</div>
            {/if}
            {#if bodySubText}
                <div class="subtext popup-subtext">{bodySubText}</div>
            {/if}
        </div>
        {#if buttons}
            <DialogButtons {buttons} closeFunc={close} dialogId={id} />
        {/if}
    </div>
</DialogContainer>

<style>
    .small-dialog,
    .dialog-inner-container {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
    }

    .dialog-inner-container {
        overflow-y: scroll;
        gap: 8px;
    }

    .small-dialog {
        text-align: center;
        max-width: 340px;
        width: calc(100% - var(--padding) - var(--dialog-padding) * 2);
        max-height: 85%;
        margin: calc(var(--padding) / 2);
    }

    .small-dialog.meowbalt-visible {
        padding-top: calc(var(--padding) * 4);
    }

    .meowbalt-container {
        position: absolute;
        top: -120px;
    }

    .popup-title {
        color: var(--secondary);
        font-size: 19px;
    }

    .popup-header,
    .popup-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .popup-icon :global(svg) {
        stroke-width: 1.5px;
        height: 50px;
        width: 50px;
    }

    .warn-red :global(svg) {
        stroke: var(--red);
    }

    .body-text {
        font-size: 14.5px;
        font-weight: 500;
        line-height: 1.7;
        color: var(--gray);
        white-space: pre-wrap;
        user-select: text;
        -webkit-user-select: text;
    }

    .popup-subtext {
        opacity: 0.7;
        padding: 0;
    }

    .align-left .body-text {
        text-align: start;
    }

    .align-left .popup-header {
        align-items: start;
        gap: 2px;
    }

    .align-left .popup-icon :global(svg) {
        height: 40px;
        width: 40px;
        stroke-width: 1.8px;
    }
</style>
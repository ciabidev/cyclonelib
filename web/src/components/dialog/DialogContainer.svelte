<script lang="ts">
    /**
     * DialogContainer - Core dialog wrapper component
     *
     * This component provides the foundation for all dialogs in the application.
     * It handles the native HTML <dialog> element, manages open/close state,
     * and provides animation support.
     *
     * Features:
     * - Native HTML dialog element for accessibility
     * - Smooth open/close animations
     * - Backdrop click to close (when dismissable)
     * - Bindable close function for parent components
     *
     * Usage:
     * ```svelte
     * <DialogContainer id="my-dialog" dismissable={true} bind:close={closeFunc}>
     *   <div class="dialog-body">
     *     Dialog content here
     *   </div>
     * </DialogContainer>
     * ```
     */

    import { tick } from "svelte";
    import { killDialog } from "$lib/state/dialogs";
    import DialogBackdropClose from "$components/dialog/DialogBackdropClose.svelte";

    // Props
    let { id, dismissable = true, close = $bindable(() => {}) }: {
        id: string;
        dismissable?: boolean;
        close?: () => void;
    } = $props();

    // State
    let dialogParent: HTMLDialogElement;
    let open = $state(false);
    let closing = $state(false);

    // Listen for animated close events
    $effect(() => {
        const handleCloseAnimated = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.dialogId === id) {
                closeDialog();
            }
        };

        window.addEventListener('close-dialog-animated', handleCloseAnimated);

        return () => {
            window.removeEventListener('close-dialog-animated', handleCloseAnimated);
        };
    });

    /**
     * Closes the dialog with animation
     */
    const closeDialog = () => {
        if (dialogParent) {
            closing = true;
            open = false;

            // Wait 150ms for the closing animation to finish
            setTimeout(() => {
                // Check if dialog parent is still present
                if (dialogParent) {
                    dialogParent.close();
                    killDialog();
                }
            }, 150);
        }
    };

    // Update the bindable close function
    $effect(() => {
        close = closeDialog;
    });

    // Show modal and trigger open animation when dialog element is ready
    $effect(() => {
        if (dialogParent) {
            dialogParent.showModal();
            tick().then(() => {
                open = true;
            });
        }
    });
</script>

<dialog id="dialog-{id}" bind:this={dialogParent} class:closing class:open>
    <slot></slot>
    <DialogBackdropClose closeFunc={dismissable ? closeDialog : () => {}} />
</dialog>
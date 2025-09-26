<script lang="ts">
    /**
     * DialogBackdropClose - Invisible backdrop click handler
     *
     * Provides an invisible overlay that covers the entire dialog area.
     * When clicked, it triggers the close function to dismiss the dialog.
     *
     * This enables the common UX pattern of clicking outside the dialog
     * to close it, improving user experience and accessibility.
     *
     * Props:
     * - closeFunc: () => void - Function to call when backdrop is clicked
     */

    // Props
    let { closeFunc }: { closeFunc: () => void } = $props();
</script>

<div
    id="dialog-backdrop-close"
    aria-hidden="true"
    onclick={() => closeFunc()}
></div>

<style>
    #dialog-backdrop-close {
        position: inherit;
        height: 100%;
        width: 100%;
        z-index: -1;
    }
</style>
<script lang="ts">
    /**
     * DialogButtons - Container for dialog button groups
     *
     * Renders a horizontal row of buttons for dialog actions.
     * Handles the layout and spacing of multiple dialog buttons.
     *
     * Features:
     * - Horizontal button layout with proper spacing
     * - Scroll support for overflow
     * - Consistent styling with dialog theme
     *
     * Props:
     * - buttons: DialogButtonType[] - Array of button configurations
     * - closeFunc: () => void - Function to close the parent dialog
     */

    import type { DialogButton as DialogButtonType } from "$lib/types/dialog";
    import DialogButton from "$components/dialog/DialogButton.svelte";

    // Props
    let { buttons, closeFunc, dialogId }: { buttons: DialogButtonType[]; closeFunc: () => void; dialogId: string } = $props();
</script>

<div class="popup-buttons">
    {#each buttons as button}
        <DialogButton {button} {closeFunc} {dialogId} />
    {/each}
</div>

<style>
    .popup-buttons {
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: calc(var(--padding) / 2);
        overflow: scroll;
        border-radius: var(--border-radius);
        min-height: 40px;
    }
</style>
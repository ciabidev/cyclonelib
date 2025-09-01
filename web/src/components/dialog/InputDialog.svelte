<script lang="ts">
    /**
     * InputDialog - Dialog component with input field
     *
     * A dialog component that includes an input field using the Input.svelte component.
     * Provides a consistent interface for user input dialogs throughout the application.
     *
     * Features:
     * - Title and body text support
     * - Input field with placeholder and value binding
     * - Icon support for visual context
     * - Configurable buttons with actions
     * - Dismissable/backdrop click support
     * - Support for different input types (text, password, etc.)
     * - Support for textarea (long input)
     *
     * Usage:
     * ```typescript
     * createDialog({
     *   id: 'input-name',
     *   type: 'input',
     *   title: 'Enter Name',
     *   placeholder: 'Your name here...',
     *   value: '',
     *   buttons: [
     *     { text: 'cancel', action: () => {} },
     *     { text: 'Save', main: true, action: () => saveName(value) }
     *   ]
     * });
     * ```
     */

    import type { DialogButton } from "$lib/types/dialog";
    import DialogContainer from "$components/dialog/DialogContainer.svelte";
    import DialogButtons from "$components/dialog/DialogButtons.svelte";
    import Input from "$components/inputs-and-buttons/Input.svelte";

    // Props with defaults
    let {
        id,
        icon = undefined,
        title = "",
        bodyText = "",
        placeholder = "",
        value = $bindable(''),
        inputType = 'text',
        long = false,
        buttons = undefined,
        dismissable = true
    }: {
        id: string;
        icon?: any;
        title?: string;
        bodyText?: string;
        placeholder?: string;
        value?: string;
        inputType?: string;
        long?: boolean;
        buttons?: DialogButton[];
        dismissable?: boolean;
    } = $props();

    // Reference to close function from DialogContainer
    let close: () => void = () => {};
</script>

<DialogContainer {id} {dismissable} bind:close>
    <div class="dialog-body input-dialog">
        <div class="dialog-inner-container">
            {#if title || icon}
                <div class="popup-header">
                    {#if icon}
                        <div class="popup-icon">
                            <svelte:component this={icon} />
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
            <div class="input-container">
                <Input
                    {placeholder}
                    bind:value
                    type={inputType}
                    {long}
                />
            </div>
        </div>
        {#if buttons}
            <DialogButtons {buttons} closeFunc={close} dialogId={id} />
        {/if}
    </div>
</DialogContainer>

<style>
    .input-dialog,
    .dialog-inner-container {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
    }

    .dialog-inner-container {
        overflow-y: scroll;
        gap: 8px;
    }

    .input-dialog {
        text-align: center;
        max-width: 400px;
        width: calc(100% - var(--padding) - var(--dialog-padding) * 2);
        max-height: 85%;
        margin: calc(var(--padding) / 2);
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

    .body-text {
        font-size: 14.5px;
        font-weight: 500;
        line-height: 1.7;
        color: var(--gray);
        white-space: pre-wrap;
        user-select: text;
        -webkit-user-select: text;
    }

    .input-container {
        width: 100%;
        margin: var(--padding) 0;
    }
</style>
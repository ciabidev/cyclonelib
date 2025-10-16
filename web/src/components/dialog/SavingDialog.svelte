<script lang="ts">
    import type { CobaltFileUrlType } from "$lib/types/api";

    import DialogContainer from "$components/dialog/DialogContainer.svelte";

    import DialogButtons from "$components/dialog/DialogButtons.svelte";

    export let id: string;
    export let dismissable = true;
    export let bodyText: string = "";

    export let url: string = "";
    export let file: File | undefined = undefined;
    export let urlType: CobaltFileUrlType | undefined = undefined;

    let close: () => void;

    let copied = false;
</script>

<DialogContainer {id} {dismissable} bind:close>
    <div class="dialog-body popup-body">
        <div class="emoticon-container">
            <!-- Placeholder for Emoticon -->
        </div>

        <div class="dialog-inner-container">
            <div class="popup-header">
                📁
                <h2 class="popup-title" >
                    Download Complete
                </h2>
            </div>

            <div class="action-buttons">
                {#if url}
                    <button
                        class="action-button"
                        onclick={() => {
                            if (!copied) {
                                navigator.clipboard.writeText(url);
                                copied = true;
                            }
                        }}
                    >
                        {copied ? '✅ Copied!' : '📋 Copy Link'}
                    </button>
                {/if}

                {#if url}
                    <a
                        class="action-button"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🌐 Open Link
                    </a>
                {/if}
            </div>

            {#if bodyText}
                <div class="body-text">
                    {bodyText}
                </div>
            {/if}
        </div>

        <DialogButtons
            buttons={[
                {
                    text: "Done",
                    main: true,
                    action: () => {},
                },
            ]}
            closeFunc={close}
            dialogId={id}
        />
    </div>
</DialogContainer>

<style>
    .popup-body,
    .dialog-inner-container {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
    }

    .dialog-inner-container {
        overflow-y: scroll;
        gap: 0.5rem;
        width: 100%;
    }

    .popup-body {
        max-width: 21.25rem;
        width: calc(100% - var(--padding) - var(--popup-padding) * 2);
        max-height: 70%;
        margin: calc(var(--padding) / 2);
    }

    .emoticon-container {
        position: absolute;
        top: -7.875rem;
        right: 0;
        /* simulate emoticon being behind the popup */
        clip-path: inset(0rem 0rem 0.875rem 0rem);
    }

    .popup-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: calc(var(--padding) / 2);
        color: var(--text-color);
    }

    .popup-title {
        color: var(--text-color);
        font-size: 1.1875rem;
    }

    .action-buttons {
        display: flex;
        flex-direction: column;
        gap: calc(var(--padding) / 2);
        position: relative;
    }

    .action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: var(--button);
        border: 0.0625rem solid var(--button-stroke);
        border-radius: var(--border-radius);
        color: var(--text-color);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .action-button:hover {
        background: var(--button-hover);
        transform: translateY(-0.0625rem);
    }

    .action-button:active {
        transform: translateY(0);
    }

    .body-text {
        font-size: 0.8125rem;
        font-weight: 500;
        line-height: 1.5;
        color: var(--gray);
        white-space: pre-wrap;
        user-select: text;
        -webkit-user-select: text;
    }
</style>
<script lang="ts">
    let tutorialExpanded = false;
</script>

<div id="saving-tutorial" class:expanded={tutorialExpanded}>
    <button
        id="tutorial-button"
        class="button button--elevated"
        onclick={() => {
            tutorialExpanded = !tutorialExpanded;
        }}
    >
        <div class="expand-icon">
            {tutorialExpanded ? '−' : '+'}
        </div>
        iOS Saving Tips
    </button>

    {#if tutorialExpanded}
        <div class="body-text tutorial-body">
            <div>
                For the best experience on iOS, follow these steps:
            </div>

            <div class="numbered-list">
                <li>
                    Tap and hold the download link
                    <div class="shortcut-list">
                        <div class="shortcut">
                            📸 Photos App
                        </div>
                        <div class="shortcut">
                            📁 Files App
                        </div>
                    </div>
                </li>
                <li>
                    Choose "Download Linked File" or "Open in New Tab"
                </li>
                <li>
                    The file will be saved to your device
                </li>
            </div>

            <div>
                This ensures the best compatibility with iOS Safari.
            </div>
        </div>
    {/if}
</div>

<style>
    #saving-tutorial {
        display: flex;
        flex-direction: column;
        background: var(--button-elevated);
        border-radius: var(--border-radius);
    }

    #tutorial-button {
        font-size: 0.8125rem;
        width: 100%;
        justify-content: flex-start;
        padding: 0.5rem;
    }

    .expand-icon {
        height: 1.125rem;
        width: 1.125rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: var(--text-color);
    }

    .tutorial-body *:not(.shortcut) {
        font-size: 0.8125rem;
        font-weight: 500;
        line-height: 1.5;
        white-space: pre-wrap;
        user-select: text;
        -webkit-user-select: text;
    }

    .tutorial-body {
        color: var(--text-color);
        padding: var(--padding);
        padding-top: 0.375rem;
    }

    .tutorial-body,
    .numbered-list {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
    }

    .numbered-list {
        list-style-type: decimal;
    }

    .numbered-list li {
        margin-block: 0;
    }

    .shortcut-list {
        display: flex;
        padding-top: 0.375rem;
        gap: 0.375rem;
    }

    .shortcut {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--button-elevated-hover);
        width: 100%;
        gap: 0.1875rem;
        text-decoration: none;
        font-size: 0.8125rem;
        padding: 0.5rem;
        border-radius: var(--border-radius);
    }
</style>
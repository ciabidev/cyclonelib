<script lang="ts">
    let tutorialExpanded = false;
</script>

<div id="saving-tutorial" class:expanded={tutorialExpanded}>
    <button
        id="tutorial-button"
        class="button button--elevated"
        on:click={() => {
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
        font-size: 13px;
        width: 100%;
        justify-content: flex-start;
        padding: 8px;
    }

    .expand-icon {
        height: 18px;
        width: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: var(--text-color);
    }

    .tutorial-body *:not(.shortcut) {
        font-size: 13px;
        font-weight: 500;
        line-height: 1.5;
        white-space: pre-wrap;
        user-select: text;
        -webkit-user-select: text;
    }

    .tutorial-body {
        color: var(--text-color);
        padding: var(--padding);
        padding-top: 6px;
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
        padding-top: 6px;
        gap: 6px;
    }

    .shortcut {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--button-elevated-hover);
        width: 100%;
        gap: 3px;
        text-decoration: none;
        font-size: 13px;
        padding: 8px;
        border-radius: var(--border-radius);
    }
</style>
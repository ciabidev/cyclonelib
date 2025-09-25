/**
 * Dialog System - State Management
 *
 * This module provides a centralized dialog management system using Svelte stores.
 * It maintains a stack of dialogs and provides methods to create, close, and manage them.
 *
 * Key Features:
 * - Stack-based dialog management (supports multiple overlapping dialogs)
 * - Reactive state using Svelte stores
 * - Type-safe dialog configuration
 * - Backward compatibility with existing code
 * - Compatible with Svelte 5
 *
 * Usage:
 * ```typescript
 * import { createDialog } from '$lib/state/dialogs';
 *
 * createDialog({
 *   id: 'my-dialog',
 *   type: 'small',
 *   title: 'Hello World',
 *   bodyText: 'This is a dialog',
 *   buttons: [
 *     { text: 'continue', main: true, action: () => console.log('OK clicked') }
 *   ]
 * });
 * ```
 */

import { writable, type Writable } from "svelte/store";
import type { DialogInfo } from "$lib/types/dialog";

/**
 * DialogManager - Core dialog state management class
 *
 * Manages the lifecycle and state of all dialogs in the application.
 * Uses a stack-based approach to support multiple overlapping dialogs.
 */
class DialogManager {
    /**
     * Store for active dialogs
     * Each dialog is pushed to the end of the array and popped from the end
     */
    private dialogsStore: Writable<DialogInfo[]> = writable([]);

    constructor() {
        // Initialize with empty array
        this.dialogsStore.set([]);
    }

    async killDialog() {
        this.dialogsStore.update(dialogs => dialogs.slice(0, -1));
    }



    /**
     * Closes all currently active dialogs
     * Useful for cleanup or when navigating away from a page
     * Currently unused until we add multi dialog support
     **/
    
    async clearAll() {
        this.dialogsStore.set([]);
    }

    async createDialog(dialog: DialogInfo) {
        this.clearAll()
        this.dialogsStore.update(dialogs => [...dialogs, dialog]);
    }

    /**
     * Gets the dialogs store for subscription
     */
    get dialogs() {
        return this.dialogsStore;
    }
}

// Create a singleton instance for global dialog management
export const dialogManager = new DialogManager();


export function createDialog(dialog: DialogInfo) {
    dialogManager.createDialog(dialog);
}

/**
 * Closes the topmost dialog
 */
export function killDialog() {
    dialogManager.killDialog();
}

// Reactive exports for component usage
/**
 * Reactive store of current dialogs
 * Components can subscribe to this for automatic re-rendering
 */
export const dialogs = dialogManager.dialogs;
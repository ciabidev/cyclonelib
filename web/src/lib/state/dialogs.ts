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
 *     { text: 'OK', main: true, action: () => console.log('OK clicked') }
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

    /**
     * Creates and displays a new dialog
     *
     * @param dialog - Complete dialog configuration object
     * @example
     * dialogManager.createDialog({
     *   id: 'confirm-delete',
     *   type: 'small',
     *   title: 'Delete Item',
     *   bodyText: 'Are you sure you want to delete this item?',
     *   buttons: [
     *     { text: 'Cancel', action: () => {} },
     *     { text: 'Delete', main: true, action: () => deleteItem() }
     *   ]
     * });
     */
    createDialog(dialog: DialogInfo) {
        this.dialogsStore.update(dialogs => [...dialogs, dialog]);
    }

    /**
     * Closes the topmost (most recently opened) dialog
     * This removes the last dialog from the stack
     */
    killDialog() {
        this.dialogsStore.update(dialogs => dialogs.slice(0, -1));
    }

    /**
     * Closes all currently active dialogs
     * Useful for cleanup or when navigating away from a page
     */
    clearAll() {
        this.dialogsStore.set([]);
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

// Convenience functions for backward compatibility and easier usage
/**
 * Creates and displays a new dialog
 * @param dialog - Dialog configuration object
 */
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
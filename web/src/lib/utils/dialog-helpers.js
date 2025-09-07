import { createDialog, killDialog } from '$lib/state/dialogs';

/**
 * Creates a standardized error dialog
 * @param {string} id - Dialog ID
 * @param {string} title - Dialog title
 * @param {string} message - Error message
 * @param {Function} [onContinue] - Optional callback for continue button
 */
export function showErrorDialog(id, title, message, onContinue = () => {}) {
	killDialog();
	createDialog({
		id,
		type: 'small',
		title,
		icon: 'warn-red',
		bodyText: message,
		buttons: [
			{
				text: 'continue',
				main: true,
				action: onContinue
			}
		]
	});
}

/**
 * Creates a standardized success dialog
 * @param {string} id - Dialog ID
 * @param {string} title - Dialog title
 * @param {string} message - Success message
 * @param {Function} [onContinue] - Optional callback for continue button
 */
export function showSuccessDialog(id, title, message, onContinue = () => {}) {
	killDialog();
	createDialog({
		id,
		type: 'small',
		title,
		bodyText: message,
		buttons: [
			{
				text: 'continue',
				main: true,
				action: onContinue
			}
		]
	});
}

/**
 * Creates a standardized validation error dialog
 * @param {string} id - Dialog ID
 * @param {string} message - Validation error message
 */
export function showValidationErrorDialog(id, message) {
	showErrorDialog(id, 'Validation Error', message);
}

/**
 * Creates a standardized network error dialog
 * @param {string} id - Dialog ID
 * @param {string} operation - The operation that failed (e.g., 'loading packages')
 */
export function showNetworkErrorDialog(id, operation) {
	showErrorDialog(id, 'Network Error', `Network error occurred while ${operation}`);
}
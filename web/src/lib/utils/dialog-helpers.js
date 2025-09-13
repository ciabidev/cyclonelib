import { createDialog, killDialog } from '$lib/state/dialogs';


/** 
 * Creates a basic Small dialog 
 * @param {string} id - Dialog ID
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} [onContinue] - Optional callback for continue button
 * 
*/
export function showDialog(id, title, message, onContinue = () => {}) {
	killDialog();
	createDialog({
		id,
		type: 'small',
		title,
		icon: '',
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
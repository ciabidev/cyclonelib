import { createDialog, killDialog } from '$lib/state/dialogs';
import type { DialogPickerItem, DialogButton } from '$lib/types/dialog';


/**
 * Creates a standardized error dialog
 */
export function showErrorDialog(id: string, title: string, message: string, onContinue: () => unknown = () => {}) {
	setTimeout(() => {
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
	}, 1);
	killDialog();
}

/**
 * Creates a basic Small dialog
 */
export function smallDialog(id: string, title: string, message: string, onContinue: () => unknown = () => {}) {
	setTimeout(() => {
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
	}, 1);
	killDialog();
}

/**
 * Creates a Picker dialog
 */
export function pickerDialog(id: string, items: DialogPickerItem[], buttons: DialogButton[] = [] as DialogButton[]) {
	setTimeout(() => {
		createDialog({
			id,
			type: 'picker',
			items,
			buttons
		});
	}, 1);
	killDialog();
}

import { createDialog, killDialog } from '$lib/state/dialogs';
import type { DialogPickerItem, DialogButton } from '$lib/types/dialog';
import type { Emotion } from '$lib/types/emoticon';

/**
 * Creates a standardized error dialog
 */
export function showErrorDialog(id: string, title: string, bodyText: string, onContinue: () => unknown = () => {}) {
	setTimeout(() => {
		createDialog({
			id,
			type: 'small',
			title,
			icon: 'warn-red',
			bodyText,
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
export function smallDialog(id: string, title: string, bodyText: string, onContinue: () => unknown = () => {}, emotion?: Emotion) {
	setTimeout(() => {
		createDialog({
			id,
			type: 'small',
			title,
			emoticon: emotion,
			icon: 'warn-red',
			bodyText,
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
export function pickerDialog(id: string, items: DialogPickerItem[], buttons: DialogButton[] = [] as DialogButton[], onSelect?: (item: DialogPickerItem) => void) {
	setTimeout(() => {
		createDialog({
			id,
			type: 'picker',
			items,
			buttons,
			onSelect
		});
	}, 1);
	killDialog();
}

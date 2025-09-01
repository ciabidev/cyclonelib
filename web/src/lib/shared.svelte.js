export const packgod = $state({
	inputText: '',
	resultText: '',
	status: 'start'
});

export const dialog = $state({
	isOpen: false,
	title: '',
	content: '',
	confirmText: 'Confirm',
	cancelText: 'cancel',
	onConfirm: /** @type {Function | null} */ (null),
	oncancel: /** @type {Function | null} */ (null),
	type: 'info' // 'info', 'warning', 'error', 'success'
});

/**
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.content]
 * @param {string} [options.confirmText]
 * @param {string} [options.cancelText]
 * @param {Function} [options.onConfirm]
 * @param {Function} [options.onCancel]
 * @param {string} [options.type]
 */
export function showDialog(options) {
	dialog.isOpen = true;
	dialog.title = options.title || '';
	dialog.content = options.content || '';
	dialog.confirmText = options.confirmText || 'Confirm';
	dialog.cancelText = options.cancelText || 'Cancel';
	dialog.onConfirm = options.onConfirm || null;
	dialog.onCancel = options.onCancel || null;
	dialog.type = options.type || 'info';
}

export function hideDialog() {
	dialog.isOpen = false;
	dialog.title = '';
	dialog.content = '';
	dialog.onConfirm = null;
	dialog.onCancel = null;
}

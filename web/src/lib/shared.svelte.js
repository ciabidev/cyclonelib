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


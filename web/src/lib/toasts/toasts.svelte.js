export const toasts = $state([
]);

export const newToast = (icon, content) => {
	toasts.push({icon: icon, content: content})
};
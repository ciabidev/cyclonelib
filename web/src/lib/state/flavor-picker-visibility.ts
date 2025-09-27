import { get, writable } from "svelte/store";

export const flavorPickerVisible = writable(false);

export const openFlavorPicker = () => {
    const visible = get(flavorPickerVisible);
    if (!visible) {
        return flavorPickerVisible.update(v => !v);
    }
}
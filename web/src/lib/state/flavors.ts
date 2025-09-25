import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Flavor } from '$lib/types/flavor';
s
const defaultFlavor: Flavor = 'rain';

function getStoredFlavor(): Flavor {
	if (!browser) return defaultFlavor;
	const stored: Flavor | null = localStorage.getItem('flavor') as Flavor | null;
	if (stored) {
		return stored as Flavor;
	}
	return defaultFlavor;
}

export const flavor = writable<Flavor>(getStoredFlavor());

flavor.subscribe((value) => {
	if (browser) {
		localStorage.setItem('flavor', value);
	}
});
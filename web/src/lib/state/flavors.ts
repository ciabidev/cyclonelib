import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Flavor } from '$lib/types/flavor';

// Get the flavor from localStorage or default to 'rain'
const storedFlavor = typeof window !== 'undefined' ? localStorage.getItem('flavor') : 'rain';

export const flavor = writable(storedFlavor);

// Update localStorage when the flavor changes
flavor.subscribe(value => {
  if (typeof window !== 'undefined' && value) {
    localStorage.setItem('flavor', value);
  }
});
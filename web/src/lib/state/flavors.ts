import { writable } from 'svelte/store';
import type { Flavor } from '$lib/types/flavor';
import { dark_flavors } from '$lib/types/flavor';

// default to the app's baseline flavor. the initial flavor/flavorType is
// handled in +layout.svelte to avoid SSR flash; stores only need sensible defaults.
const defaultFlavor = 'rain';
const defaultFlavorType = dark_flavors.includes(defaultFlavor as Flavor) ? 'dark' : 'light';

export const flavor = writable<Flavor>(defaultFlavor);
export const flavorType = writable(defaultFlavorType);

// Initialize from localStorage in the browser so the persisted choice
// is applied before any other client-side logic runs. This prevents the
// default store value from overwriting a user's saved preference.
if (typeof window !== 'undefined') {
  try {
    const f = localStorage.getItem('flavor');
    const t = localStorage.getItem('flavorType');
    if (f) flavor.set(f as Flavor);
    if (t) flavorType.set(t);
  } catch (e) {
    // ignore localStorage errors
  }
}

// persist changes to localStorage and keep flavorType in sync.
// guard with typeof window so this runs only in the browser.
flavor.subscribe(value => {
  if (typeof window !== 'undefined' && value) {
    try {
      localStorage.setItem('flavor', value);
      const newFlavorType = dark_flavors.includes(value as Flavor) ? 'dark' : 'light';
      flavorType.set(newFlavorType);
      localStorage.setItem('flavorType', newFlavorType);
      // Also update the DOM attributes directly to ensure immediate UI update
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-flavor', value);
        document.documentElement.setAttribute('data-flavor-type', newFlavorType);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }
});
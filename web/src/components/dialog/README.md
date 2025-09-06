# Dialog System Documentation

## Overview

The ciabi-web dialog system provides a flexible, accessible, and easy-to-use modal dialog framework built with Svelte 5. It supports multiple overlapping dialogs, smooth animations, and comprehensive customization options.
NOTE: I did not code all of this, most of it is from the cobalt.tools dialog system. This is simply a migration to svelte 5. I used the help of AI since building this is super confusing and i have school lol

## Architecture

### Core Components

1. **DialogManager** (`$lib/state/dialogs.ts`) - Central state management using Svelte 5 runes
2. **DialogHolder** (`DialogHolder.svelte`) - Root renderer and backdrop manager
3. **SmallDialog** (`SmallDialog.svelte`) - Main dialog component
4. **DialogContainer** (`DialogContainer.svelte`) - Native dialog wrapper with animations
5. **DialogButton** (`DialogButton.svelte`) - Individual button component
6. **DialogButtons** (`DialogButtons.svelte`) - Button container
7. **DialogBackdropClose** (`DialogBackdropClose.svelte`) - Backdrop click handler

### State Management

The system uses Svelte stores for reactive state management (compatible with Svelte 5):

```typescript
// Global dialog state store
export const dialogs = dialogManager.dialogs;

// Create a new dialog
createDialog({
  id: 'my-dialog',
  type: 'small',
  title: 'Hello World',
  bodyText: 'This is a dialog',
  buttons: [
    { text: 'continue', main: true, action: () => console.log('ok clicked') }
  ]
});

// Close the top dialog
killDialog();
```

## Usage

### Basic Dialog

```typescript
import { createDialog } from '$lib/state/dialogs';

createDialog({
  id: 'simple-dialog',
  type: 'small',
  title: 'Simple Dialog',
  bodyText: 'This is a basic dialog example.',
  buttons: [
    {
      text: 'continue',
      main: true,
      action: () => console.log('ok clicked')
    }
  ]
});
```

### Confirmation Dialog

```typescript
createDialog({
  id: 'confirm-delete',
  type: 'small',
  title: 'Delete Item',
  bodyText: 'Are you sure you want to delete this item? This action cannot be undone.',
  buttons: [
    {
      text: 'cancel',
      action: () => console.log('Cancelled')
    },
    {
      text: 'Delete',
      main: true,
      color: 'red',
      action: () => deleteItem()
    }
  ]
});
```

### Dialog with Timeout

```typescript
createDialog({
  id: 'auto-close-dialog',
  type: 'small',
  title: 'Auto-closing Dialog',
  bodyText: 'This dialog will close automatically in 5 seconds.',
  buttons: [
    {
      text: 'Close Now',
      main: true,
      timeout: 5000, // 5 seconds
      action: () => console.log('Closed manually')
    }
  ]
});
```

## Dialog Configuration

### DialogInfo Interface

```typescript
interface DialogInfo {
  id: string;
  type: 'small';
  dismissable?: boolean; // Allow backdrop click to close (default: true)
  meowbalt?: string; // Special styling for certain dialogs
  icon?: SmallDialogIcons; // Visual icon
  title?: string; // Dialog title
  bodyText?: string; // Main content
  bodySubText?: string; // Secondary content
  buttons?: DialogButton[]; // Action buttons
  leftAligned?: boolean; // Left-align content
}
```

### DialogButton Interface

```typescript
interface DialogButton {
  text: string; // Button label
  color?: 'red'; // Optional color variant
  main: boolean; // Primary action button
  timeout?: number; // Auto-enable after milliseconds
  action: () => unknown | Promise<unknown>; // Click handler
  link?: string; // Optional link URL (renders as <a>)
}
```

## Features

### Multiple Dialogs
The system supports stacking multiple dialogs. New dialogs appear on top of existing ones.

### Animations
- Smooth open/close transitions
- Mobile-specific animations
- Configurable timing

### Accessibility
- Native `<dialog>` element for screen readers
- Proper focus management
- Keyboard navigation support

### Responsive Design
- Mobile-optimized layouts
- Touch-friendly interactions
- Adaptive sizing

### Theming
- CSS custom properties for easy customization
- Consistent with application design system
- Dark/light mode support

## Advanced Usage

### Custom Dialog Types
Extend the system by adding new dialog types:

```typescript
// Add to DialogInfo union type
export type DialogInfo = SmallDialog | CustomDialog;

// Create custom dialog component
// CustomDialog.svelte
```

### Programmatic Control
```typescript
import { dialogManager } from '$lib/state/dialogs';

// Check if dialogs are active
if (dialogManager.hasActiveDialogs) {
  // Handle active dialogs
}

// Clear all dialogs
dialogManager.clearAll();
```

### Event Handling
```typescript
// Dialog buttons support async actions
{
  text: 'Save',
  main: true,
  action: async () => {
    await saveData();
    console.log('Data saved');
  }
}
```

## Styling

The dialog system uses CSS custom properties for theming:

```css
:root {
  --dialog-backdrop: rgba(0, 0, 0, 0.5);
  --popup-bg: #ffffff;
  --popup-stroke: rgba(0, 0, 0, 0.1);
  /* ... more variables */
}
```

## Migration from Svelte 4

The system has been updated to be compatible with Svelte 5 with the following changes:

- **State Management**: Uses Svelte stores (compatible with both Svelte 4 and 5)
- **Props**: Updated to use `$props()` syntax in components
- **State**: Updated to use `$state()` for local component state
- **Effects**: Updated to use `$effect()` for side effects
- **Store Subscriptions**: Proper typing for store subscriptions
- **Documentation**: Comprehensive JSDoc comments and usage examples

## Best Practices

1. **Always provide unique IDs** for dialogs to ensure proper stacking
2. **Use main buttons sparingly** - only one primary action per dialog
3. **Handle async actions properly** in button callbacks
4. **Test on mobile devices** for responsive behavior
5. **Use appropriate colors** for destructive actions (red)
6. **Keep dialog content concise** for better UX

## Troubleshooting

### Common Issues

1. **Dialog not appearing**: Check that DialogHolder is rendered in the layout
2. **TypeScript errors**: Ensure proper imports and type definitions
3. **Styling issues**: Verify CSS custom properties are defined
4. **Multiple dialogs**: Ensure unique IDs for proper stacking

### Debug Mode

Enable debug logging by setting a local storage flag:

```javascript
localStorage.setItem('dialog-debug', 'true');
```

This will log dialog creation, opening, and closing events to the console.
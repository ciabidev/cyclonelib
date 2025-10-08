import { error as svelteError } from '@sveltejs/kit';

/**
 * handleApiError(err, ctx)
 *
 * Consistent API error handling helper:
 * - If the error already encodes an HTTP response (has a `status`), re-throws it so SvelteKit preserves it.
 * - Logs the full error server-side (console.error).
 * - Throws a new 500 SvelteKit error with a safe message:
 *     - In production: "Internal server error"
 *     - Else: the original error message (or String(err) fallback)
 *
 * Usage (example):
 * import { handleApiError } from '$lib/server/error-utils.js';
 * try {
 *   // ... code that may throw
 * } catch (err) {
 *   handleApiError(err, 'POST /api/packages');
 * }
 */
export function handleApiError(err, ctx = '') {
  if (err && typeof err === 'object' && 'status' in err) {
    // Re-throw SvelteKit HTTP errors (404/403/etc.) so their status is preserved
    throw err;
  }

  // Log full error for developers / server logs
  console.error('[API]', ctx, err);

  // Safe client message
  const clientMessage =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (err?.message || String(err));

  throw svelteError(500, { message: clientMessage });
}
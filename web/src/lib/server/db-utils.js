

import { supabaseServer } from './supabase-server.js';

/**
 * Get database connection (Supabase client)
 * @returns {Object} Supabase client instance
 */
export async function connectDB() {
  return supabaseServer;
}

/**
 * Serialize Supabase document for JSON response
 * Converts timestamp strings and recursively serializes nested objects
 *
 * @param {Object} doc - Supabase record to serialize
 * @param {string[]} [exclude=[]] - Array of field names to exclude from serialization
 * @returns {Object|null} Serialized document or null if doc is falsy
 *
 * @example
 * const doc = { id: 1, name: 'test', secret: 'hidden', created_at: '2023-01-01T00:00:00Z' };
 * const serialized = serializeDoc(doc, ['secret']);
 * // Result: { id: 1, name: 'test', created_at: '2023-01-01T00:00:00.000Z' }
 */
export function serializeDoc(doc, exclude = []) {
  if (!doc) return null;
  /** @type {Record<string, any>} */
  const serialized = {};
  for (const [key, value] of Object.entries(doc)) {
    if (exclude.includes(key)) continue;
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        serialized[key] = value.map(v => typeof v === 'object' ? serializeDoc(v, exclude) : v);
      } else {
        serialized[key] = serializeDoc(value, exclude);
      }
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}

/**
 * Checks if a string is a valid UUID format
 * @param {string} str - The string to check
 * @returns {boolean} True if valid UUID
 */
export function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Hash edit code using SHA-256 for secure storage
 *
 * @param {string} editCode - The edit code to hash
 * @returns {Promise<string>} Hexadecimal string of the SHA-256 hash
 *
 * @example
 * const hashed = await hashEditCode('mySecret123');
 * // Result: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'
 */
export async function hashEditCode(editCode) {
  const encoder = new TextEncoder();
  const data = encoder.encode(editCode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fetch shortcut name from iCloud API
 * Handles both iCloud and RoutineHub URLs, resolving RoutineHub redirects to iCloud URLs
 *
 * @param {string} downloadUrl - The shortcut URL (iCloud or RoutineHub)
 * @returns {Promise<string>} The shortcut name from fields.name.value
 * @throws {Error} If URL is invalid, ID cannot be extracted, or API request fails
 *
 * @example
 * const name = await getShortcutName('https://www.icloud.com/shortcuts/32751811e2f04de99abff36399fa2bd7');
 * // Result: 'Simple Base64'
 * const name = await getShortcutName('https://routinehub.co/download/12345');
 * // Result: 'Simple Base64' (after resolving redirect)
 */
export async function getShortcutName(downloadUrl) {
  try {
    let icloudUrl = downloadUrl;
    
    // If it's a RoutineHub URL, resolve the redirect to get the iCloud URL
    if (downloadUrl.startsWith('https://routinehub.co/download')) {
      try {
        const response = await fetch(downloadUrl, { 
          redirect: 'manual',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        // Handle redirect manually
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (location) {
            icloudUrl = location;
          }
        } else {
          icloudUrl = response.url;
        }
        
        console.log(`RoutineHub URL resolved to: ${icloudUrl}`);
        
        // Validate that we got an iCloud URL back
        if (!icloudUrl.includes('icloud.com/shortcuts')) {
          throw new Error(`RoutineHub resolved to: ${icloudUrl} (expected iCloud URL)`);
        }
      } catch (redirectError) {
        throw new Error(`Failed to resolve RoutineHub URL: ${redirectError.message}`);
      }
    }
    
    // Parse the iCloud URL to extract the shortcut ID
    const url = new URL(icloudUrl);
    const pathname = url.pathname;
    
    // Extract shortcut ID from URL path (e.g., /shortcuts/32751811e2f04de99abff36399fa2bd7)
    const pathParts = pathname.split('/').filter(p => p.length > 0);
    if (pathParts.length < 2 || pathParts[0] !== 'shortcuts') {
      throw new Error(`Invalid shortcut URL format. Expected /shortcuts/{id}, got: ${pathname}`);
    }
    
    const shortcutId = pathParts[1];
    if (!shortcutId) {
      throw new Error('Shortcut ID not found in URL');
    }
    
    // Make GET request to the iCloud API
    const apiUrl = `https://www.icloud.com/shortcuts/api/records/${shortcutId}`;
    const apiResponse = await fetch(apiUrl);
    
    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch shortcut: HTTP ${apiResponse.status}`);
    }
    
    const data = await apiResponse.json();
    
    // Extract the shortcut name from the response
    if (!data.fields || !data.fields.name || !data.fields.name.value) {
      throw new Error('Shortcut name not found in API response');
    }
    
    return data.fields.name.value;
  } catch (error) {
    throw new Error(`Error fetching shortcut name: ${error.message}`);
  }
}
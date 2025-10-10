

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
import { MongoClient, ObjectId } from 'mongodb';

const DB_NAME = 'cyclone';

let client;
let db;

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  console.log('DEBUG: MONGO_URI from process.env:', mongoUri ? 'SET' : 'NOT SET');
  console.log('DEBUG: All env vars starting with MONGO:', Object.keys(process.env).filter(key => key.includes('MONGO')));

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  try {
    // Always create a new connection in serverless environment to avoid stale connections
    const newClient = new MongoClient(mongoUri, {
      maxPoolSize: 1, // Limit connection pool size for serverless
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 10000, // 10 second socket timeout
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    });

    await newClient.connect();
    return newClient.db(DB_NAME);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Serialize MongoDB document for JSON response
 * Converts ObjectId instances to strings and recursively serializes nested objects
 *
 * @param {Object} doc - MongoDB document to serialize
 * @param {string[]} [exclude=[]] - Array of field names to exclude from serialization
 * @returns {Object|null} Serialized document or null if doc is falsy
 *
 * @example
 * const doc = { _id: ObjectId('...'), name: 'test', secret: 'hidden' };
 * const serialized = serializeDoc(doc, ['secret']);
 * // Result: { _id: '...', name: 'test' }
 */
export function serializeDoc(doc, exclude = []) {
  if (!doc) return null;
  /** @type {Record<string, any>} */
  const serialized = {};
  for (const [key, value] of Object.entries(doc)) {
    if (exclude.includes(key)) continue;
    if (value instanceof ObjectId) {
      serialized[key] = value.toString();
    } else if (value instanceof Date) {
      serialized[key] = value.toISOString();
    } else if (typeof value === 'object' && value !== null) {
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
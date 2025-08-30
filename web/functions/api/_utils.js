import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';

const DB_NAME = 'cypi';

let client;
let db;

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  try {
    // Always create a new connection in serverless environment to avoid stale connections
    const newClient = new MongoClient(mongoUri, {
      maxPoolSize: 1, // Limit connection pool size
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 10000, // 10 second socket timeout
    });

    await newClient.connect();
    return newClient.db(DB_NAME);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

export function serializeDoc(doc, exclude = []) {
  if (!doc) return null;
  const serialized = {};
  for (const [key, value] of Object.entries(doc)) {
    if (exclude.includes(key)) continue;
    if (value instanceof ObjectId) {
      serialized[key] = value.toString();
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

export function hashEditCode(editCode) {
  return crypto.createHash('sha256').update(editCode).digest('hex');
}
import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'cypi';

let client;
let db;

async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

function serializeDoc(doc, exclude = []) {
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

function hashEditCode(editCode) {
  return crypto.createHash('sha256').update(editCode).digest('hex');
}

export async function onRequestPut({ request, env, params }) {
  const rhid = parseInt(params.rhid);
  const body = await request.json();
  const { edit_code, name, description, rhid: newRhid } = body;

  await connectDB();
  const existingPackage = await db.collection('packages').findOne({ rhid });
  if (!existingPackage) {
    return new Response(JSON.stringify({ detail: 'Package not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  if (existingPackage.edit_code !== hashEditCode(edit_code.trim())) {
    return new Response(JSON.stringify({ detail: 'Edit code does not match' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const updateFields = {};
  if (name !== undefined && name !== existingPackage.name) {
    const existingName = await db.collection('packages').findOne({ name, _id: { $ne: existingPackage._id } });
    if (existingName) {
      return new Response(JSON.stringify({ detail: 'Package name is already taken' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    updateFields.name = name;
  }
  if (description !== undefined) updateFields.description = description;
  if (newRhid !== undefined && newRhid !== existingPackage.rhid) {
    const existingRhid = await db.collection('packages').findOne({ rhid: newRhid, _id: { $ne: existingPackage._id } });
    if (existingRhid) {
      return new Response(JSON.stringify({ detail: 'Package RHID is already taken. If someone has uploaded your package here and you want it removed, please [contact us](https://tally.so/r/mVXylJ). Support is checked regularly.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    updateFields.rhid = newRhid;
  }

  if (Object.keys(updateFields).length === 0) {
    return new Response(JSON.stringify(serializeDoc(existingPackage, ['edit_code'])), { headers: { 'Content-Type': 'application/json' } });
  }

  await db.collection('packages').updateOne({ _id: existingPackage._id }, { $set: updateFields });
  const updated = await db.collection('packages').findOne({ _id: existingPackage._id });
  return new Response(JSON.stringify(serializeDoc(updated, ['edit_code'])), { headers: { 'Content-Type': 'application/json' } });
}
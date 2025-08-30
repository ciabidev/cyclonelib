import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname.replace('/api', ''); // assuming functions are at /api
    path = path.replace(/\/$/, ''); // remove trailing slash
    const method = request.method;

    await connectDB();

    if (path === '/packages' && method === 'GET') {
      const name = url.searchParams.get('name');
      const rhid = url.searchParams.get('rhid');
      const query = {};
      if (name) query.name = { $regex: name, $options: 'i' };
      if (rhid) query.rhid = { $regex: rhid, $options: 'i' };
      const docs = await db.collection('packages').find(query).limit(100).toArray();
      const result = docs.map(doc => serializeDoc(doc, ['edit_code']));
      return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
    }

    if (path === '/packages' && method === 'POST') {
      const body = await request.json();
      const { edit_code, name, description, rhid } = body;
      const packageDict = { name, description, rhid, edit_code: hashEditCode(edit_code) };

      const existingName = await db.collection('packages').findOne({ name });
      if (existingName) {
        return new Response(JSON.stringify({ detail: 'Package name is already taken' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
      }

      const existingRhid = await db.collection('packages').findOne({ rhid });
      if (existingRhid) {
        return new Response(JSON.stringify({ detail: 'Package RHID is already taken...' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
      }

      const result = await db.collection('packages').insertOne(packageDict);
      const created = await db.collection('packages').findOne({ _id: result.insertedId });
      return new Response(JSON.stringify(serializeDoc(created)), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    if (path.startsWith('/packages/') && method === 'PUT') {
      const rhid = parseInt(path.split('/')[2]);
      const body = await request.json();
      const { edit_code, name, description, rhid: newRhid } = body;

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
          return new Response(JSON.stringify({ detail: 'Package RHID is already taken...' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
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

    if (path === '/links' && method === 'GET') {
      const links = { "discord": "https://discord.gg/UYgGdEwGsK", "docs": "https://cyclone.fibery.io/@public", "suggestions": "https://tally.so/r/mVXylJ" };
      return new Response(JSON.stringify(links), { headers: { 'Content-Type': 'application/json' } });
    }

    if (path === '/versions' && method === 'GET') {
      const versions = { "0.0.1": "50425", "0.1.1": "50478", "0.2.2": "50707", "1.2.5": "50844", "2.0.0": "54390", "2.0.1": "54408", "2.0.2": "54423", "2.1.2": "54441", "2.1.7": "54482", "2.2.0": "55349", "latest (2.2.0)": "55349" };
      return new Response(JSON.stringify(versions), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Not Found', { status: 404 });
  }
};
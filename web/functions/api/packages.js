import { connectDB, serializeDoc, hashEditCode } from './_utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name');
  const rhid = url.searchParams.get('rhid');

  await connectDB();
  const query = {};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (rhid) query.rhid = { $regex: rhid, $options: 'i' };
  const docs = await db.collection('packages').find(query).limit(100).toArray();
  const result = docs.map(doc => serializeDoc(doc, ['edit_code']));
  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
}

export async function onRequestPost({ request, env }) {
  const body = await request.json();
  const { edit_code, name, description, rhid } = body;
  const packageDict = { name, description, rhid, edit_code: hashEditCode(edit_code) };

  await connectDB();
  const existingName = await db.collection('packages').findOne({ name });
  if (existingName) {
    return new Response(JSON.stringify({ detail: 'Package name is already taken' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
  }

  const existingRhid = await db.collection('packages').findOne({ rhid });
  if (existingRhid) {
    return new Response(JSON.stringify({ detail: 'Package RHID is already taken. If someone has uploaded your package here and you want it removed, please [contact us](https://tally.so/r/mVXylJ). Support is checked regularly.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
  }

  const result = await db.collection('packages').insertOne(packageDict);
  const created = await db.collection('packages').findOne({ _id: result.insertedId });
  return new Response(JSON.stringify(serializeDoc(created)), { status: 201, headers: { 'Content-Type': 'application/json' } });
}

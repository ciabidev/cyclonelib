import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';


export async function PUT({ request, params }) {
  const mongoUri = process.env.MONGO_URI;
  const { rhid } = params;

  if (!mongoUri) {
    throw error(500, {
      message: 'Database configuration missing. MONGO_URI environment variable not set.'
    });
  }

  try {
    const { edit_code, name, description, rhid: newRhid } = await request.json();

    const db = await connectDB();
    const existingPackage = await db.collection('packages').findOne({ rhid: parseInt(rhid) });

    if (!existingPackage) {
      throw error(404, { message: 'Package not found' });
    }

    if (existingPackage.edit_code !== hashEditCode(edit_code.trim())) {
      throw error(403, { message: 'Edit code does not match' });
    }

    const updateFields = {};
    if (name !== undefined && name !== existingPackage.name) {
      const existingName = await db.collection('packages').findOne({ name, _id: { $ne: existingPackage._id } });
      if (existingName) {
        throw error(409, { message: 'Package name is already taken' });
      }
      updateFields.name = name;
    }
    if (description !== undefined) updateFields.description = description;
    if (newRhid !== undefined && newRhid !== existingPackage.rhid) {
      const existingRhidCheck = await db.collection('packages').findOne({ rhid: newRhid, _id: { $ne: existingPackage._id } });
      if (existingRhidCheck) {
        throw error(409, {
          message: 'Package RHID is already taken. If someone has uploaded your package here and you want it removed, please contact us.'
        });
      }
      updateFields.rhid = newRhid;
    }

    if (Object.keys(updateFields).length === 0) {
      return json(serializeDoc(existingPackage, ['edit_code']), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    await db.collection('packages').updateOne({ _id: existingPackage._id }, { $set: updateFields });
    const updated = await db.collection('packages').findOne({ _id: existingPackage._id });
    return json(serializeDoc(updated, ['edit_code']), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    if (err.status) throw err; // Re-throw SvelteKit errors
    console.error('Database error in PUT /api/packages/[rhid]:', err);
    throw error(500, {
      message: 'Failed to update package'
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
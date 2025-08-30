import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';
import type { RequestHandler } from './$types.js';

/**
 * PATCH /api/packages/[rhid]
 * Update a package
 *
 * @param {Object} options - Request options
 * @param {Request} options.request - HTTP request with package data
 * @param {Object} options.params - URL parameters
 * @param {string} options.params.rhid - Package RHID
 * @returns {Promise<Response>} JSON response with updated package
 *
 * @body {Object} data - Update data
 * @body {string} data.edit_code - Edit code for verification
 * @body {string} [data.name] - New package name
 * @body {string} [data.description] - New package description
 * @body {number} [data.rhid] - New package RHID
 *
 * @example
 * PATCH /api/packages/12345
 * Body: {
 *   "edit_code": "secret123",
 *   "name": "Updated Package Name"
 * }
 *
 * Response: {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "Updated Package Name",
 *   "description": "A useful package",
 *   "rhid": 12345
 * }
 *
 * @throws {404} If package not found
 * @throws {403} If edit code does not match
 * @throws {409} If new name or RHID already exists
 * @throws {500} If database connection fails
 */
export const PATCH: RequestHandler = async ({ request, params }) => {
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

    const updateFields: Record<string, any> = {};
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
          'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    await db.collection('packages').updateOne({ _id: existingPackage._id }, { $set: updateFields });
    const updated = await db.collection('packages').findOne({ _id: existingPackage._id });
    if (!updated) {
      throw error(500, { message: 'Failed to retrieve updated package' });
    }
    return json(serializeDoc(updated, ['edit_code']), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err: any) {
    if (err.status) throw err; // Re-throw SvelteKit errors
    console.error('Database error in PATCH /api/packages/[rhid]:', err);
    throw error(500, {
      message: 'Failed to update package'
    });
  }
}

/**
 * DELETE /api/packages/[rhid]
 * Delete a package
 *
 * @param {Object} options - Request options
 * @param {Request} options.request - HTTP request with edit_code
 * @param {Object} options.params - URL parameters
 * @param {string} options.params.rhid - Package RHID
 * @returns {Promise<Response>} JSON response confirming deletion
 *
 * @body {Object} data - Request data
 * @body {string} data.edit_code - Edit code for verification
 *
 * @example
 * DELETE /api/packages/12345
 * Body: {
 *   "edit_code": "secret123"
 * }
 *
 * Response: {
 *   "message": "Package deleted successfully"
 * }
 *
 * @throws {404} If package not found
 * @throws {403} If edit code does not match
 * @throws {500} If database connection fails
 */
export const DELETE: RequestHandler = async ({ request, params }) => {
  const mongoUri = process.env.MONGO_URI;
  const { rhid } = params;

  if (!mongoUri) {
    throw error(500, {
      message: 'Database configuration missing. MONGO_URI environment variable not set.'
    });
  }

  try {
    const { edit_code } = await request.json();

    const db = await connectDB();
    const existingPackage = await db.collection('packages').findOne({ rhid: parseInt(rhid) });

    if (!existingPackage) {
      throw error(404, { message: 'Package not found' });
    }

    if (existingPackage.edit_code !== hashEditCode(edit_code.trim())) {
      throw error(403, { message: 'Edit code does not match' });
    }

    await db.collection('packages').deleteOne({ _id: existingPackage._id });

    return json({ message: 'Package deleted successfully' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err: any) {
    if (err.status) throw err; // Re-throw SvelteKit errors
    console.error('Database error in DELETE /api/packages/[rhid]:', err);
    throw error(500, {
      message: 'Failed to delete package'
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
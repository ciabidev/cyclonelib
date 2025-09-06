import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';
import type { RequestHandler } from './$types.js';

/**
 * GET /api/packages/[name]
 * Retrieve a package
 *
 * @param {Object} options - Request options
 * @param {Object} options.params - URL parameters
 * @param {string} options.params.name - Package name
 * @returns {Promise<Response>} JSON response with package data
 *
 * @example
 * GET /api/packages/my-package-name
 *
 * Response: {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "my-package-name",
 *   "description": "A useful package",
 *   "download_url": "https://routinehub.co/shortcut/12345?shortcut_name=Simple%20Base64"
 * }
 *
 * @throws {404} If package not found
 * @throws {500} If database connection fails
 */
export const GET: RequestHandler = async ({ params }) => {
  const mongoUri = process.env.MONGO_URI;
  const { name } = params;

  if (!mongoUri) {
    throw error(500, {
      message: 'Database configuration missing. MONGO_URI environment variable not set.'
    });
  }

  try {
    const db = await connectDB();
    const packageDoc = await db.collection('packages').findOne({ name });

    if (!packageDoc) {
      throw error(404, { message: 'Package not found' });
    }

    return json(serializeDoc(packageDoc, ['edit_code']), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err: any) {
    if (err.status) throw err; // Re-throw SvelteKit errors
    console.error('Database error in GET /api/packages/[name]:', err);
    throw error(500, {
      message: 'Failed to retrieve package'
    });
  }
};

/**
 * PATCH /api/packages/[name]
 * Update a package
 *
 * @param {Object} options - Request options
 * @param {Request} options.request - HTTP request with package data
 * @param {Object} options.params - URL parameters
 * @param {string} options.params.name - Package name
 * @returns {Promise<Response>} JSON response with updated package
 *
 * @body {Object} data - Update data
 * @body {string} data.edit_code - Edit code for verification
 * @body {string} [data.name] - New package name
 * @body {string} [data.short_description] - New short description
 * @body {string} [data.long_description] - New long description (supports markdown)
 * @body {string} [data.download_url] - New Download URL
 *
 * @example
 * PATCH /api/packages/my-package-name
 * Body: {
 *   "edit_code": "secret123",
 *   "name": "updated-package-name"
 * }
 *
 * Response: {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "updated-package-name",
 *   "description": "A useful package",
 *   "download_url": "https://routinehub.co/shortcut/12345?shortcut_name=Simple%20Base64"
 * }
 *
 * @throws {404} If package not found
 * @throws {403} If edit code does not match
 * @throws {409} If new name already exists
 * @throws {400} If download_url validation fails
 * @throws {500} If database connection fails
 */
export const PATCH: RequestHandler = async ({ request, params }) => {
  const mongoUri = process.env.MONGO_URI;
  const { name } = params;

  if (!mongoUri) {
    throw error(500, {
      message: 'Database configuration missing. MONGO_URI environment variable not set.'
    });
  }

  try {
    const { edit_code, name: newName, short_description, long_description, download_url } = await request.json();

    const db = await connectDB();
    const existingPackage = await db.collection('packages').findOne({ name });

    if (!existingPackage) {
      throw error(404, { message: 'Package not found' });
    }

    if (existingPackage.edit_code !== hashEditCode(edit_code.trim())) {
      throw error(403, { message: 'Edit code does not match' });
    }

    const updateFields: Record<string, any> = {};
    if (newName !== undefined && newName !== existingPackage.name) {
      // Validate package name format
      if (!/^[a-z0-9-]+$/.test(newName)) {
        throw error(400, { message: 'Package name must contain only lowercase letters, numbers, and hyphens' });
      }
      // Validate package name length
      if (newName.length > 214) {
        throw error(400, { message: 'Package name must be 214 characters or less' });
      }

      const existingName = await db.collection('packages').findOne({ name: newName, _id: { $ne: existingPackage._id } });
      if (existingName) {
        throw error(409, { message: 'Package name is already taken' });
      }
      updateFields.name = newName;
    }
    if (short_description !== undefined) updateFields.short_description = short_description;
    if (long_description !== undefined) updateFields.long_description = long_description;
    if (download_url !== undefined && download_url !== existingPackage.download_url) {
      // Validate download_url contains shortcut_name query parameter
      try {
        const url = new URL(download_url);
        const shortcutName = url.searchParams.get('shortcut_name');
        if (!shortcutName) {
          throw error(400, { message: 'Download URL must include ?shortcut_name= query parameter' });
        }
      } catch (urlError) {
        throw error(400, { message: 'Invalid Download URL format' });
      }
      updateFields.download_url = download_url;
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
    console.error('Database error in PATCH /api/packages/[name]:', err);
    throw error(500, {
      message: 'Failed to update package'
    });
  }
};

/**
 * DELETE /api/packages/[name]
 * Delete a package
 *
 * @param {Object} options - Request options
 * @param {Request} options.request - HTTP request with edit_code
 * @param {Object} options.params - URL parameters
 * @param {string} options.params.name - Package name
 * @returns {Promise<Response>} JSON response confirming deletion
 *
 * @body {Object} data - Request data
 * @body {string} data.edit_code - Edit code for verification
 *
 * @example
 * DELETE /api/packages/my-package-name
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
  const { name } = params;

  if (!mongoUri) {
    throw error(500, {
      message: 'Database configuration missing. MONGO_URI environment variable not set.'
    });
  }

  try {
    const { edit_code } = await request.json();

    const db = await connectDB();
    const existingPackage = await db.collection('packages').findOne({ name });

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
    console.error('Database error in DELETE /api/packages/[name]:', err);
    throw error(500, {
      message: 'Failed to delete package'
    });
  }
};

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
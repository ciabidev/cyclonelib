import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc } from '$lib/server/db-utils.js';


export async function GET({ url }) {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw error(500, {
      message: 'Database configuration missing. MONGO_URI environment variable not set.'
    });
  }

  try {
    const name = url.searchParams.get('name');
    const rhid = url.searchParams.get('rhid');

    const db = await connectDB();
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (rhid) query.rhid = { $regex: rhid, $options: 'i' };

    // Add timeout to prevent hanging
    const docs = await Promise.race([
      db.collection('packages').find(query).sort({ created_at: -1 }).limit(100).toArray(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 30000)
      )
    ]);

    const result = docs.map(doc => serializeDoc(doc, ['edit_code']));
    return json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    console.error('Database error in GET /api/packages:', err);
    throw error(500, {
      message: 'Failed to fetch packages from database'
    });
  }
}

/**
 * POST /api/packages
 * Create a new package
 *
 * @param {Object} options - Request options
 * @param {Request} options.request - HTTP request with package data
 * @returns {Promise<Response>} JSON response with created package
 *
 * @body {Object} package - Package data
 * @body {string} package.name - Package name (must be unique)
 * @body {string} package.short_description - Short description
 * @body {string} package.long_description - Long description (supports markdown)
 * @body {number} package.rhid - Package RHID (must be unique)
 * @body {string} package.edit_code - Edit code for future modifications
 * @body {Date} package.created_at - Creation timestamp (auto-generated)
 *
 * @example
 * POST /api/packages
 * Body: {
 *   "name": "My Package",
 *   "description": "A useful package",
 *   "rhid": 12345,
 *   "edit_code": "secret123"
 * }
 *
 * Response: {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "My Package",
 *   "description": "A useful package",
 *   "rhid": 12345
 * }
 *
 * @throws {409} If package name or RHID already exists
 * @throws {500} If database connection fails
 */
export async function POST({ request }) {
  console.log('POST /api/packages called');
  const mongoUri = process.env.MONGO_URI;
  console.log('MONGO_URI available:', !!mongoUri);

  if (!mongoUri) {
    throw error(500, {
      message: 'Database configuration missing. MONGO_URI environment variable not set.'
    });
  }

  try {
    const { edit_code, name, short_description, long_description, rhid } = await request.json();
    console.log('Received data:', { name, short_description, long_description, rhid, edit_code: edit_code ? '[REDACTED]' : undefined });
    const { connectDB, serializeDoc, hashEditCode } = await import('$lib/server/db-utils.js');

    const db = await connectDB();

    // Check for existing name
    const existingName = await db.collection('packages').findOne({ name });
    if (existingName) {
      throw error(409, { message: 'Package name is already taken' });
    }

    // Check for existing rhid
    const existingRhid = await db.collection('packages').findOne({ rhid });
    if (existingRhid) {
      throw error(409, {
        message: 'Package RHID is already taken. If someone has uploaded your package here and you want it removed, please contact us.'
      });
    }

    const packageDict = {
      name,
      short_description,
      long_description,
      rhid,
      edit_code: hashEditCode(edit_code),
      created_at: new Date()
    };
    const result = await db.collection('packages').insertOne(packageDict);
    const created = await db.collection('packages').findOne({ _id: result.insertedId });

    return json(serializeDoc(created), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    if (err.status) throw err; // Re-throw SvelteKit errors
    console.error('Database error in POST /api/packages:', err);
    throw error(500, {
      message: 'Failed to create package'
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
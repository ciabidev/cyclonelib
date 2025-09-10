import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc } from '$lib/server/db-utils.js';


export async function GET({ url }) {
	try {
		const name = url.searchParams.get('name');

		const db = await connectDB();
		let query = db.from('packages').select('*').order('created_at', { ascending: false }).limit(100);

		if (name) {
			query = query.ilike('name', `%${name}%`);
		}

		const { data: docs, error: dbError } = await query;

		if (dbError) {
			console.error('Supabase error:', dbError);
			throw error(500, { message: 'Database query failed' });
		}

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
 * @body {string} package.name - Package name (must be unique, lowercase with hyphens)
 * @body {string} package.short_description - Short description
 * @body {string} package.long_description - Long description (supports markdown)
 * @body {string} package.download_url - Download URL with ?shortcut_name= query parameter (shortcut name can be different from package name)
 * @body {string} package.shortcut_name - Shortcut name extracted from download_url query parameter (auto-generated)
 * @body {string} package.edit_code - Edit code for future modifications
 * @body {Date} package.created_at - Creation timestamp (auto-generated)
 *
 * @example
 * POST /api/packages
 * Body: {
 *   "name": "my-shortcut-package",
 *   "description": "A useful package",
 *   "download_url": "https://www.icloud.com/shortcuts/32751811e2f04de99abff36399fa2bd7?shortcut_name=Simple%20Base64",
 *   "edit_code": "secret123"
 * }
 *
 * Response: {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "my-shortcut-package",
 *   "short_description": "A useful package",
 *   "download_url": "https://www.icloud.com/shortcuts/32751811e2f04de99abff36399fa2bd7?shortcut_name=Simple%20Base64",
 *   "shortcut_name": "Simple Base64"
 * }
 *
 * @throws {409} If package name already exists
 * @throws {400} If package name format is invalid or download_url validation fails
 * @throws {500} If database connection fails
 */
export async function POST({ request }) {
  console.log('POST /api/packages called');

  try {
    const { edit_code, name, short_description, long_description, download_url } = await request.json();
    // download_url is now optional for versioning system
    console.log('Received data:', { name, short_description, long_description, download_url, edit_code: edit_code ? '[REDACTED]' : undefined });
    const { connectDB, serializeDoc, hashEditCode } = await import('$lib/server/db-utils.js');

    // Validate package name format (lowercase with hyphens)
    if (!/^[a-z0-9-]+$/.test(name)) {
      throw error(400, { message: 'Package name must contain only lowercase letters, numbers, and hyphens' });
    }

    // Validate package name length
    if (name.length > 214) {
      throw error(400, { message: 'Package name must be 214 characters or less' });
    }

    // Validate download_url contains shortcut_name query parameter (optional for versioning system)
    let shortcutName = null;
    if (download_url) {
      let url;
      try {
        url = new URL(download_url);
      } catch (urlError) {
        throw error(400, { message: 'Invalid URL format. Please enter a valid URL.' });
      }

      shortcutName = url.searchParams.get('shortcut_name');
      if (!shortcutName) {
        throw error(400, { message: 'Download URL must include ?shortcut_name= query parameter' });
      }
    }

    const db = await connectDB();

    // Check for existing name
    const { data: existingName, error: checkError } = await db
      .from('packages')
      .select('name')
      .eq('name', name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Supabase error checking existing name:', checkError);
      throw error(500, { message: 'Database query failed' });
    }

    if (existingName) {
      throw error(409, { message: 'Package name is already taken' });
    }

    const packageDict = {
      name,
      short_description,
      long_description,
      download_url,
      shortcut_name: shortcutName,
      edit_code: await hashEditCode(edit_code),
      created_at: new Date().toISOString()
    };

    const { data: created, error: insertError } = await db
      .from('packages')
      .insert(packageDict)
      .select()
      .single();

    if (insertError) {
      console.error('Supabase error inserting package:', insertError);
      throw error(500, { message: 'Failed to create package' });
    }

    return json(serializeDoc(created), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) throw err; // Re-throw SvelteKit errors
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
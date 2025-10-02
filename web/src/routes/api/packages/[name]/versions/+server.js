import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';

/**
 * GET /api/packages/[name]/versions
 * Retrieves all versions for a specific package.
 * @returns {Promise<Response>} JSON response with array of version data
 */
export async function GET({ params }) {
	const { name } = params;

	try {
		const db = await connectDB();
		const { data: versions, error: dbError } = await db
			.from('versions')
			.select('*')
			.eq('package_name', name)
			.order('created_at', { ascending: false });

		if (dbError) {
			console.error('Supabase error:', dbError);
			throw error(500, { message: 'Database query failed' });
		}

		return json(versions.map(doc => serializeDoc(doc)), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			}
		});
	} catch (err) {
		console.error('Database error in GET /api/packages/[name]/versions:', err);
		throw error(500, {
			message: 'Failed to fetch versions'
		});
	}
}

/**
 * POST /api/packages/[name]/versions
 * Creates a new version for a package.
 * Expects JSON body with version_number, patch_notes, download_url, edit_code.
 * @returns {Promise<Response>} JSON response with created version data
 */
export async function POST({ request, params }) {
	const { name } = params;

	try {
		const { version_number, patch_notes, download_url, edit_code } = await request.json();

		// Validate download_url contains shortcut_name query parameter
		let url;
		try {
			url = new URL(download_url);
		} catch (urlError) {
			throw error(400, { message: 'Invalid URL format. Please enter a valid URL.' });
		}

		const shortcutName = url.searchParams.get('shortcut_name');
		if (!shortcutName) {
			throw error(400, { message: 'Download URL must include ?shortcut_name= query parameter' });
		}

		const db = await connectDB();

		// Check if package exists
		const { data: packageDoc, error: packageError } = await db
			.from('packages')
			.select('name, edit_code')
			.eq('name', name)
			.maybeSingle();

		if (packageError) {
			console.error('Supabase error checking package:', packageError);
			throw error(500, { message: 'Database query failed' });
		}

		if (!packageDoc) {
			throw error(404, { message: 'Package not found' });
		}

		// Check for existing version number
		const { data: existingVersion, error: versionError } = await db
			.from('versions')
			.select('version_number')
			.eq('package_name', name)
			.eq('version_number', version_number)
			.maybeSingle();

		if (versionError) {
			console.error('Supabase error checking version:', versionError);
			throw error(500, { message: 'Database query failed' });
		}

		if (existingVersion) {
			throw error(409, { message: 'Version number already exists for this package' });
		}

		if (packageDoc.edit_code !== await hashEditCode(edit_code.trim())) {
			throw error(403, { message: 'Edit code does not match' });
		}

		const versionDoc = {
			package_name: name,
			version_number,
			patch_notes,
			download_url,
			shortcut_name: shortcutName,
			created_at: new Date().toISOString()
		};

		const { data: created, error: insertError } = await db
			.from('versions')
			.insert(versionDoc)
			.select()
			.single();

		if (insertError) {
			console.error('Supabase error inserting version:', insertError);
			throw error(500, { message: 'Failed to create version' });
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
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('Database error in POST /api/packages/[name]/versions:', err);
		throw error(500, {
			message: 'Failed to create version'
		});
	}
}

/**
 * OPTIONS /api/packages/[name]/versions
 * Handles preflight CORS requests.
 * @returns {Promise<Response>} Empty response with CORS headers
 */
export async function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		}
	});
}
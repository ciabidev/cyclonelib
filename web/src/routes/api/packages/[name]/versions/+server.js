import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode, isValidUUID } from '$lib/server/db-utils.js';

/**
 * GET /api/packages/[name]/versions
 * Retrieves all versions for a specific package.
 * @returns {Promise<Response>} JSON response with array of version data
 */
export async function GET({ params }) {
	const { name } = params;

	try {
		const db = await connectDB();

		// Resolve package name from ID or name
		let packageDoc, packageError;
		if (isValidUUID(name)) {
			const result = await db
				.from('packages')
				.select('name')
				.or('id.eq.' + name + ',name.eq.' + name)
				.maybeSingle();
			packageDoc = result.data;
			packageError = result.error;
		} else {
			const result = await db
				.from('packages')
				.select('name')
				.eq('name', name)
				.maybeSingle();
			packageDoc = result.data;
			packageError = result.error;
		}

		if (packageError || !packageDoc) {
			return new Response(JSON.stringify({ message: 'Package not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const packageName = packageDoc.name;

		const { data: versions, error: dbError } = await db
			.from('versions')
			.select('*')
			.eq('package_name', packageName)
			.order('created_at', { ascending: false });

		if (dbError) {
			console.error('Supabase error:', dbError);
			return new Response(JSON.stringify({ message: dbError?.message || String(dbError) }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
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
			message: err.message
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

		// Validate download_url starts with allowed prefixes and contains shortcut_name query parameter
		if (!download_url.startsWith('https://www.icloud.com/shortcuts') && !download_url.startsWith('https://routinehub.co/download')) {
			return new Response(JSON.stringify({ message: 'Download URL must begin with https://www.icloud.com/shortcuts or https://routinehub.co/download' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		let url;
		try {
			url = new URL(download_url);
		} catch (urlError) {
			return new Response(JSON.stringify({ message: 'Invalid URL format. Please enter a valid URL.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const shortcutName = url.searchParams.get('shortcut_name');
		if (!shortcutName) {
			return new Response(JSON.stringify({ message: 'Download URL must include ?shortcut_name= query parameter' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const db = await connectDB();

		// Check if package exists
		let packageDoc, packageError;
		if (isValidUUID(name)) {
			const result = await db
				.from('packages')
				.select('name, edit_code')
				.or('id.eq.' + name + ',name.eq.' + name)
				.maybeSingle();
			packageDoc = result.data;
			packageError = result.error;
		} else {
			const result = await db
				.from('packages')
				.select('name, edit_code')
				.eq('name', name)
				.maybeSingle();
			packageDoc = result.data;
			packageError = result.error;
		}

		if (packageError) {
			console.error('Supabase error checking package:', packageError);
			return new Response(JSON.stringify({ message: packageError?.message || String(packageError) }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (!packageDoc) {
			return new Response(JSON.stringify({ message: 'Package not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const packageName = packageDoc.name;

		// Check for existing version number
		const { data: existingVersion, error: versionError } = await db
			.from('versions')
			.select('version_number')
			.eq('package_name', packageName)
			.eq('version_number', version_number)
			.maybeSingle();

		if (versionError) {
			console.error('Supabase error checking version:', versionError);
			return new Response(JSON.stringify({ message: versionError?.message || String(versionError) }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (existingVersion) {
			return new Response(JSON.stringify({ message: 'Version number already exists for this package' }), {
				status: 409,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (packageDoc.edit_code !== await hashEditCode(edit_code.trim())) {
			return new Response(JSON.stringify({ message: 'Edit code does not match' }), {
				status: 403,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const versionDoc = {
			package_name: packageName,
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
			console.error('Supabase error inserting:', insertError);
			return new Response(JSON.stringify({ message: insertError?.message || String(insertError) }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
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
		if (err && typeof err === 'object' && 'status' in err) throw err; // preserve HTTP errors
		console.error('Database error in GET /api/packages/[name]/versions:', err);
		return new Response(JSON.stringify({ message: err?.message || String(err) }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
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
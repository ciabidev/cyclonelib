import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';



/** get the latest version via created_at */
async function get_latest_version(name) {
	const db = await connectDB();
	const { data: versionDoc, error: dbError } = await db
		.from('versions')
		.select('*')
		.eq('package_name', name)
		.order('created_at', { ascending: false })
		.limit(1) /* .single() expects exactly one result */
		.single();

	if (dbError) {
		if (dbError.code === 'PGRST116') { // Not found
			throw error(404, { message: 'No versions found' });
		}
		console.error('Supabase error:', dbError);
		throw error(500, { message: dbError?.message || String(dbError) });
	}

	return json(serializeDoc(versionDoc), {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		}
	});
}	

/**
 * GET /api/packages/[name]/versions/[version]
 * Retrieves a specific version of a package. Use /versions/latest to get the latest version.
 * @returns {Promise<Response>} JSON response with version data
 */

export async function GET({ params }) {
	const { name, version } = params;

	try {
		const db = await connectDB();
		const { data: versionDoc, error: dbError } = await db
			.from('versions')
			.select('*')
			.eq('package_name', name)
			.eq('version_number', decodeURIComponent(version))
			.single();
		
		if (version === "latest") {
			return get_latest_version(name);
		}

		if (dbError) {
			if (dbError.code === 'PGRST116') { // Not found
				throw error(404, { message: 'Version not found' });
			}
			console.error(dbError.message);
			throw error(500, { message: dbError.message });
		}

		return json(serializeDoc(versionDoc), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			}
		});
	} catch (err) {
		throw error(500, {
			message: err?.message || String(err)
		});
	}
}

/**
 * PATCH /api/packages/[name]/versions/[version]
 * Updates a specific version of a package.
 * Expects JSON body with edit_code and optional fields to update.
 * @returns {Promise<Response>} JSON response with updated version data
 */
export async function PATCH({ request, params }) {
	const { name, version } = params;

	try {
		const { version_number, patch_notes, download_url, edit_code } = await request.json();

		if (!edit_code || !edit_code.trim()) {
			throw error(400, { message: 'Edit code is required to update version' });
		}

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

		// Check if package exists and validate edit code
		const { data: packageDoc, error: packageError } = await db
			.from('packages')
			.select('*')
			.eq('name', name)
			.single();

		if (packageError) {
			if (packageError.code === 'PGRST116') { // Not found
				throw error(404, { message: 'Package not found' });
			}
			console.error('Supabase error checking package:', packageError);
			throw error(500, { message: packageError?.message || String(packageError) });
		}

		if (packageDoc.edit_code !== await hashEditCode(edit_code.trim())) {
			throw error(403, { message: 'Edit code does not match' });
		}

		// Check if version exists
		const { data: existingVersion, error: versionError } = await db
			.from('versions')
			.select('*')
			.eq('package_name', name)
			.eq('version_number', decodeURIComponent(version))
			.single();

		if (versionError) {
			if (versionError.code === 'PGRST116') { // Not found
				throw error(404, { message: 'Version not found' });
			}
			console.error('Supabase error checking version:', versionError);
			throw error(500, { message: versionError?.message || String(versionError) });
		}

		// Check for version number conflict if changing version number
		if (version_number !== existingVersion.version_number) {
			const { data: versionConflict, error: conflictError } = await db
				.from('versions')
				.select('version_number')
				.eq('package_name', name)
				.eq('version_number', version_number)
				.neq('id', existingVersion.id)
				.single();

			if (conflictError && conflictError.code !== 'PGRST116') {
				console.error('Supabase error checking conflict:', conflictError);
				throw error(500, { message: conflictError?.message || String(conflictError) });
			}

			if (versionConflict) {
				throw error(409, { message: 'Version number already exists for this package' });
			}
		}

		const updateFields = {
			version_number,
			patch_notes,
			download_url,
			shortcut_name: shortcutName
		};

		const { data: updated, error: updateError } = await db
			.from('versions')
			.update(updateFields)
			.eq('id', existingVersion.id)
			.select()
			.single();

		if (updateError) {
			console.error('Supabase error updating:', updateError);
			throw error(500, { message: updateError?.message || String(updateError) });
		}

		return json(serializeDoc(updated), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			}
		});
	} catch (err) {
		console.error('Database error in PATCH /api/packages/[name]/versions/[version]:', err);
		throw error(500, {
			message: err?.message || String(err)
		});
	}
}

/**
 * OPTIONS /api/packages/[name]/versions/[version]
 * Handles preflight CORS requests.
 * @returns {Promise<Response>} Empty response with CORS headers
 */
export async function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		}
	});
}
import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc } from '$lib/server/db-utils.js';

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

export async function POST({ request, params }) {
	const { name } = params;

	try {
		const { version_number, patch_notes, download_url } = await request.json();

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
			.select('name')
			.eq('name', name)
			.single();

		if (packageError) {
			if (packageError.code === 'PGRST116') { // Not found
				throw error(404, { message: 'Package not found' });
			}
			console.error('Supabase error checking package:', packageError);
			throw error(500, { message: 'Database query failed' });
		}

		// Check for existing version number
		const { data: existingVersion, error: versionError } = await db
			.from('versions')
			.select('version_number')
			.eq('package_name', name)
			.eq('version_number', version_number)
			.single();

		if (versionError && versionError.code !== 'PGRST116') {
			console.error('Supabase error checking version:', versionError);
			throw error(500, { message: 'Database query failed' });
		}

		if (existingVersion) {
			throw error(409, { message: 'Version number already exists for this package' });
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
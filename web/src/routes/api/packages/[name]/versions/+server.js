import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc } from '$lib/server/db-utils.js';

export async function GET({ params }) {
	const mongoUri = process.env.MONGO_URI;
	const { name } = params;

	if (!mongoUri) {
		throw error(500, {
			message: 'Database configuration missing. MONGO_URI environment variable not set.'
		});
	}

	try {
		const db = await connectDB();
		const versions = await db.collection('versions')
			.find({ package_name: name })
			.sort({ created_at: -1 })
			.toArray();

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
	const mongoUri = process.env.MONGO_URI;
	const { name } = params;

	if (!mongoUri) {
		throw error(500, {
			message: 'Database configuration missing. MONGO_URI environment variable not set.'
		});
	}

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
		const packageDoc = await db.collection('packages').findOne({ name });
		if (!packageDoc) {
			throw error(404, { message: 'Package not found' });
		}

		// Check for existing version number
		const existingVersion = await db.collection('versions').findOne({
			package_name: name,
			version_number
		});
		if (existingVersion) {
			throw error(409, { message: 'Version number already exists for this package' });
		}

		const versionDoc = {
			package_name: name,
			version_number,
			patch_notes,
			download_url,
			shortcut_name: shortcutName,
			created_at: new Date()
		};

		const result = await db.collection('versions').insertOne(versionDoc);
		const created = await db.collection('versions').findOne({ _id: result.insertedId });

		return json(serializeDoc(created), {
			status: 201,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			}
		});
	} catch (err) {
		if (err.status) throw err;
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
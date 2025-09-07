import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';

export async function GET({ params }) {
	const mongoUri = process.env.MONGO_URI;
	const { name, version } = params;

	if (!mongoUri) {
		throw error(500, {
			message: 'Database configuration missing. MONGO_URI environment variable not set.'
		});
	}

	try {
		const db = await connectDB();
		const versionDoc = await db.collection('versions').findOne({
			package_name: name,
			version_number: decodeURIComponent(version)
		});

		if (!versionDoc) {
			throw error(404, { message: 'Version not found' });
		}

		return json(serializeDoc(versionDoc), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			}
		});
	} catch (err) {
		if (err.status) throw err;
		console.error('Database error in GET /api/packages/[name]/versions/[version]:', err);
		throw error(500, {
			message: 'Failed to retrieve version'
		});
	}
}

export async function PATCH({ request, params }) {
	const mongoUri = process.env.MONGO_URI;
	const { name, version } = params;

	if (!mongoUri) {
		throw error(500, {
			message: 'Database configuration missing. MONGO_URI environment variable not set.'
		});
	}

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
		const packageDoc = await db.collection('packages').findOne({ name });
		if (!packageDoc) {
			throw error(404, { message: 'Package not found' });
		}

		if (packageDoc.edit_code !== hashEditCode(edit_code.trim())) {
			throw error(403, { message: 'Edit code does not match' });
		}

		// Check if version exists
		const existingVersion = await db.collection('versions').findOne({
			package_name: name,
			version_number: decodeURIComponent(version)
		});

		if (!existingVersion) {
			throw error(404, { message: 'Version not found' });
		}

		// Check for version number conflict if changing version number
		if (version_number !== existingVersion.version_number) {
			const versionConflict = await db.collection('versions').findOne({
				package_name: name,
				version_number,
				_id: { $ne: existingVersion._id }
			});
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

		await db.collection('versions').updateOne(
			{ _id: existingVersion._id },
			{ $set: updateFields }
		);

		const updated = await db.collection('versions').findOne({ _id: existingVersion._id });
		if (!updated) {
			throw error(500, { message: 'Failed to retrieve updated version' });
		}

		return json(serializeDoc(updated), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			}
		});
	} catch (err) {
		if (err.status) throw err;
		console.error('Database error in PATCH /api/packages/[name]/versions/[version]:', err);
		throw error(500, {
			message: 'Failed to update version'
		});
	}
}

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
import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';

/**
 * GET /api/packages/[name]
 * Retrieves a specific package by name.
 * @returns {Promise<Response>} JSON response with package data or error
 */
export async function GET({ params }) {
  const { name } = params;

  try {
    const db = await connectDB();
    const { data: packageDoc, error: dbError } = await db
      .from('packages')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (dbError) {
      console.error('Supabase error:', dbError);
      throw error(500, { message: dbError?.message || String(dbError) });
    }

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
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) throw err; // Re-throw SvelteKit errors
    console.error('Database error in GET /api/packages/[name]:', err);
    throw error(500, {
      message: err?.message || String(err)
    });
  }
}

/**
 * PATCH /api/packages/[name]
 * Updates an existing package.
 * Expects JSON body with edit_code and optional fields to update.
 * @returns {Promise<Response>} JSON response with updated package data or error
 */
export async function PATCH({ request, params }) {
  const { name } = params;

  try {
    const { edit_code, name: newName, short_description, long_description, download_url } = await request.json();

    const db = await connectDB();
    const { data: existingPackage, error: findError } = await db
      .from('packages')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (findError) {
      console.error('Supabase error:', findError);
      throw error(500, { message: findError?.message || String(findError) });
    }

    if (!existingPackage) {
      throw error(404, { message: 'Package not found' });
    }

    if (existingPackage.edit_code !== await hashEditCode(edit_code.trim())) {
      throw error(403, { message: 'Edit code does not match' });
    }

    const updateFields = {};
    if (newName !== undefined && newName !== existingPackage.name) {
      // Validate package name format
      if (!/^[a-z0-9-]+$/.test(newName)) {
        throw error(400, { message: 'Package name must contain only lowercase letters, numbers, and hyphens' });
      }
      // Validate package name length
      if (newName.length > 214) {
        throw error(400, { message: 'Package name must be 214 characters or less' });
      }

      const { data: existingName, error: nameCheckError } = await db
        .from('packages')
        .select('name')
        .eq('name', newName)
        .neq('id', existingPackage.id)
        .maybeSingle();

        if (nameCheckError) {
        console.error('Supabase error checking name:', nameCheckError);
        throw error(500, { message: nameCheckError.message });
      }
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

    const { data: updated, error: updateError } = await db
      .from('packages')
      .update(updateFields)
      .eq('id', existingPackage.id)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase error updating:', updateError);
      throw error(500, { message: updateError.message });
    }

    return json(serializeDoc(updated, ['edit_code']), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) throw err; // Re-throw SvelteKit errors
    console.error('Database error in PATCH /api/packages/[name]:', err);
    throw error(500, {
      message: err?.message || String(err)
    });
  }
}

/**
 * DELETE /api/packages/[name]
 * Deletes a package.
 * Expects JSON body with edit_code for authentication.
 * @returns {Promise<Response>} JSON response with success message or error
 */
export async function DELETE({ request, params }) {
  const { name } = params;

  try {
    const { edit_code } = await request.json();

    const db = await connectDB();
    const { data: existingPackage, error: findError } = await db
      .from('packages')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (findError) {
      console.error('Supabase error:', findError);
      throw error(500, { message: findError.message });
    }

    if (!existingPackage) {
      throw error(404, { message: 'Package not found' });
    }

    if (existingPackage.edit_code !== await hashEditCode(edit_code.trim())) {
      throw error(403, { message: 'Edit code does not match' });
    }

    const { error: deleteError } = await db
      .from('packages')
      .delete()
      .eq('id', existingPackage.id);
    
    if (deleteError) {
      console.error('Supabase error deleting:', deleteError);
      throw error(500, { message: deleteError.message });
    }
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) throw err; // Re-throw SvelteKit errors
    console.error('Database error in DELETE /api/packages/[name]:', err);
    throw error(500, {
      message: err?.message || String(err)
    });
  } finally {
    return json({ message: 'Package deleted successfully' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

/**
 * OPTIONS /api/packages/[name]
 * Handles preflight CORS requests.
 * @returns {Promise<Response>} Empty response with CORS headers
 */
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
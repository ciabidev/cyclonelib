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
      return new Response(JSON.stringify({ message: dbError?.message || String(dbError) }), {
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
    return new Response(JSON.stringify({ message: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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
      return new Response(JSON.stringify({ message: findError?.message || String(findError) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!existingPackage) {
      return new Response(JSON.stringify({ message: 'Package not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (existingPackage.edit_code !== await hashEditCode(edit_code.trim())) {
      return new Response(JSON.stringify({ message: 'Edit code does not match' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateFields = {};
    if (newName !== undefined && newName !== existingPackage.name) {
      // Validate package name format
      if (!/^[a-z0-9-]+$/.test(newName)) {
        return new Response(JSON.stringify({ message: 'Package name must contain only lowercase letters, numbers, and hyphens' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      // Validate package name length
      if (newName.length > 214) {
        return new Response(JSON.stringify({ message: 'Package name must be 214 characters or less' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { data: existingName, error: nameCheckError } = await db
        .from('packages')
        .select('name')
        .eq('name', newName)
        .neq('id', existingPackage.id)
        .maybeSingle();

        if (nameCheckError) {
        console.error('Supabase error checking name:', nameCheckError);
        return new Response(JSON.stringify({ message: nameCheckError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
        if (existingName) {
        return new Response(JSON.stringify({ message: 'Package name is already taken' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
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
          return new Response(JSON.stringify({ message: 'Download URL must include ?shortcut_name= query parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (urlError) {
        return new Response(JSON.stringify({ message: 'Invalid Download URL format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
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
      return new Response(JSON.stringify({ message: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
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
    return new Response(JSON.stringify({ message: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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
      return new Response(JSON.stringify({ message: findError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!existingPackage) {
      return new Response(JSON.stringify({ message: 'Package not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (existingPackage.edit_code !== await hashEditCode(edit_code.trim())) {
      return new Response(JSON.stringify({ message: 'Edit code does not match' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error: deleteError } = await db
      .from('packages')
      .delete()
      .eq('id', existingPackage.id);
    
    if (deleteError) {
      console.error('Supabase error deleting:', deleteError);
      return new Response(JSON.stringify({ message: deleteError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Successful delete - return success response here
    return json({ message: 'Package deleted successfully' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) throw err; // Re-throw SvelteKit errors
    console.error('Database error in DELETE /api/packages/[name]:', err);
    return new Response(JSON.stringify({ message: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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
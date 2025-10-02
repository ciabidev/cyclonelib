import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';

/**
 * POST /api/packages
 * Creates a new package in the database.
 * Expects JSON body with name, short_description, long_description, edit_code.
 * @returns {Promise<Response>} JSON response with success message or error
 */
export async function POST({ request }) {
  try {
    const { name, short_description, long_description, edit_code } = await request.json();

    // Validate required fields
    if (!name || !edit_code) {
      throw error(400, { message: 'Required fields are missing' });
    }

    // Validate package name format
    if (!/^[a-z0-9-]+$/.test(name)) {
      throw error(400, { message: 'Package name must contain only lowercase letters, numbers, and hyphens' });
    }

    const db = await connectDB();

    const { data: existingPackage } = await db
      .from('packages')
      .select('name')
      .eq('name', name)
      .single();

    if (existingPackage) {
      throw error(409, { message: 'Package name is already taken' });
    }

    const hashedEditCode = await hashEditCode(edit_code.trim());

    const { error: insertError } = await db
      .from('packages')
      .insert({
        name,
        short_description,
        long_description,
        edit_code: hashedEditCode,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Supabase error:', insertError);
      throw error(500, { message: 'Failed to create package' });
    }

    return json({ message: 'Package created successfully' }, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } 
  
  catch (err) {
    if (err.status) throw err;
    throw error(500, {
      message: 'Failed to create package'
    });
  }
}

/**
 * OPTIONS /api/packages
 * Handles preflight CORS requests.
 * @returns {Promise<Response>} Empty response with CORS headers
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
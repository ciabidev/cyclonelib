import { json, error } from '@sveltejs/kit';
import { connectDB, serializeDoc, hashEditCode } from '$lib/server/db-utils.js';

/**GET /api/packages
 * Retrieves a list of all packages in the database.
 * @returns {Promise<Response>} JSON response with array of package objects
 */
export async function GET() {
  try {
    const db = await connectDB();
    const { data: packages, error: dbError } = await db
      .from('packages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5000);

    if (dbError) {
      console.error('Supabase error:', dbError);
      return new Response(JSON.stringify({ message: dbError?.message || String(dbError) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return json(packages.map(doc => serializeDoc(doc, ['edit_code'])), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    console.error('Database error in GET /api/packages:', err);
    return new Response(JSON.stringify({ message: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
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
      return new Response(JSON.stringify({ message: 'Required fields are missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate package name format
    if (!/^[a-z0-9-]+$/.test(name)) {
      return new Response(JSON.stringify({ message: 'Package name must contain only lowercase letters, numbers, and hyphens' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await connectDB();

    const { data: existingPackage } = await db
      .from('packages')
      .select('name')
      .eq('name', name)
      .single();

    if (existingPackage) {
      return new Response(JSON.stringify({ message: 'Package name is already taken' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const hashedEditCode = await hashEditCode(edit_code.trim());

    const { data: created, error: insertError } = await db
      .from('packages')
      .insert({
        name,
        short_description,
        long_description,
        edit_code: hashedEditCode,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase error:', insertError);
      return new Response(JSON.stringify({ message: insertError?.message || String(insertError) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return json(serializeDoc(created, ['edit_code']), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
  
  catch (err) {
    console.error('Database error in POST /api/packages:', err);
    return new Response(JSON.stringify({ message: err?.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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

import { json } from '@sveltejs/kit';
import versions from '$lib/server/versions.json';

/**
 * GET /api/versions/v2
 * Retrieves versions grouped by service and provider.
 * @returns {Promise<Response>} JSON response with CORS headers
 */
export async function GET() {
  return json(versions, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

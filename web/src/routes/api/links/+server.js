import { json } from '@sveltejs/kit';

/**
 * GET /api/links
 * Retrieves a list of useful links for the Cyclone project.
 * @returns {Promise<Response>} JSON response containing links object with CORS headers
 */
export async function GET() {
  const links = {
    "discord": "https://discord.gg/C4UDJWXhnK",
    "docs": "https://cyclone.fibery.io/@public",
    "suggestions": "https://discord.gg/C4UDJWXhnK",
    "support": "https://discord.gg/C4UDJWXhnK",
    "source": "https://github.com/ciabidev/cyclonelib",
    "web": "https://cyclonelib.pages.dev",
    "api": "https://cyclonelib.pages.dev/api"
  };

  return json(links, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
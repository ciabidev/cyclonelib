import { json } from '@sveltejs/kit';

export async function GET() {
  const links = {
    "discord": "https://discord.gg/UYgGdEwGsK",
    "docs": "https://cyclone.fibery.io/@public",
    "suggestions": "https://tally.so/r/mVXylJ",
    "source": "https://github.com/cyclonelib/cyclonelib",
    "web": "https://cyclonelib.vercel.app",
    "api": "https://cyclonelib.vercel.app/api/docs"
  };

  return json(links, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
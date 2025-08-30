export async function onRequestGet({ request, env }) {
  const links = { "discord": "https://discord.gg/UYgGdEwGsK", "docs": "https://cyclone.fibery.io/@public", "suggestions": "https://tally.so/r/mVXylJ" };
  return new Response(JSON.stringify(links), { headers: { 'Content-Type': 'application/json' } });
}
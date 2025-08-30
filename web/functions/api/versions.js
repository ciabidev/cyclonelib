export async function onRequest({ request, env }) {
  const versions = { "0.0.1": "50425", "0.1.1": "50478", "0.2.2": "50707", "1.2.5": "50844", "2.0.0": "54390", "2.0.1": "54408", "2.0.2": "54423", "2.1.2": "54441", "2.1.7": "54482", "2.2.0": "55349", "latest (2.2.0)": "55349" };
  return new Response(JSON.stringify(versions), { headers: { 'Content-Type': 'application/json' } });
}
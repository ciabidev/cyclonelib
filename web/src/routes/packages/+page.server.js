import { connectDB, serializeDoc } from "$lib/server/db-utils";
import { error } from "@sveltejs/kit";

export async function load() {
  const db = await connectDB();
  const { data: pkgs, error: dbError } = await db.from("packages").select('*').order('created_at', { ascending: false });

  if (dbError) {
    console.error('Error fetching packages:', dbError);
    throw error(500, {
      message: 'Failed to load packages'
    });
  }

  return {
    packages: pkgs.map(doc => serializeDoc(doc))
  };
}
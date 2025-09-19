/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB, serializeDoc } from "$lib/server/db-utils";
import { error } from "@sveltejs/kit";

// @ts-ignore
export async function load() {
  const db = await connectDB();
  // @ts-ignore
  const { data: pkgs, error: dbError } = await db.from("packages").select('*').order('created_at', { ascending: false });

  if (dbError) {
    console.error('Error fetching packages:', dbError);
    throw error(500, {
      message: 'Failed to load packages'
    });
  }

  console.log(`[DEBUG] Raw packages count: ${pkgs?.length || 0}`);
  // @ts-ignore
  console.log(`[DEBUG] First few package names: ${pkgs?.slice(0, 5).map(p => p.name).join(', ') || 'none'}`);

  // @ts-ignore
  const serializedPackages = pkgs?.map(doc => serializeDoc(doc)) || [];

  console.log(`[DEBUG] Serialized packages count: ${serializedPackages?.length || 0}`);
  // @ts-ignore
  console.log(`[DEBUG] Serialized package names: ${serializedPackages?.slice(0, 5).map(p => p?.name).join(', ') || 'none'}`);

  // Check for any null/undefined packages after serialization
  // @ts-ignore
  const validPackages = serializedPackages.filter(pkg => pkg && pkg.name);
  console.log(`[DEBUG] Valid packages count: ${validPackages.length}`);

  if (validPackages.length !== serializedPackages.length) {
    console.warn(`[DEBUG] Some packages were filtered out during serialization. Original: ${serializedPackages.length}, Valid: ${validPackages.length}`);
  }

  return {
    packages: validPackages
  };
}
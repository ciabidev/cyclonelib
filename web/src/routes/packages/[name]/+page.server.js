import { connectDB, serializeDoc } from "$lib/server/db-utils";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const db = await connectDB();
  const { data: pkg, error: pkgError } = await db
    .from('packages')
    .select('*')
    .eq('name', params.name)
    .single();

  if (pkgError || !pkg) {
    console.error('Error fetching package:', pkgError);
    throw error(404, {
      message: 'Package not found'
    });
  }

  const { data: versions, error: versionsError } = await db
    .from('versions')
    .select('*')
    .eq('package_name', params.name)
    .order('created_at', { ascending: false });

  if (versionsError) {
    console.error('Error fetching versions:', versionsError);
  }

  return {
    pkg: serializeDoc(pkg, ['edit_code']),
    versions: versions ? versions.map(doc => serializeDoc(doc)) : []
  };
}
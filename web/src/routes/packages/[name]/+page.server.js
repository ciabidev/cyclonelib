import { supabase } from "$lib/supabaseClient";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const { data: pkg, error: pkgError } = await supabase
    .from('packages')
    .select('*')
    .eq('name', params.name)
    .single();

  if (pkgError || !pkg) {
    throw error(404, {
      message: 'Package not found'
    });
  }

  const { data: versions } = await supabase
    .from('versions')
    .select('*')
    .eq('package_name', params.name)
    .order('created_at', { ascending: false });

  return {
    pkg,
    versions: versions || []
  };
}
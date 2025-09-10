import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("packages").select();
  return {
    packages: data ?? [],
  };
}
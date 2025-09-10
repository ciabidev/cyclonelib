import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";

// Disable prerendering for this page since it contains actions
export const prerender = false;

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString();
    const short_description = data.get('short_description')?.toString();
    const long_description = data.get('long_description')?.toString();
    const edit_code = data.get('edit_code')?.toString();

    // Validate required fields
    if (!name || !short_description || !long_description || !edit_code) {
      return fail(400, { error: 'All fields are required' });
    }

    // Validate package name format
    if (!/^[a-z0-9-]+$/.test(name)) {
      return fail(400, { error: 'Package name must contain only lowercase letters, numbers, and hyphens' });
    }

    try {
      const { data: existingPackage } = await supabase
        .from('packages')
        .select('name')
        .eq('name', name)
        .single();

      if (existingPackage) {
        return fail(409, { error: 'Package name is already taken' });
      }

      const { error } = await supabase
        .from('packages')
        .insert({
          name,
          short_description,
          long_description,
          edit_code,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase error:', error);
        return fail(500, { error: 'Failed to create package' });
      }

      return { success: true };
    } catch (err) {
      console.error('Error creating package:', err);
      return fail(500, { error: 'Failed to create package' });
    }
  }
};
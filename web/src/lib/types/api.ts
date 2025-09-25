export type CobaltFileUrlType = "redirect" | "tunnel";

export interface Package {
  name: string;
  short_description: string;
  long_description?: string;
  edit_code: string;
  created_at: string;
}

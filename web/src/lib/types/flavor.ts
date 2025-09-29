export type Flavor = "manga" | "rain" | "desert-oasis" | "fire-nation" | "earth";
export let flavors: Flavor[] = ["manga" ,"rain", "desert-oasis", "fire-nation", "earth"];
export let dark_flavors: Flavor[] = ["fire-nation"];

export const flavor_descriptions: Record<Flavor, string> = {
    "manga": "☀️ the feeling of reading one for the first time",
    "rain": "☀️ calm skies, fresh air, and raindrops on glass",
    "desert-oasis": "☀️ katara taught aang waterbending here",
    "fire-nation": "🌙 Uncle Iroh's favorite tea flavor (coming soon!)",
    "earth": "☀️ there is no war in ba sing se."
}
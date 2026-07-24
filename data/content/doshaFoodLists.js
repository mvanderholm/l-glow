// L. Glôw Dosha-Reducing Food Lists — SCAFFOLD ONLY, no content yet.
//
// Source: transcripts 23-25 (docs/transcripts/23_vata_food_list_062126_04.txt,
// 24_pitta_food_list_062126_05.txt, 25_kapha_food_list_062126_06.txt), June
// 2026 — Thea's Vata/Pitta/Kapha reducing diets, each broken into eight
// categories with a Best / Good / Not Beneficial / Avoid tier apiece
// (confirmed identical structure across all three transcripts before
// writing this scaffold). See roadmap #38.
//
// BLOCKED: do not fill in ingredient names here without Thea's sign-off.
// The Whisper transcription of all three recordings garbled roughly 30
// ingredient names badly enough that a plain reading is genuinely
// ambiguous — "monkeys" for what's presumably "mung beans," "grass" in a
// Pitta oils list that could be flaxseed or something else, an entire
// scrambled block where the Pitta nuts and oils categories seem to have
// merged mid-recording. Every specific question is logged in
// docs/notes-transcript-23-25.md, sent to Thea for confirmation — nothing
// below should be populated from a guess, per CLAUDE.md's content-
// authorship rules ("empty is better than fabricated"). Once she responds,
// load the confirmed lists here in one pass; this file exists so that pass
// only has to fill in arrays, not decide the shape.
//
// Every tier array is intentionally empty — do not add example/placeholder
// ingredient names, even ones that seem obvious from the transcript, until
// they're confirmed.

function emptyCategory() {
  return { best: [], good: [], notBeneficial: [], avoid: [] };
}

function emptyDoshaDiet() {
  return {
    grainsAndLegumes: emptyCategory(),
    vegetables: emptyCategory(),
    fruits: emptyCategory(),
    nutsAndSeeds: emptyCategory(),
    oils: emptyCategory(),
    spices: emptyCategory(),
    dairy: emptyCategory(),
    sweeteners: emptyCategory(),
  };
}

export const doshaFoodLists = {
  vata: emptyDoshaDiet(),
  pitta: emptyDoshaDiet(),
  kapha: emptyDoshaDiet(),
};

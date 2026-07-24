// L. Glôw Herb + Food Impact Database — Thea's content, real (not draft).
// Source: docs/LGlow_Herb_Food_Impact_Database_v2_filled.docx (v2, developer
// build document). 256 A-Z entries parsed directly from the source Word
// table's cells (not a flattened-paragraph guess — the table structure was
// preserved so empty cells stay empty rather than shifting later columns).
// See roadmap #36.
//
// Per the source doc: Medicine When / Poison When / L. Glôw Translation are
// explicitly "L. Glôw interpretation fields — educational wellness cues,
// not diagnosis or dosing instructions." This database supersedes the old
// draft data/content/herbs.js entirely (23 classical-tradition entries,
// never Thea's own words) — that file is no longer used by app/herbs.js.
//
// Field notes:
// - doshaRaw: Thea's shorthand exactly as written (e.g. "PK- V+"), always
//   present when the source had dosha data (one entry, Bitter Root, has
//   none). Shown to the user verbatim regardless of whether doshaImpact
//   parsed cleanly.
// - doshaImpact: {vata,pitta,kapha} each -1/0/1, computed mechanically from
//   doshaRaw only when all three doshas are unambiguously covered with no
//   conflicting modifiers. null for the few entries whose notation has
//   alternates (e.g. "VPK= / VPK-") or an inline exception (e.g. "VPK=
//   (P-)") — rather than guess which reading is right, those show doshaRaw
//   as text with no computed bar. 252 of 256 parsed cleanly.
// - needsGuidance: mechanically detected from Poison When containing the
//   phrase "professional guidance" (Thea's own words, not an invented
//   flag) — drives the practitioner-guidance badge the source doc asks for.
// - types: lowercase, split from the source's combined "Herb / spice"-style
//   type column. Most entries are a single type; hybrids get multiple.

export const herbFoodDatabase = [
  {
    "name": "Agrimony",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "diuretic",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Ajwan",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "diaphoretic",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Wake up the system",
    "needsGuidance": false
  },
  {
    "name": "Alfalfa",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diuretic",
      "antipyretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Allspice",
    "types": [
      "spice"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Almond",
    "types": [
      "food",
      "nut"
    ],
    "latinName": "Amygdalus communis",
    "taste": [
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- KP+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "expectorant",
      "tonic"
    ],
    "medicineWhen": [
      "dryness",
      "depletion",
      "recovery",
      "nervous system support"
    ],
    "poisonWhen": [
      "congestion",
      "sluggish digestion",
      "high Kapha",
      "nut allergy"
    ],
    "lglowTranslation": "Nourish and rebuild",
    "needsGuidance": false
  },
  {
    "name": "Aloe",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent",
      "pungent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VPK= (P-)",
    "doshaImpact": null,
    "actions": [
      "alterative",
      "bitter tonic",
      "rejuvenative",
      "purgative"
    ],
    "medicineWhen": [
      "excess Pitta",
      "depletion",
      "recovery",
      "constipation",
      "clearing"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "weakness/dehydration",
      "pregnancy: professional guidance"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": true
  },
  {
    "name": "Amalaki",
    "types": [
      "herb",
      "fruit"
    ],
    "latinName": null,
    "taste": [
      "all but salty"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "nutritive tonic",
      "rejuvenative",
      "alterative"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Angelica",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Angelica (Tang Kuei)",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- Po",
    "doshaImpact": {
      "vata": -1,
      "pitta": 0,
      "kapha": -1
    },
    "actions": [
      "tonic",
      "emmenagogue",
      "rejuvenative",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "depletion",
      "recovery",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "hot flashes",
      "inflammation",
      "pregnancy: professional guidance"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": true
  },
  {
    "name": "Anise",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Pimpinella anisum",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "stimulant",
      "galactagogue"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Apple",
    "types": [
      "food"
    ],
    "latinName": "Malus spp.",
    "taste": [],
    "energy": null,
    "vipaka": null,
    "doshaRaw": "VP- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "laxative",
      "liver stimulant",
      "peel as diuretic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "sluggishness",
      "cold/heavy Kapha",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "insomnia",
      "dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Apricot Seed",
    "types": [
      "seed"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "antispasmodic",
      "expectorant",
      "laxative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Arnica",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "vulnerary",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "heat",
      "reflux",
      "irritability",
      "hot flashes"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": true
  },
  {
    "name": "Artichoke",
    "types": [
      "food",
      "herb"
    ],
    "latinName": "Cynara scolymus",
    "taste": [],
    "energy": null,
    "vipaka": null,
    "doshaRaw": "KP- V=",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "liver tonic",
      "restorative",
      "bile flow"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "wrong person/season/dose",
      "new symptoms appear"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Asafoetida",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Ferula asafoetida",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "antispasmodic",
      "anthelmintic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Ashwagandha",
    "types": [
      "herb"
    ],
    "latinName": "Withania somnifera",
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "tonic",
      "rejuvenative",
      "aphrodisiac",
      "nervine"
    ],
    "medicineWhen": [
      "burnout",
      "stress depletion",
      "poor sleep",
      "recovery",
      "Vata overwhelm"
    ],
    "poisonWhen": [
      "heavy ama",
      "congestion",
      "lethargy",
      "high Kapha",
      "pregnancy/meds: professional guidance"
    ],
    "lglowTranslation": "Restore resilience",
    "needsGuidance": true
  },
  {
    "name": "Asparagus",
    "types": [
      "food",
      "herb"
    ],
    "latinName": "Asparagus officinalis",
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- V=",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "laxative",
      "tonic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration",
      "weakness/dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Atibala",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "tonic",
      "demulcent",
      "diuretic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration",
      "weakness/dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Avocado",
    "types": [
      "food"
    ],
    "latinName": null,
    "taste": [],
    "energy": "cooling",
    "vipaka": null,
    "doshaRaw": "V- P- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive",
      "demulcent"
    ],
    "medicineWhen": [
      "dryness",
      "constipation",
      "hormone support",
      "Vata depletion"
    ],
    "poisonWhen": [
      "Kapha heaviness",
      "sluggish digestion",
      "mucus"
    ],
    "lglowTranslation": "Soft nourishment",
    "needsGuidance": false
  },
  {
    "name": "Bala",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VP- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "tonic",
      "nervine",
      "demulcent",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "stress",
      "overthinking",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Balmony",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "anthelmintic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "constipation",
      "clearing"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Barberry",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "alterative",
      "antipyretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Barley",
    "types": [
      "food",
      "grain"
    ],
    "latinName": "Hordeum distichon",
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "demulcent",
      "tonic"
    ],
    "medicineWhen": [
      "puffiness",
      "water retention",
      "Kapha heaviness",
      "weight support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "low weight"
    ],
    "lglowTranslation": "Lighten and dry",
    "needsGuidance": false
  },
  {
    "name": "Basil / Tulsi",
    "types": [
      "herb"
    ],
    "latinName": "Ocimum spp.",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "febrifuge",
      "nervine"
    ],
    "medicineWhen": [
      "stress",
      "brain fog",
      "allergies",
      "respiratory heaviness",
      "Kapha mood"
    ],
    "poisonWhen": [
      "dryness",
      "constipation",
      "underweight Vata",
      "pregnancy/meds: professional guidance"
    ],
    "lglowTranslation": "Clear and uplift",
    "needsGuidance": true
  },
  {
    "name": "Bay Leaves",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "stimulant",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Betony Wood",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "carminative",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Bhringaraj",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VPK-",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "tonic",
      "alterative",
      "nervine",
      "hemostatic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta/Kapha",
      "stress",
      "overthinking",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Bibhitaki",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "KP- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "tonic",
      "astringent",
      "expectorant",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "hot flashes",
      "inflammation",
      "weakness/dehydration",
      "excess dryness"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Birch",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "diuretic",
      "astringent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Bistort",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": null,
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "diuretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Bitter Root",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": null,
    "doshaImpact": null,
    "actions": [
      "cathartic",
      "emetic",
      "diuretic"
    ],
    "medicineWhen": [
      "water retention",
      "puffiness",
      "constipation",
      "clearing",
      "heat"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration",
      "weakness/dehydration",
      "pregnancy: professional guidance"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": true
  },
  {
    "name": "Black Cohosh",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "emmenagogue",
      "antiseptic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Black Pepper",
    "types": [
      "spice"
    ],
    "latinName": "Piper nigrum",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "expectorant",
      "carminative"
    ],
    "medicineWhen": [
      "ama",
      "mucus",
      "sluggish agni",
      "heavy meals",
      "Kapha congestion"
    ],
    "poisonWhen": [
      "reflux",
      "ulcers",
      "heat",
      "hot flashes",
      "high Pitta"
    ],
    "lglowTranslation": "Ignite agni",
    "needsGuidance": false
  },
  {
    "name": "Blackberry",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "alterative",
      "hemostatic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Blessed Thistle",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "bitter tonic",
      "galactagogue"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Blue Cohosh",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "parturient",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "cramps",
      "spasm/tension",
      "cycle stagnation",
      "uterine cramping"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "heat",
      "reflux",
      "irritability",
      "hot flashes"
    ],
    "lglowTranslation": "Move cycle energy",
    "needsGuidance": true
  },
  {
    "name": "Blue Flag",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antipyretic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Boneset",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "antipyretic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Release and clear",
    "needsGuidance": false
  },
  {
    "name": "Borage",
    "types": [
      "herb"
    ],
    "latinName": "Borago officinalis",
    "taste": [
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "diuretic",
      "demulcent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Buchu",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "diaphoretic",
      "stimulant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Buckbean",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antipyretic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Burdock",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diaphoretic",
      "diuretic",
      "astringent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Butternut",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "purgative",
      "anthelmintic",
      "astringent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "Cabbage",
    "types": [
      "food"
    ],
    "latinName": "Brassica oleracea",
    "taste": [],
    "energy": null,
    "vipaka": null,
    "doshaRaw": "KP- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "anti-inflammatory",
      "antibacterial",
      "tissue healing"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation"
    ],
    "lglowTranslation": "Context is the remedy",
    "needsGuidance": false
  },
  {
    "name": "Calamus",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "decongestant",
      "nervine",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "heat",
      "reflux",
      "irritability",
      "hot flashes"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": true
  },
  {
    "name": "Calendula",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "vulnerary",
      "antispasmodic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "cramps",
      "spasm/tension",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Calumba",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic",
      "antiemetic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Camphor",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "stimulant",
      "decongestant",
      "analgesic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Caraway",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "stimulant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Cardamom",
    "types": [
      "spice"
    ],
    "latinName": "Elettaria cardamomum",
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "expectorant"
    ],
    "medicineWhen": [
      "heavy meals",
      "nausea",
      "coffee balancing",
      "bloating",
      "mucus"
    ],
    "poisonWhen": [
      "rarely",
      "use less with strong heat or dryness"
    ],
    "lglowTranslation": "Digest gently",
    "needsGuidance": false
  },
  {
    "name": "Cascara Sagrada",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "laxative",
      "astringent",
      "bitter tonic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "constipation",
      "clearing"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": true
  },
  {
    "name": "Castor Oil",
    "types": [
      "oil"
    ],
    "latinName": "Ricinus communis",
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "V- PK+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "cathartic",
      "demulcent",
      "analgesic",
      "nervine"
    ],
    "medicineWhen": [
      "excess Vata",
      "stress",
      "overthinking",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Catnip",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "nervine"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Cattail",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "P- VK+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "astringent",
      "hemostatic",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta",
      "heat",
      "summer/Pitta",
      "excess discharge",
      "loose tissue"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "Cayenne",
    "types": [
      "spice"
    ],
    "latinName": "Capsicum annuum",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "K- PV+",
    "doshaImpact": {
      "vata": 1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "alterative",
      "hemostatic"
    ],
    "medicineWhen": [
      "excess Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "heat",
      "reflux"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Centaury American",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "febrifuge",
      "bitter tonic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Centaury European",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Chamomile",
    "types": [
      "herb"
    ],
    "latinName": "Matricaria chamomilla",
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "nervine"
    ],
    "medicineWhen": [
      "stress",
      "cramps",
      "sleep support",
      "nervous digestion",
      "irritability"
    ],
    "poisonWhen": [
      "heavy lethargy",
      "very cold/depleted state",
      "ragweed allergy caution"
    ],
    "lglowTranslation": "Soften and soothe",
    "needsGuidance": false
  },
  {
    "name": "Chaparral",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diuretic",
      "bitter tonic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": true
  },
  {
    "name": "Chia Seeds",
    "types": [
      "seed"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "demulcent",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Chickweed",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "demulcent",
      "laxative",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "dryness",
      "irritation",
      "constipation",
      "clearing"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Chicory",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diuretic",
      "antipyretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Chrysanthemum",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "antipyretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Cilantro",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "carminative",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Cinnamon",
    "types": [
      "spice"
    ],
    "latinName": "Cinnamomum zeylanicum",
    "taste": [
      "pungent",
      "sweet",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "diaphoretic",
      "alterative"
    ],
    "medicineWhen": [
      "cold digestion",
      "poor circulation",
      "blood-sugar awareness",
      "Kapha heaviness"
    ],
    "poisonWhen": [
      "reflux",
      "ulcers",
      "hot flashes",
      "high Pitta"
    ],
    "lglowTranslation": "Warm and awaken",
    "needsGuidance": false
  },
  {
    "name": "Cleavers",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "alterative",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Cloves",
    "types": [
      "spice"
    ],
    "latinName": "Eugenia caryophyllata",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "aphrodisiac",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Coconut",
    "types": [
      "food"
    ],
    "latinName": "Cocos nucifera",
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "refrigerant",
      "diuretic",
      "tonic"
    ],
    "medicineWhen": [
      "heat",
      "dehydration",
      "summer depletion",
      "Pitta irritation"
    ],
    "poisonWhen": [
      "cold digestion",
      "Kapha mucus/heaviness"
    ],
    "lglowTranslation": "Cool and hydrate",
    "needsGuidance": false
  },
  {
    "name": "Coltsfoot",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "demulcent",
      "expectorant",
      "astringent",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "excess dryness"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Comfrey",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "emollient",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": true
  },
  {
    "name": "Coriander",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Coriandrum sativum",
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PKV=",
    "doshaImpact": {
      "vata": 0,
      "pitta": 0,
      "kapha": 0
    },
    "actions": [
      "alterative",
      "diaphoretic",
      "diuretic",
      "carminative"
    ],
    "medicineWhen": [
      "heat",
      "acidity",
      "urinary burning",
      "skin irritation",
      "summer balance"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "extreme Kapha sluggishness"
    ],
    "lglowTranslation": "Cool the fire",
    "needsGuidance": false
  },
  {
    "name": "Corn Silk",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "demulcent",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Cotton Root",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- KP+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "aphrodisiac",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Vata",
      "depletion",
      "recovery",
      "cycle stagnation",
      "uterine cramping"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Crampbark",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "astringent",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "cramps",
      "spasm/tension",
      "cycle stagnation",
      "uterine cramping"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "Cranesbill",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "hemostatic",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "heat",
      "summer/Pitta",
      "excess discharge",
      "loose tissue"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "Cubebs",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Culver’s Root",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "cathartic",
      "febrifuge",
      "bitter tonic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "constipation",
      "clearing"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Cumin",
    "types": [
      "spice"
    ],
    "latinName": "Cuminum cyminum",
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PKV=",
    "doshaImpact": {
      "vata": 0,
      "pitta": 0,
      "kapha": 0
    },
    "actions": [
      "carminative",
      "alterative",
      "stimulant"
    ],
    "medicineWhen": [
      "gas",
      "weak digestion",
      "loose stools",
      "postpartum digestion support"
    ],
    "poisonWhen": [
      "excess dryness",
      "high Vata depletion"
    ],
    "lglowTranslation": "Digest and stabilize",
    "needsGuidance": false
  },
  {
    "name": "Curry Leaf",
    "types": [
      "herb",
      "food"
    ],
    "latinName": "Murraya koenigii",
    "taste": [],
    "energy": null,
    "vipaka": null,
    "doshaRaw": "KP- V=",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "stomachic",
      "tonic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "wrong person/season/dose",
      "new symptoms appear"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Damiana",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "K- Vo P+",
    "doshaImpact": {
      "vata": 0,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "aphrodisiac"
    ],
    "medicineWhen": [
      "excess Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "vitality",
      "reproductive depletion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Wake up the system",
    "needsGuidance": false
  },
  {
    "name": "Dandelion",
    "types": [
      "herb",
      "food"
    ],
    "latinName": "Taraxacum officinalis",
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diuretic",
      "laxative"
    ],
    "medicineWhen": [
      "liver/lymph stagnation",
      "puffiness",
      "water retention",
      "spring reset"
    ],
    "poisonWhen": [
      "dry constipation",
      "underweight",
      "depletion",
      "pregnancy/diuretics: professional guidance"
    ],
    "lglowTranslation": "Nature’s detoxifier",
    "needsGuidance": true
  },
  {
    "name": "Dates",
    "types": [
      "food"
    ],
    "latinName": "Phoenix dactylifera",
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VP- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "tonic",
      "aphrodisiac"
    ],
    "medicineWhen": [
      "depletion",
      "recovery",
      "weakness",
      "low weight",
      "dry cough"
    ],
    "poisonWhen": [
      "mucus",
      "high Kapha",
      "blood-sugar concerns"
    ],
    "lglowTranslation": "Deep nourishment",
    "needsGuidance": false
  },
  {
    "name": "Devil’s Claw",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "anti-inflammatory",
      "analgesic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Dill",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Anethum graveolens",
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "alterative",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Echinacea",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antibiotic",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Elder Flowers",
    "types": [
      "herb"
    ],
    "latinName": "Sambucus spp.",
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "KP- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "diuretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Elecampane",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "antispasmodic",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Eleuthero",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "tonic",
      "antispasmodic",
      "antirheumatic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "cramps",
      "spasm/tension",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Ephedra",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "K- VP+",
    "doshaImpact": {
      "vata": 1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "diuretic",
      "anti-cough",
      "stimulant"
    ],
    "medicineWhen": [
      "excess Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "dryness",
      "anxiety",
      "constipation",
      "heat"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": true
  },
  {
    "name": "Eucalyptus",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "decongestant",
      "stimulant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Eyebright",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "antipyretic",
      "alterative",
      "astringent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "False Unicorn",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "aphrodisiac",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "water retention",
      "puffiness",
      "cycle stagnation",
      "uterine cramping"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Fennel",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Foeniculum vulgare",
    "taste": [
      "sweet",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VPK= / VPK-",
    "doshaImpact": null,
    "actions": [
      "carminative",
      "diuretic",
      "antispasmodic"
    ],
    "medicineWhen": [
      "gas",
      "bloating",
      "reflux-prone digestion",
      "gentle post-meal support"
    ],
    "poisonWhen": [
      "rarely aggravating",
      "use less with very cold sluggish digestion"
    ],
    "lglowTranslation": "Universal digestive",
    "needsGuidance": false
  },
  {
    "name": "Fenugreek",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Trigonella foenum-graecum",
    "taste": [
      "bitter",
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "tonic",
      "expectorant",
      "rejuvenative"
    ],
    "medicineWhen": [
      "sluggish metabolism",
      "lactation support",
      "Kapha heaviness",
      "stiffness"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "pregnancy",
      "blood sugar meds: professional guidance"
    ],
    "lglowTranslation": "Build digestive power",
    "needsGuidance": true
  },
  {
    "name": "Flaxseed",
    "types": [
      "food",
      "seed"
    ],
    "latinName": "Linum usitatissimum",
    "taste": [
      "sweet",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "V- PK+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "laxative",
      "demulcent",
      "nutritive tonic"
    ],
    "medicineWhen": [
      "dry constipation",
      "dryness",
      "hormone nourishment",
      "Vata roughness"
    ],
    "poisonWhen": [
      "mucus",
      "heavy Kapha",
      "weak digestion if not hydrated"
    ],
    "lglowTranslation": "Lubricate and nourish",
    "needsGuidance": false
  },
  {
    "name": "Fo-Ti",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "tonic",
      "rejuvenative",
      "aphrodisiac",
      "astringent"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "depletion",
      "recovery",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Frankincense",
    "types": [
      "resin"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent",
      "astringent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "analgesic",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Galangal",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "diaphoretic",
      "antirheumatic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Wake up the system",
    "needsGuidance": false
  },
  {
    "name": "Garlic",
    "types": [
      "food",
      "herb"
    ],
    "latinName": "Allium sativum",
    "taste": [
      "all but sour"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "expectorant",
      "alterative"
    ],
    "medicineWhen": [
      "congestion",
      "immune season",
      "circulation",
      "Kapha stagnation"
    ],
    "poisonWhen": [
      "reflux",
      "ulcers",
      "heat",
      "irritability",
      "sattvic/spiritual practice sensitivity"
    ],
    "lglowTranslation": "Nature’s protector",
    "needsGuidance": false
  },
  {
    "name": "Gentian",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Ginger",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Zingiber officinale",
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "diaphoretic",
      "expectorant",
      "carminative"
    ],
    "medicineWhen": [
      "cold digestion",
      "nausea",
      "bloating",
      "congestion",
      "low circulation"
    ],
    "poisonWhen": [
      "reflux",
      "ulcers",
      "hot flashes",
      "high Pitta",
      "active inflammation"
    ],
    "lglowTranslation": "Master digestive remedy",
    "needsGuidance": false
  },
  {
    "name": "Ginseng",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- KPo",
    "doshaImpact": {
      "vata": -1,
      "pitta": 0,
      "kapha": 0
    },
    "actions": [
      "tonic",
      "stimulant",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata",
      "sluggishness",
      "cold/heavy Kapha",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "hot flashes",
      "inflammation",
      "insomnia"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Gokshura",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "tonic",
      "aphrodisiac"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Gold Thread",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Golden Seal",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic",
      "antibiotic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Gotu Kola",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PKV=",
    "doshaImpact": {
      "vata": 0,
      "pitta": 0,
      "kapha": 0
    },
    "actions": [
      "nervine",
      "rejuvenative",
      "alterative",
      "diuretic"
    ],
    "medicineWhen": [
      "water retention",
      "puffiness",
      "stress",
      "overthinking",
      "depletion"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Grapes / Raisins",
    "types": [
      "food"
    ],
    "latinName": "Vitis vinifera",
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "laxative"
    ],
    "medicineWhen": [
      "heat",
      "thirst",
      "recovery",
      "constipation from dryness"
    ],
    "poisonWhen": [
      "mucus",
      "high Kapha",
      "blood-sugar concerns"
    ],
    "lglowTranslation": "Cool and hydrate",
    "needsGuidance": false
  },
  {
    "name": "Gravel Root",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "lithotriptic",
      "nervine"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Grindelia",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "diaphoretic",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Ground Ivy",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "astringent",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Guggul",
    "types": [
      "herb",
      "resin"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent",
      "astringent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "rejuvenative",
      "alterative",
      "antispasmodic",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Gum Arabic",
    "types": [
      "resin"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "emollient",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Haritaki",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "all but salty"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- Po",
    "doshaImpact": {
      "vata": -1,
      "pitta": 0,
      "kapha": -1
    },
    "actions": [
      "rejuvenative",
      "nervine",
      "astringent",
      "laxative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "stress",
      "overthinking",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "hot flashes",
      "inflammation",
      "weakness/dehydration",
      "excess dryness"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Hawthorn",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sour",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sour",
    "doshaRaw": "V- Ko P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 0
    },
    "actions": [
      "stimulant",
      "antispasmodic",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Vata",
      "sluggishness",
      "cold/heavy Kapha",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Henna",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "antipyretic",
      "alterative",
      "nervine"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stress",
      "overthinking",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Hibiscus",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "hemostatic",
      "refrigerant",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Honey",
    "types": [
      "food",
      "sweetener"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "pungent",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "emollient",
      "tonic",
      "laxative"
    ],
    "medicineWhen": [
      "mucus",
      "heaviness",
      "Kapha stagnation",
      "sore throat support"
    ],
    "poisonWhen": [
      "heat",
      "dehydration",
      "infants",
      "never heat honey"
    ],
    "lglowTranslation": "Scrape and move",
    "needsGuidance": false
  },
  {
    "name": "Hops",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "bitter tonic",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Horehound",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "KP- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "antispasmodic",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Horseradish",
    "types": [
      "food",
      "herb"
    ],
    "latinName": "Cochlearia armoracia",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "diuretic",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Horsetail",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "diaphoretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Hyssop",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "diuretic",
      "carminative",
      "anthelmintic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Iceland Moss",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "salty",
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "alterative",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Indigo",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antibiotic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Irish Moss",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "salty",
      "sweet",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- PK+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "emollient"
    ],
    "medicineWhen": [
      "excess Vata",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Jasmine Flowers",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "refrigerant",
      "emmenagogue",
      "nervine"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stress",
      "overthinking",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Juniper Berries",
    "types": [
      "herb"
    ],
    "latinName": "Juniperus communis",
    "taste": [
      "pungent",
      "bitter",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "diaphoretic",
      "carminative",
      "analgesic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Kelp",
    "types": [
      "seaweed"
    ],
    "latinName": null,
    "taste": [
      "salty",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- KP+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata",
      "mucus",
      "congestion",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Kudzu",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "tonic",
      "diaphoretic",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "water retention",
      "puffiness",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Lady’s Slipper",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "sweet",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- Po",
    "doshaImpact": {
      "vata": -1,
      "pitta": 0,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "antispasmodic",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "stress",
      "overthinking",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Lavender",
    "types": [
      "herb"
    ],
    "latinName": "Lavandula spp.",
    "taste": [
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "diuretic",
      "antispasmodic"
    ],
    "medicineWhen": [
      "anxiety",
      "overthinking",
      "sleep support",
      "nervous digestion",
      "Pitta stress"
    ],
    "poisonWhen": [
      "extreme lethargy",
      "heavy Kapha depression",
      "excessive sedation"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Lemon",
    "types": [
      "food",
      "fruit"
    ],
    "latinName": "Citrus limonum",
    "taste": [
      "sour"
    ],
    "energy": "cooling",
    "vipaka": "sour",
    "doshaRaw": "PV- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "expectorant",
      "carminative",
      "astringent"
    ],
    "medicineWhen": [
      "sluggish digestion",
      "nausea",
      "heaviness",
      "Kapha buildup"
    ],
    "poisonWhen": [
      "reflux",
      "ulcers",
      "tooth enamel sensitivity",
      "high Pitta heat"
    ],
    "lglowTranslation": "Wake up digestion",
    "needsGuidance": false
  },
  {
    "name": "Lemon Balm",
    "types": [
      "herb"
    ],
    "latinName": "Melissa officinalis",
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "KP- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "nervine"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Lemon Grass",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "diaphoretic",
      "refrigerant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Licorice",
    "types": [
      "herb"
    ],
    "latinName": "Glycyrrhiza glabra",
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VP- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "expectorant",
      "tonic",
      "laxative"
    ],
    "medicineWhen": [
      "dry cough",
      "throat dryness",
      "adrenal depletion",
      "acid irritation"
    ],
    "poisonWhen": [
      "high blood pressure",
      "water retention",
      "edema",
      "high Kapha",
      "meds: professional guidance"
    ],
    "lglowTranslation": "Soothe and restore",
    "needsGuidance": true
  },
  {
    "name": "Lily",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VP- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "nutritive tonic",
      "nervine"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "stress",
      "overthinking",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Lime",
    "types": [
      "food"
    ],
    "latinName": null,
    "taste": [
      "sour",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sour",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "refrigerant",
      "carminative",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "gas",
      "bloating",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Lobelia",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "K- PV+",
    "doshaImpact": {
      "vata": 1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "antispasmodic",
      "emetic",
      "expectorant",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "dryness",
      "anxiety",
      "constipation",
      "heat"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": true
  },
  {
    "name": "Lotus",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "aphrodisiac",
      "astringent",
      "nervine"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "stress",
      "overthinking",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Mace",
    "types": [
      "spice"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "antispasmodic",
      "emetic",
      "expectorant",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Mahabala",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "tonic",
      "demulcent",
      "rejuvenative",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "water retention",
      "puffiness",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Maitake",
    "types": [
      "herb",
      "mushroom"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "refrigerant",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Malva",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "emollient",
      "astringent"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Manjishta",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "hemostatic",
      "emmenagogue",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Marjoram",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "antispasmodic",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Wake up the system",
    "needsGuidance": false
  },
  {
    "name": "Marshmallow",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "tonic",
      "demulcent",
      "diuretic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "water retention",
      "puffiness",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Mint / Peppermint",
    "types": [
      "herb"
    ],
    "latinName": "Mentha spp.",
    "taste": [
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "nervine"
    ],
    "medicineWhen": [
      "nausea",
      "headache",
      "heat",
      "digestive spasm",
      "summer support"
    ],
    "poisonWhen": [
      "GERD/reflux",
      "very cold digestion",
      "high Vata dryness"
    ],
    "lglowTranslation": "Cool and refresh",
    "needsGuidance": false
  },
  {
    "name": "Mistletoe",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "antispasmodic",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "stress",
      "overthinking",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "heat",
      "reflux",
      "irritability",
      "hot flashes"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": true
  },
  {
    "name": "Mormon Tea",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "K- VP+",
    "doshaImpact": {
      "vata": 1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "dryness",
      "anxiety",
      "constipation",
      "heat"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": true
  },
  {
    "name": "Motherwort",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "diaphoretic",
      "diuretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Mugwort",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "antispasmodic",
      "diaphoretic",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "cramps",
      "spasm/tension",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move cycle energy",
    "needsGuidance": false
  },
  {
    "name": "Mullein",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "astringent",
      "vulnerary",
      "sedative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Musta",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "astringent",
      "alterative",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "pregnancy: professional guidance",
      "excess dryness"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": true
  },
  {
    "name": "Mustard Seeds",
    "types": [
      "spice"
    ],
    "latinName": "Brassica alba",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "expectorant",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Myrrh",
    "types": [
      "resin"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "analgesic",
      "emmenagogue",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Neem",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Nettle",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "astringent",
      "hemostatic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Nutmeg",
    "types": [
      "spice"
    ],
    "latinName": "Myristica fragrans",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "carminative",
      "sedative",
      "nervine"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Oats",
    "types": [
      "food",
      "grain"
    ],
    "latinName": "Avena sativa",
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VP- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nervine",
      "antispasmodic",
      "tonic"
    ],
    "medicineWhen": [
      "nervous depletion",
      "dry skin",
      "recovery",
      "sleep support"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "slow Kapha digestion"
    ],
    "lglowTranslation": "Feed the nervous system",
    "needsGuidance": false
  },
  {
    "name": "Olive Oil",
    "types": [
      "food",
      "oil"
    ],
    "latinName": "Olea europaea",
    "taste": [],
    "energy": null,
    "vipaka": null,
    "doshaRaw": "V- PK=",
    "doshaImpact": {
      "vata": -1,
      "pitta": 0,
      "kapha": 0
    },
    "actions": [
      "nutritive",
      "liver and gallbladder support",
      "topical emollient"
    ],
    "medicineWhen": [
      "excess Vata",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "wrong person/season/dose",
      "new symptoms appear"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Onion",
    "types": [
      "food"
    ],
    "latinName": "Allium cepa",
    "taste": [
      "pungent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "tonic",
      "aphrodisiac"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "depletion",
      "recovery",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Orange Peel",
    "types": [
      "herb",
      "peel"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "expectorant",
      "stimulant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Oregano",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Origanum vulgare",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "diaphoretic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Oregon Grape",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antipyretic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Osha",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "antibacterial",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Papaya",
    "types": [
      "food"
    ],
    "latinName": "Carica papaya",
    "taste": [],
    "energy": null,
    "vipaka": null,
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "digestive",
      "increases agni"
    ],
    "medicineWhen": [
      "excess Vata/Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability"
    ],
    "lglowTranslation": "Context is the remedy",
    "needsGuidance": false
  },
  {
    "name": "Paprika",
    "types": [
      "spice"
    ],
    "latinName": "Capsicum annuum",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Parsley",
    "types": [
      "herb"
    ],
    "latinName": "Petroselinum spp.",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "emmenagogue",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Passion Flower",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "sedative",
      "diuretic",
      "anodyne"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Pau d’Arco",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antipyretic",
      "antibiotic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Pennyroyal",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "heat",
      "reflux",
      "irritability",
      "hot flashes"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": true
  },
  {
    "name": "Peony",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "emmenagogue",
      "nervine"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stress",
      "overthinking",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "pregnancy: professional guidance"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": true
  },
  {
    "name": "Peppermint",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "nervine"
    ],
    "medicineWhen": [
      "nausea",
      "headache",
      "heat",
      "digestive spasm",
      "summer support"
    ],
    "poisonWhen": [
      "GERD/reflux",
      "very cold digestion",
      "high Vata dryness"
    ],
    "lglowTranslation": "Cool and refresh",
    "needsGuidance": false
  },
  {
    "name": "Peruvian Bark",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Pippali",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "expectorant",
      "aphrodisiac"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Pipsissewa",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "astringent",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Plantain",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "alterative",
      "diuretic",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Pleurisy Root",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "expectorant",
      "febrifuge"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Poke Root",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "emetic",
      "cathartic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": true
  },
  {
    "name": "Pomegranate",
    "types": [
      "food",
      "herb"
    ],
    "latinName": "Punica granatum",
    "taste": [
      "astringent",
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- Vo; sweet variety all dosha",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "alterative",
      "anthelmintic",
      "tonic"
    ],
    "medicineWhen": [
      "heat",
      "loose stools",
      "digestion support",
      "recovery"
    ],
    "poisonWhen": [
      "constipation if already very dry/astringent"
    ],
    "lglowTranslation": "Balance and restore",
    "needsGuidance": false
  },
  {
    "name": "Poppy Seeds",
    "types": [
      "food",
      "seed"
    ],
    "latinName": "Papaver spp.",
    "taste": [
      "pungent",
      "astringent",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "carminative",
      "sedative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Prickly Ash",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "anthelmintic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Primrose",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "alterative",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Psyllium",
    "types": [
      "herb",
      "seed"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "laxative",
      "demulcent",
      "astringent"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "constipation",
      "clearing"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Pumpkin Seeds",
    "types": [
      "food",
      "seed"
    ],
    "latinName": "Cucurbita pepo",
    "taste": [
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- PK+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "anthelmintic",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Vata",
      "water retention",
      "puffiness",
      "intestinal cleansing"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Punarnava",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "diaphoretic",
      "laxative",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Purple Loosestrife",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "astringent",
      "demulcent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "dryness",
      "irritation",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Raspberry Leaves",
    "types": [
      "herb"
    ],
    "latinName": "Rubus spp.",
    "taste": [
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "alterative",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Red Clover",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diuretic",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Red Root",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "expectorant",
      "sedative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Rehmannia",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "rejuvenative",
      "aphrodisiac"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "depletion",
      "recovery",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Rhubarb",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "purgative",
      "alterative",
      "antipyretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Rose Flowers / Petals",
    "types": [
      "herb"
    ],
    "latinName": "Rosa spp.",
    "taste": [
      "bitter",
      "pungent",
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VPK- / VPK=",
    "doshaImpact": null,
    "actions": [
      "alterative",
      "emmenagogue",
      "nervine"
    ],
    "medicineWhen": [
      "grief",
      "heat",
      "irritability",
      "heart tension",
      "Pitta emotions"
    ],
    "poisonWhen": [
      "rarely",
      "use less with very low agni or heavy coldness"
    ],
    "lglowTranslation": "Open the heart",
    "needsGuidance": false
  },
  {
    "name": "Rose Hips",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sour",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "sour",
    "doshaRaw": "V- KP+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "stimulant",
      "carminative",
      "astringent"
    ],
    "medicineWhen": [
      "excess Vata",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Rosemary",
    "types": [
      "herb"
    ],
    "latinName": "Rosmarinus officinalis",
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "carminative",
      "stimulant",
      "emmenagogue"
    ],
    "medicineWhen": [
      "brain fog",
      "low energy",
      "poor circulation",
      "Kapha dullness"
    ],
    "poisonWhen": [
      "reflux",
      "high heat",
      "irritability",
      "pregnancy: professional guidance"
    ],
    "lglowTranslation": "Awaken vitality",
    "needsGuidance": true
  },
  {
    "name": "Rue",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "emmenagogue",
      "anthelmintic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "stress",
      "overthinking",
      "cycle stagnation",
      "uterine cramping"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "heat",
      "reflux",
      "irritability",
      "hot flashes"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": true
  },
  {
    "name": "Safflower",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "emmenagogue",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Saffron",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Crocus sativus",
    "taste": [
      "pungent",
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VPK-",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "emmenagogue",
      "rejuvenative",
      "carminative"
    ],
    "medicineWhen": [
      "low mood",
      "ojas support",
      "reproductive vitality",
      "heart heaviness"
    ],
    "poisonWhen": [
      "large doses",
      "pregnancy",
      "high heat: professional guidance"
    ],
    "lglowTranslation": "Joy in plant form",
    "needsGuidance": true
  },
  {
    "name": "Sage",
    "types": [
      "herb"
    ],
    "latinName": "Salvia officinalis",
    "taste": [
      "pungent",
      "bitter",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "expectorant",
      "nervine",
      "astringent"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Sandalwood",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "alterative",
      "hemostatic",
      "antipyretic",
      "nervine"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "stress",
      "overthinking",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Sarsaparilla",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "alterative",
      "diuretic",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "water retention",
      "puffiness",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Sassafras",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diaphoretic",
      "stimulant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Savory",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "astringent"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Saw Palmetto",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- PK+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "tonic",
      "rejuvenative",
      "aphrodisiac",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata",
      "mucus",
      "congestion",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Self-Heal",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antipyretic",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Senna",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "purgative",
      "antipyretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": true
  },
  {
    "name": "Sesame Seeds",
    "types": [
      "food",
      "seed"
    ],
    "latinName": "Sesamum indicum",
    "taste": [
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- PK+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "rejuvenative"
    ],
    "medicineWhen": [
      "dryness",
      "weakness",
      "hair/skin support",
      "Vata depletion"
    ],
    "poisonWhen": [
      "edema",
      "congestion",
      "high Kapha",
      "inflammatory skin flare"
    ],
    "lglowTranslation": "Deep nourishment",
    "needsGuidance": false
  },
  {
    "name": "Shatavari",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "emmenagogue",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Shepherd’s Purse",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "hemostatic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Skullcap",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stress",
      "overthinking",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Calm the system",
    "needsGuidance": false
  },
  {
    "name": "Skunk Cabbage",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "antispasmodic",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Slippery Elm",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "emollient"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Solomon’s Seal",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "astringent",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Spearmint",
    "types": [
      "herb"
    ],
    "latinName": "Mentha spicata",
    "taste": [
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "KP- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "diuretic",
      "carminative"
    ],
    "medicineWhen": [
      "heat",
      "hormonal acne pattern",
      "digestive tension",
      "irritability"
    ],
    "poisonWhen": [
      "very cold digestion",
      "low agni",
      "high Vata dryness"
    ],
    "lglowTranslation": "Cool and refresh",
    "needsGuidance": false
  },
  {
    "name": "Spikenard",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "demulcent",
      "expectorant",
      "tonic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Squaw Vine",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "astringent",
      "diuretic",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "St. John’s Wort",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "antispasmodic",
      "expectorant",
      "astringent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Star Anise",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Stillingia",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "diaphoretic",
      "expectorant",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Stoneroot",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "diaphoretic",
      "astringent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Strawberry Leaves",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "astringent",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Sugar",
    "types": [
      "food",
      "sweetener"
    ],
    "latinName": "Saccharum officinarum",
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "nutritive tonic",
      "demulcent",
      "laxative"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Sumach",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "alterative",
      "refrigerant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Tamarind",
    "types": [
      "food",
      "fruit"
    ],
    "latinName": "Tamarindus indica",
    "taste": [
      "sour",
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sour",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "carminative",
      "laxative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Tansy",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "diaphoretic",
      "bitter tonic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "cold digestion",
      "low agni",
      "pregnancy: professional guidance"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": true
  },
  {
    "name": "Tarragon",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "emmenagogue",
      "diuretic",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Thyme",
    "types": [
      "herb"
    ],
    "latinName": "Thymus vulgaris",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "antispasmodic",
      "carminative",
      "antimicrobial"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Tormentil",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "hemostatic",
      "antiseptic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "heat",
      "summer/Pitta",
      "excess discharge",
      "loose tissue"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "Turmeric",
    "types": [
      "herb",
      "spice"
    ],
    "latinName": "Curcuma longa",
    "taste": [
      "pungent",
      "bitter"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- Po",
    "doshaImpact": {
      "vata": -1,
      "pitta": 0,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "alterative",
      "antibacterial",
      "vulnerary"
    ],
    "medicineWhen": [
      "inflammation",
      "skin support",
      "Kapha stagnation",
      "blood-sugar awareness",
      "cleansing"
    ],
    "poisonWhen": [
      "severe dryness",
      "low weight",
      "blood thinners/pregnancy: professional guidance"
    ],
    "lglowTranslation": "Purify and protect",
    "needsGuidance": true
  },
  {
    "name": "Uva Ursi",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "astringent",
      "antiseptic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Valerian",
    "types": [
      "herb"
    ],
    "latinName": "Valeriana spp.",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "VK- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "nervine",
      "antispasmodic",
      "carminative",
      "sedative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "stress",
      "overthinking"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Vamsha Rochana",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "expectorant",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "mucus",
      "congestion",
      "dryness",
      "irritation"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Vervain",
    "types": [
      "herb"
    ],
    "latinName": "Verbena spp.",
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "antipyretic",
      "expectorant",
      "astringent"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Vetiverian",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "antipyretic",
      "astringent",
      "refrigerant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "heat",
      "summer/Pitta",
      "excess discharge",
      "loose tissue"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "Vidari-Kanda",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VP- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "nutritive tonic",
      "aphrodisiac",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "water retention",
      "puffiness",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "dehydration"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Violet",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "antiseptic",
      "expectorant"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Wahoo",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "purgative",
      "antipyretic",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "constipation",
      "clearing"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Walnut",
    "types": [
      "food",
      "nut"
    ],
    "latinName": "Juglans nigra",
    "taste": [
      "sweet"
    ],
    "energy": "heating",
    "vipaka": "sweet",
    "doshaRaw": "V- PK+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "tonic",
      "laxative"
    ],
    "medicineWhen": [
      "excess Vata",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "mucus",
      "heaviness"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Watercress",
    "types": [
      "food",
      "herb"
    ],
    "latinName": "Rorippa nasturtium",
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "expectorant",
      "stimulant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "White Oak",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "hemostatic",
      "antiseptic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "heat",
      "summer/Pitta",
      "excess discharge",
      "loose tissue"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "White Pine",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "diaphoretic",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "White Pond Lily",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "astringent",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PV- K+",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 1
    },
    "actions": [
      "demulcent",
      "astringent",
      "tonic"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "dryness",
      "irritation",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "mucus",
      "heaviness",
      "sluggish digestion",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "White Poplar",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "water retention",
      "puffiness",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Wild Carrot",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diuretic",
      "stimulant",
      "carminative",
      "emmenagogue"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "sluggishness",
      "cold/heavy Kapha"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Wild Cherry Bark",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "antispasmodic",
      "expectorant",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "mucus",
      "congestion",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Wild Ginger",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "expectorant",
      "decongestant"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "mucus",
      "congestion",
      "seasonal chills",
      "stuck sweat"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Clear and open",
    "needsGuidance": false
  },
  {
    "name": "Wild Yam",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "sweet",
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "sweet",
    "doshaRaw": "VP- Ko",
    "doshaImpact": {
      "vata": -1,
      "pitta": -1,
      "kapha": 0
    },
    "actions": [
      "antispasmodic",
      "diaphoretic",
      "tonic",
      "rejuvenative"
    ],
    "medicineWhen": [
      "excess Vata/Pitta",
      "cramps",
      "spasm/tension",
      "depletion",
      "recovery"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Nourish and restore",
    "needsGuidance": false
  },
  {
    "name": "Willow Bark",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "bitter tonic",
      "antipyretic",
      "anodyne"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "depletion",
      "recovery",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Wintergreen",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "carminative",
      "astringent",
      "analgesic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "cold digestion",
      "low agni",
      "excess dryness"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  },
  {
    "name": "Witch Hazel",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "astringent",
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "astringent",
      "hemostatic",
      "vulnerary"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "heat",
      "summer/Pitta",
      "excess discharge",
      "loose tissue"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Tone and repair",
    "needsGuidance": false
  },
  {
    "name": "Wormseed",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent",
      "bitter",
      "astringent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "anthelmintic",
      "stimulant",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "heat",
      "reflux",
      "irritability",
      "hot flashes"
    ],
    "lglowTranslation": "Wake up the system",
    "needsGuidance": true
  },
  {
    "name": "Wormwood",
    "types": [
      "herb"
    ],
    "latinName": "Artemisia absinthium",
    "taste": [
      "bitter",
      "pungent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- Vo",
    "doshaImpact": {
      "vata": 0,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "anthelmintic",
      "carminative",
      "antispasmodic"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "gas",
      "bloating",
      "cramps",
      "spasm/tension"
    ],
    "poisonWhen": [
      "strong herb: professional guidance",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": true
  },
  {
    "name": "Yarrow",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "pungent",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "diaphoretic",
      "astringent",
      "alterative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "stagnation",
      "skin/liver support",
      "heat",
      "summer/Pitta"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Yellow Dock",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "bitter",
      "astringent"
    ],
    "energy": "cooling",
    "vipaka": "pungent",
    "doshaRaw": "PK- V+",
    "doshaImpact": {
      "vata": 1,
      "pitta": -1,
      "kapha": -1
    },
    "actions": [
      "alterative",
      "astringent",
      "laxative"
    ],
    "medicineWhen": [
      "excess Pitta/Kapha",
      "constipation",
      "clearing",
      "stagnation",
      "skin/liver support"
    ],
    "poisonWhen": [
      "dryness",
      "anxiety",
      "constipation",
      "cold digestion",
      "low agni"
    ],
    "lglowTranslation": "Clean and clear",
    "needsGuidance": false
  },
  {
    "name": "Yerba Mate",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "K- Vo P+",
    "doshaImpact": {
      "vata": 0,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "stimulant",
      "diuretic"
    ],
    "medicineWhen": [
      "excess Kapha",
      "sluggishness",
      "cold/heavy Kapha",
      "water retention",
      "puffiness"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Drain excess water",
    "needsGuidance": false
  },
  {
    "name": "Yerba Santa",
    "types": [
      "herb"
    ],
    "latinName": null,
    "taste": [
      "pungent"
    ],
    "energy": "heating",
    "vipaka": "pungent",
    "doshaRaw": "KV- P+",
    "doshaImpact": {
      "vata": -1,
      "pitta": 1,
      "kapha": -1
    },
    "actions": [
      "expectorant",
      "antispasmodic",
      "carminative"
    ],
    "medicineWhen": [
      "excess Vata/Kapha",
      "gas",
      "bloating",
      "mucus",
      "congestion"
    ],
    "poisonWhen": [
      "heat",
      "reflux",
      "irritability",
      "hot flashes",
      "inflammation"
    ],
    "lglowTranslation": "Move trapped air",
    "needsGuidance": false
  }
];

// Priority-ordered (herb/food/spice first, since those cover the bulk of
// entries) then alphabetical — used for the filter chip row in app/herbs.js.
export const HERB_FOOD_TYPES = [
  "herb",
  "food",
  "spice",
  "fruit",
  "grain",
  "mushroom",
  "nut",
  "oil",
  "peel",
  "resin",
  "seaweed",
  "seed",
  "sweetener"
];

/**
 * Build des compendiums Orbital Blues.
 *
 * Transforme les données de scripts/data/*.mjs en documents Foundry (JSON source
 * dans src/packs/<pack>/) puis compile en base LevelDB dans packs/<pack>/ via le
 * Foundry CLI.
 *
 *   npm run build:packs      → génère src/ + compile packs/
 *   npm run clean:packs      → supprime src/packs et packs
 *
 * La source de vérité reste les fichiers scripts/data/*.mjs et le JSON de src/packs/.
 * Le dossier packs/ (LevelDB) est un artefact de build ; il peut être régénéré.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compilePack } from "@foundryvtt/foundryvtt-cli";

import { GAMBITS } from "./data/gambits.mjs";
import { TROUBLES } from "./data/troubles.mjs";
import { MELEE_WEAPONS, RANGED_WEAPONS } from "./data/weapons.mjs";
import { EQUIPMENT, MEMENTOS } from "./data/equipment.mjs";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const SRC = path.join(ROOT, "src", "packs");
const OUT = path.join(ROOT, "packs");

/* -------------------------------------------- */
/*  Utilitaires                                  */
/* -------------------------------------------- */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** ID Foundry déterministe (16 chars [A-Za-z0-9]) dérivé d'une graine. */
function makeId(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let id = "";
  for (let i = 0; i < 16; i++) {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    id += CHARS[(h >>> 0) % CHARS.length];
  }
  return id;
}

const ICONS = {
  gambit: "icons/svg/aura.svg",
  trouble: "icons/svg/hazard.svg",
  weapon: "icons/svg/sword.svg",
  gear: "icons/svg/item-bag.svg",
  memento: "icons/svg/chest.svg"
};

/** Construit un document Item Foundry complet. */
function makeItem(pack, name, type, system, img) {
  const _id = makeId(`${pack}:${name}`);
  return {
    _id,
    _key: `!items!${_id}`,
    name,
    type,
    img,
    system,
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {}
  };
}

/* -------------------------------------------- */
/*  Constructeurs par pack                       */
/* -------------------------------------------- */

function buildGambits() {
  return GAMBITS.map(([name, effect]) =>
    makeItem("gambits", name, "gambit",
      { description: "", source: "Orbital Blues", trigger: "", effect },
      ICONS.gambit));
}

function buildTroubles() {
  return TROUBLES.map((t) => {
    const hooks = t.hooks.map((h) => `<li>${h}</li>`).join("");
    const qs = t.questions.map((q) => `<li>${q}</li>`).join("");
    const description =
      `<p>${t.desc}</p>` +
      `<p><strong>Ça se déclenche quand :</strong></p><ul>${hooks}</ul>` +
      `<p><strong>Questions :</strong></p><ol>${qs}</ol>`;
    return makeItem("troubles", t.name, "trouble",
      { description, source: "Orbital Blues", hook: t.desc, triggered: false },
      ICONS.trouble);
  });
}

function weaponSystem(traits, type, attackStat, rangeIdeal) {
  return {
    description: `<p><strong>Type :</strong> ${type}<br/><strong>Traits :</strong> ${traits}</p>`,
    source: "Orbital Blues",
    quantity: 1,
    tags: traits,
    damage: "",
    range: rangeIdeal,
    cash: 0,
    isWeapon: true,
    attackStat,
    damageBonus: 0,
    difficulty: 8
  };
}

function buildWeapons() {
  const melee = MELEE_WEAPONS.map(([name, type, traits]) =>
    makeItem("weapons", name, "gear",
      weaponSystem(traits, type, "muscle", "À proximité (mêlée)"),
      ICONS.weapon));
  const ranged = RANGED_WEAPONS.map(([name, type, traits]) =>
    makeItem("weapons", name, "gear",
      weaponSystem(traits, type, "savvy", "Loin (tir)"),
      ICONS.weapon));
  return [...melee, ...ranged];
}

function buildEquipment() {
  return EQUIPMENT.map(([name, description]) =>
    makeItem("equipment", name, "gear",
      {
        description: `<p>${description}</p>`,
        source: "Orbital Blues",
        quantity: 1,
        tags: "Équipement d'équipage",
        damage: "",
        range: "",
        cash: 0,
        isWeapon: false,
        attackStat: "muscle",
        damageBonus: 0,
        difficulty: 8
      },
      ICONS.gear));
}

function buildMementos() {
  return MEMENTOS.map((name) =>
    makeItem("mementos", name, "gear",
      {
        description: "<p>Un souvenir de ta vie d'avant. Surtout utile pour ton background.</p>",
        source: "Orbital Blues",
        quantity: 1,
        tags: "Memento",
        damage: "",
        range: "",
        cash: 0,
        isWeapon: false,
        attackStat: "muscle",
        damageBonus: 0,
        difficulty: 8
      },
      ICONS.memento));
}

const PACKS = {
  gambits: buildGambits,
  troubles: buildTroubles,
  weapons: buildWeapons,
  equipment: buildEquipment,
  mementos: buildMementos
};

/* -------------------------------------------- */
/*  Exécution                                    */
/* -------------------------------------------- */

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

if (process.argv.includes("--clean")) {
  rmrf(SRC);
  rmrf(OUT);
  console.log("Nettoyé : src/packs et packs");
  process.exit(0);
}

let total = 0;
for (const [name, build] of Object.entries(PACKS)) {
  const docs = build();
  const srcDir = path.join(SRC, name);
  const outDir = path.join(OUT, name);

  rmrf(srcDir);
  rmrf(outDir);
  fs.mkdirSync(srcDir, { recursive: true });

  const seen = new Set();
  for (const doc of docs) {
    let base = slug(doc.name);
    let file = base;
    let n = 1;
    while (seen.has(file)) file = `${base}-${++n}`;
    seen.add(file);
    fs.writeFileSync(path.join(srcDir, `${file}.json`), JSON.stringify(doc, null, 2) + "\n", "utf8");
  }

  await compilePack(srcDir, outDir);
  console.log(`✓ ${name.padEnd(10)} — ${docs.length} documents`);
  total += docs.length;
}

console.log(`\nTerminé : ${total} documents dans ${Object.keys(PACKS).length} compendiums.`);

/**
 * Orbital Blues — Foundry VTT v14 system
 * Point d'entrée du système.
 */

import { OB } from "./helpers/config.mjs";
import { OrbitalBluesActor } from "./documents/actor.mjs";
import { OrbitalBluesItem } from "./documents/item.mjs";
import { OrbitalBluesCharacterSheet } from "./sheets/character-sheet.mjs";
import { OrbitalBluesShipSheet } from "./sheets/ship-sheet.mjs";
import { OrbitalBluesNpcSheet } from "./sheets/npc-sheet.mjs";
import { OrbitalBluesItemSheet } from "./sheets/item-sheet.mjs";
import { rollCheck, rollPerception, rollBlues, rollAttack } from "./helpers/roll.mjs";
import {
  OrbitalBluesCharacterData,
  OrbitalBluesShipData,
  OrbitalBluesNpcData
} from "./data/actor.mjs";
import {
  OrbitalBluesGambitData,
  OrbitalBluesTroubleData,
  OrbitalBluesGearData,
  OrbitalBluesCargoData,
  OrbitalBluesShipPartData
} from "./data/item.mjs";

/* -------------------------------------------- */
/*  Init Hook                                    */
/* -------------------------------------------- */

Hooks.once("init", function () {
  console.log("Orbital Blues | Initialisation du système");

  // API publique
  game.orbitalBlues = {
    OrbitalBluesActor,
    OrbitalBluesItem,
    rollCheck,
    rollPerception,
    rollBlues,
    rollAttack,
    config: OB
  };

  CONFIG.OB = OB;

  // Documents personnalisés
  CONFIG.Actor.documentClass = OrbitalBluesActor;
  CONFIG.Item.documentClass = OrbitalBluesItem;

  // Modèles de données (remplacent template.json, déprécié en v14)
  CONFIG.Actor.dataModels.character = OrbitalBluesCharacterData;
  CONFIG.Actor.dataModels.ship      = OrbitalBluesShipData;
  CONFIG.Actor.dataModels.npc       = OrbitalBluesNpcData;

  CONFIG.Item.dataModels.gambit   = OrbitalBluesGambitData;
  CONFIG.Item.dataModels.trouble  = OrbitalBluesTroubleData;
  CONFIG.Item.dataModels.gear     = OrbitalBluesGearData;
  CONFIG.Item.dataModels.cargo    = OrbitalBluesCargoData;
  CONFIG.Item.dataModels.shipPart = OrbitalBluesShipPartData;

  // Initiative (règles) : 1d3 + Astuce (Savvy).
  // Variante mêlée « Knives to a cinematic gunfight » (2d3 en gardant le meilleur)
  // à déclarer manuellement au cas par cas.
  CONFIG.Combat.initiative = {
    formula: "1d3 + @stats.savvy.value",
    decimals: 0
  };

  // Enregistrement des feuilles (API v14)
  const Actors = foundry.documents.collections.Actors ?? globalThis.Actors;
  const Items  = foundry.documents.collections.Items  ?? globalThis.Items;

  Actors.unregisterSheet("core", foundry.appv1?.sheets?.ActorSheet ?? ActorSheet);
  Actors.registerSheet("orbital-blues", OrbitalBluesCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "OB.SheetLabels.Character"
  });
  Actors.registerSheet("orbital-blues", OrbitalBluesShipSheet, {
    types: ["ship"],
    makeDefault: true,
    label: "OB.SheetLabels.Ship"
  });
  Actors.registerSheet("orbital-blues", OrbitalBluesNpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "OB.SheetLabels.Npc"
  });

  Items.unregisterSheet("core", foundry.appv1?.sheets?.ItemSheet ?? ItemSheet);
  Items.registerSheet("orbital-blues", OrbitalBluesItemSheet, {
    makeDefault: true,
    label: "OB.SheetLabels.Item"
  });

  // Précharger les partials Handlebars
  preloadHandlebarsTemplates();

  // Helpers Handlebars
  Handlebars.registerHelper("ob-concat", (...args) => args.slice(0, -1).join(""));
  Handlebars.registerHelper("ob-eq", (a, b) => a === b);
});

/* -------------------------------------------- */
/*  Ready Hook                                   */
/* -------------------------------------------- */

Hooks.once("ready", function () {
  console.log("Orbital Blues | Prêt");
});

/* -------------------------------------------- */
/*  Précharge de templates                       */
/* -------------------------------------------- */

async function preloadHandlebarsTemplates() {
  const paths = [
    "systems/orbital-blues/templates/chat/roll-card.hbs"
  ];
  const loader = foundry.applications?.handlebars?.loadTemplates ?? loadTemplates;
  return loader(paths);
}

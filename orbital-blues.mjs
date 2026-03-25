/**
 * ORBITAL BLUES
 * A lo-fi Space Western RPG System for Foundry VTT V13
 * by Soul Muppet Publishing
 *
 * System implementation by the community.
 */

import { OrbitalBluesActor }      from "./module/documents/actor.mjs";
import { OrbitalBluesItem }       from "./module/documents/item.mjs";
import { OrbitalBluesActorSheet } from "./module/sheets/actor-sheet.mjs";
import { OrbitalBluesShipSheet }  from "./module/sheets/ship-sheet.mjs";
import { OrbitalBluesItemSheet }  from "./module/sheets/item-sheet.mjs";

/* ============================================================
   SYSTEM CONFIGURATION
   ============================================================ */
const ORBITAL_BLUES = {
  stats: {
    muscle: "ORBITAL_BLUES.Stats.Muscle",
    grit:   "ORBITAL_BLUES.Stats.Grit",
    savvy:  "ORBITAL_BLUES.Stats.Savvy"
  },
  shipStats: {
    body:     "ORBITAL_BLUES.ShipStats.Body",
    mobility: "ORBITAL_BLUES.ShipStats.Mobility",
    systems:  "ORBITAL_BLUES.ShipStats.Systems"
  },
  weaponCategories: ["ranged", "melee"],
  weaponSubcategories: ["personal", "military", "improvised", "martial"],
  weaponTraits: [
    "rapid-fire", "concealable", "stun", "precise", "intimidating",
    "shot", "armour-piercing", "long-range", "limited-ammo", "loud",
    "deadly", "defensive", "heavy", "explosive", "bind", "conspicuous"
  ],
  rollModes: {
    normal: "ORBITAL_BLUES.Rolls.Normal",
    upper:  "ORBITAL_BLUES.Rolls.UpperHand",
    odds:   "ORBITAL_BLUES.Rolls.AgainstTheOdds"
  }
};

/* ============================================================
   INIT HOOK
   ============================================================ */
Hooks.once("init", function () {
  console.log("🎵 Orbital Blues | Initializing system...");

  // Expose config
  CONFIG.ORBITAL_BLUES = ORBITAL_BLUES;

  // Expose classes for external use (macros, modules)
  game.orbital_blues = {
    OrbitalBluesActor,
    OrbitalBluesItem,
    rollCheck: OrbitalBluesActor.rollCheck
  };

  // Register Document classes
  CONFIG.Actor.documentClass = OrbitalBluesActor;
  CONFIG.Item.documentClass  = OrbitalBluesItem;

  // Token bar attributes
  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ["heart"],
      value: ["blues", "credits", "debts", "stats.muscle", "stats.grit", "stats.savvy"]
    },
    ship: {
      bar: [],
      value: ["stats.body", "stats.mobility", "stats.systems", "crewProjects.pips"]
    },
    npc: {
      bar: ["heart"],
      value: ["stats.muscle", "stats.grit", "stats.savvy"]
    }
  };

  // Unregister default sheets
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  // Register character sheet
  Actors.registerSheet("orbital-blues", OrbitalBluesActorSheet, {
    types: ["character", "npc"],
    makeDefault: true,
    label: "ORBITAL_BLUES.SheetLabels.Character"
  });

  // Register ship sheet
  Actors.registerSheet("orbital-blues", OrbitalBluesShipSheet, {
    types: ["ship"],
    makeDefault: true,
    label: "ORBITAL_BLUES.SheetLabels.Ship"
  });

  // Register item sheet for all item types
  Items.registerSheet("orbital-blues", OrbitalBluesItemSheet, {
    types: ["weapon", "equipment", "memento", "gambit", "trouble"],
    makeDefault: true,
    label: "Item Sheet"
  });

  // Register Handlebars helpers
  _registerHandlebarsHelpers();

  // Pre-load templates
  _preloadHandlebarsTemplates();

  console.log("🎵 Orbital Blues | System initialized.");
});

/* ============================================================
   READY HOOK
   ============================================================ */
Hooks.once("ready", function () {
  console.log("🎵 Orbital Blues | System ready.");

  // Macro helper hint
  console.log(`🎵 Orbital Blues | Macro examples:
    // Roll Stat Check
    game.orbital_blues.OrbitalBluesActor.rollCheck({
      actor: game.actors.getName("Your Character"),
      label: "Muscle Check",
      modifier: 2,
      mode: "upper",  // "normal", "upper", or "odds"
      type: "stat"
    });
  `);
});

/* ============================================================
   HANDLEBARS HELPERS
   ============================================================ */
function _registerHandlebarsHelpers() {
  // Generate an array of N numbers for looping
  Handlebars.registerHelper("times", function (n, block) {
    let result = "";
    for (let i = 0; i < n; i++) {
      block.data.index = i;
      result += block.fn(i);
    }
    return result;
  });

  // Less than or equal
  Handlebars.registerHelper("lte", (a, b) => a <= b);

  // Greater than or equal
  Handlebars.registerHelper("gte", (a, b) => a >= b);

  // Equal
  Handlebars.registerHelper("eq", (a, b) => a === b);

  // Add
  Handlebars.registerHelper("add", (a, b) => a + b);

  // Concat strings
  Handlebars.registerHelper("concat", (...args) => {
    args.pop(); // remove Handlebars options object
    return args.join("");
  });

  // Capitalize first letter
  Handlebars.registerHelper("capitalize", (str) => {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Check if value is in array
  Handlebars.registerHelper("includes", (arr, val) => {
    return Array.isArray(arr) && arr.includes(val);
  });
}

/* ============================================================
   PRELOAD TEMPLATES
   ============================================================ */
async function _preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/orbital-blues/templates/actor/character-sheet.hbs",
    "systems/orbital-blues/templates/actor/ship-sheet.hbs",
    "systems/orbital-blues/templates/item/weapon-sheet.hbs",
    "systems/orbital-blues/templates/item/equipment-sheet.hbs",
    "systems/orbital-blues/templates/item/memento-sheet.hbs",
    "systems/orbital-blues/templates/item/gambit-sheet.hbs",
    "systems/orbital-blues/templates/item/trouble-sheet.hbs"
  ];
  return loadTemplates(templatePaths);
}

/* ============================================================
   COMBAT HOOKS — Initiative
   ============================================================ */
Hooks.on("getCombatTrackerEntryContext", (html, options) => {
  // Future: custom combat actions
});

/* ============================================================
   CHAT HOOKS — Exertion (spending Heart to reroll)
   ============================================================ */
Hooks.on("renderChatMessage", (message, html, data) => {
  // Future: add Exertion button to roll results
  // Let players click to spend Heart and reroll a die
});

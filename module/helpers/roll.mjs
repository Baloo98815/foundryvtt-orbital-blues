/**
 * Moteur de jets Orbital Blues — fidèle au résumé des règles.
 *
 * TEST DE CARACTÉRISTIQUE : 2d6 + stat, réussite si total >= 8 (binaire).
 * TEST DE PERCEPTION       : 2d6 sans modificateur, réussite si >= 8.
 * BLUES CHECK              : 2d6 + Cran (grit), réussite si >= 8 → +1 Blues.
 * ATTAQUE                  : 3d6, on garde 2 dés (+stat) vs Difficulté (défaut 8) ;
 *                            le dé restant sert de dégâts (+ modificateur d'arme).
 *
 * Modes :
 *  - normal      : 2d6 (attaque : 3d6)
 *  - upperHand   : Avantage    — retire le dé le plus bas (attaque : 4d6, retire le plus bas)
 *  - againstOdds : Désavantage — retire le dé le plus haut (attaque : 4d6, retire le plus haut)
 */

import { OB } from "./config.mjs";

/* -------------------------------------------- */
/*  Shims de compatibilité v13/v14              */
/* -------------------------------------------- */

const renderTpl = foundry.applications?.handlebars?.renderTemplate ?? globalThis.renderTemplate;
const DialogV2  = foundry.applications?.api?.DialogV2 ?? null;

const CARD = "systems/orbital-blues/templates/chat/roll-card.hbs";

/* -------------------------------------------- */
/*  Utilitaires                                  */
/* -------------------------------------------- */

/** Formule "garder 2 dés" pour tests (check / perception / blues). */
function keepTwoFormula(mode) {
  if (mode === "upperHand")   return "3d6kh2"; // retire le plus bas
  if (mode === "againstOdds") return "3d6kl2"; // retire le plus haut
  return "2d6";
}

/** Récupère la valeur d'une stat (perso ou vaisseau). */
function statValueOf(actor, statKey) {
  return Number(actor.system?.stats?.[statKey]?.value ?? 0);
}

/** Libellé localisé d'une stat. */
function statLabelOf(statKey) {
  return game.i18n.localize(OB.stats[statKey] ?? OB.shipStats[statKey] ?? statKey);
}

/** Envoie la carte de résultat dans le chat. */
async function toChat(actor, roll, data, flavor) {
  const content = await renderTpl(CARD, data);
  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor,
    content,
    rollMode: game.settings.get("core", "rollMode")
  });
}

/* -------------------------------------------- */
/*  Test de caractéristique (binaire)            */
/* -------------------------------------------- */

/**
 * @param {Actor}  actor
 * @param {string} statKey  muscle|grit|savvy|engines|systems|hull
 * @param {object} [options]
 * @param {"normal"|"upperHand"|"againstOdds"} [options.mode="normal"]
 * @param {number} [options.bonus=0]
 * @param {number} [options.target] défaut OB.targetNumber (8)
 * @param {string} [options.flavor]
 */
export async function rollCheck(actor, statKey, options = {}) {
  const mode   = options.mode ?? "normal";
  const bonus  = Number(options.bonus ?? 0);
  const target = Number(options.target ?? OB.targetNumber);
  const statValue = statValueOf(actor, statKey);

  const formula = `${keepTwoFormula(mode)} + ${statValue} + ${bonus}`;
  const roll = new Roll(formula);
  await roll.evaluate();

  const success = roll.total >= target;
  const outcome = success ? "success" : "miss";
  const outcomeLabel = game.i18n.localize(success ? "OB.Outcome.Success" : "OB.Outcome.Miss");

  const statLabel = statLabelOf(statKey);
  const modeLabel = game.i18n.localize(OB.rollModes[mode]);
  const flavor = options.flavor
    ?? `${game.i18n.localize("OB.Chat.Check")} — ${statLabel} (${modeLabel})`;

  await toChat(actor, roll, {
    kind: "check",
    actor, title: `${statLabel} (${modeLabel})`,
    formula, total: roll.total, target,
    outcome, outcomeLabel,
    rollTooltip: await roll.getTooltip()
  }, flavor);

  return { roll, total: roll.total, success, outcome };
}

/* -------------------------------------------- */
/*  Test de Perception (2d6 sans modificateur)   */
/* -------------------------------------------- */

export async function rollPerception(actor, options = {}) {
  const mode   = options.mode ?? "normal";
  const target = Number(options.target ?? OB.targetNumber);

  const roll = new Roll(keepTwoFormula(mode));
  await roll.evaluate();

  const success = roll.total >= target;
  const outcomeLabel = game.i18n.localize(success ? "OB.Outcome.Success" : "OB.Outcome.Miss");
  const modeLabel = game.i18n.localize(OB.rollModes[mode]);
  const label = game.i18n.localize("OB.Chat.Perception");

  await toChat(actor, roll, {
    kind: "perception",
    actor, title: `${label} (${modeLabel})`,
    formula: roll.formula, total: roll.total, target,
    outcome: success ? "success" : "miss", outcomeLabel,
    rollTooltip: await roll.getTooltip()
  }, `${label} (${modeLabel})`);

  return { roll, total: roll.total, success };
}

/* -------------------------------------------- */
/*  Blues Check (2d6 + Cran → +1 Blues si >= 8)  */
/* -------------------------------------------- */

export async function rollBlues(actor, options = {}) {
  const mode   = options.mode ?? "normal";
  const target = Number(options.target ?? OB.targetNumber);
  const grit   = statValueOf(actor, "grit");

  const roll = new Roll(`${keepTwoFormula(mode)} + ${grit}`);
  await roll.evaluate();

  const gained = roll.total >= target; // réussite = tu encaisses et gagnes 1 Blues
  const outcomeLabel = game.i18n.localize(gained ? "OB.Blues.Gain" : "OB.Blues.None");
  const modeLabel = game.i18n.localize(OB.rollModes[mode]);
  const label = game.i18n.localize("OB.Chat.BluesCheck");

  if (gained) {
    const cur = Number(actor.system?.resources?.blues?.value ?? 0);
    await actor.update({ "system.resources.blues.value": cur + 1 });
  }

  await toChat(actor, roll, {
    kind: "blues",
    actor, title: `${label} (${modeLabel})`,
    formula: roll.formula, total: roll.total, target,
    outcome: gained ? "blues" : "miss", outcomeLabel,
    rollTooltip: await roll.getTooltip()
  }, `${label} (${modeLabel})`);

  return { roll, total: roll.total, gained };
}

/* -------------------------------------------- */
/*  Attaque (3d6, garde 2 + dé de dégâts)        */
/* -------------------------------------------- */

/**
 * @param {Actor}  actor
 * @param {string} statKey       muscle|savvy (mêlée / distance)
 * @param {object} [options]
 * @param {"normal"|"upperHand"|"againstOdds"} [options.mode="normal"]
 * @param {number} [options.difficulty] défaut 8
 * @param {number} [options.damageBonus=0] modificateur de dégâts de l'arme
 * @param {string} [options.weaponName]
 */
export async function rollAttack(actor, statKey, options = {}) {
  const mode        = options.mode ?? "normal";
  const difficulty  = Number(options.difficulty ?? OB.targetNumber);
  const damageBonus = Number(options.damageBonus ?? 0);
  const statValue   = statValueOf(actor, statKey);

  // Pool : 3 dés (normal), ou 4 dés dont on retire un (avantage/désavantage).
  let formula = "3d6";
  if (mode === "upperHand")   formula = "4d6kh3";
  else if (mode === "againstOdds") formula = "4d6kl3";

  const roll = new Roll(formula);
  await roll.evaluate();

  // Les 3 dés conservés, triés décroissant.
  const kept = roll.dice[0].results
    .filter((r) => r.active)
    .map((r) => r.result)
    .sort((a, b) => b - a);
  const [a, b, c] = kept;

  // On garde le plus gros dé possible en dégâts tout en atteignant la Difficulté.
  let hit = false;
  let damage = 0;
  let hitTotal = 0;
  if (b + c + statValue >= difficulty)      { hit = true; hitTotal = b + c + statValue; damage = a; }
  else if (a + c + statValue >= difficulty) { hit = true; hitTotal = a + c + statValue; damage = b; }
  else if (a + b + statValue >= difficulty) { hit = true; hitTotal = a + b + statValue; damage = c; }
  else { hit = false; hitTotal = a + b + statValue; }

  if (hit) damage = Math.max(0, damage + damageBonus);

  const outcomeLabel = game.i18n.localize(hit ? "OB.Attack.Hit" : "OB.Attack.Miss");
  const modeLabel = game.i18n.localize(OB.rollModes[mode]);
  const statLabel = statLabelOf(statKey);
  const title = options.weaponName
    ? `${game.i18n.localize("OB.Chat.Attack")} — ${options.weaponName}`
    : `${game.i18n.localize("OB.Chat.Attack")} — ${statLabel}`;

  await toChat(actor, roll, {
    kind: "attack",
    actor, title: `${title} (${modeLabel})`,
    formula: roll.formula,
    difficulty, hit, hitTotal, damage,
    outcome: hit ? "success" : "miss", outcomeLabel,
    rollTooltip: await roll.getTooltip()
  }, title);

  return { roll, hit, hitTotal, damage };
}

/* -------------------------------------------- */
/*  Dialogues (DialogV2 avec repli Dialog v1)    */
/* -------------------------------------------- */

/** Lit les champs du formulaire du dialogue. */
function readForm(root) {
  const q = (sel) => root?.querySelector(sel);
  return {
    mode:        q("[name=mode]")?.value ?? "normal",
    bonus:       Number(q("[name=bonus]")?.value ?? 0),
    difficulty: q("[name=difficulty]") ? Number(q("[name=difficulty]").value) : undefined,
    damageBonus: q("[name=damageBonus]") ? Number(q("[name=damageBonus]").value) : undefined
  };
}

/**
 * Ouvre un dialogue de configuration de jet et retourne les options, ou null si annulé.
 * @param {object} opts
 * @param {boolean} [opts.isAttack=false]
 */
async function promptOptions({ title, isAttack = false, difficulty, damageBonus = 0 } = {}) {
  const html = await renderTpl(
    "systems/orbital-blues/templates/dialog/roll-dialog.hbs",
    { modes: OB.rollModes, isAttack, difficulty: difficulty ?? OB.targetNumber, damageBonus }
  );

  // Chemin moderne : DialogV2
  if (DialogV2) {
    return DialogV2.wait({
      window: { title },
      content: html,
      rejectClose: false,
      buttons: [
        {
          action: "roll",
          label: game.i18n.localize("OB.Dialog.Roll"),
          default: true,
          callback: (event, button, dialog) => readForm(button?.form ?? dialog?.element)
        },
        { action: "cancel", label: game.i18n.localize("OB.Dialog.Cancel") }
      ]
    }).then((res) => (res && typeof res === "object" ? res : null));
  }

  // Repli : Dialog v1
  const Dlg = foundry.appv1?.api?.Dialog ?? globalThis.Dialog;
  return new Promise((resolve) => {
    new Dlg({
      title,
      content: html,
      buttons: {
        roll: {
          label: game.i18n.localize("OB.Dialog.Roll"),
          callback: (h) => resolve(readForm(h[0].querySelector("form")))
        },
        cancel: {
          label: game.i18n.localize("OB.Dialog.Cancel"),
          callback: () => resolve(null)
        }
      },
      default: "roll"
    }).render(true);
  });
}

/** Dialogue puis test de caractéristique. */
export async function promptRoll(actor, statKey) {
  const opts = await promptOptions({ title: game.i18n.localize("OB.Dialog.RollTitle") });
  if (!opts) return null;
  return rollCheck(actor, statKey, { mode: opts.mode, bonus: opts.bonus, target: opts.difficulty });
}

/** Dialogue puis attaque. */
export async function promptAttack(actor, statKey, presets = {}) {
  const opts = await promptOptions({
    title: game.i18n.localize("OB.Dialog.AttackTitle"),
    isAttack: true,
    difficulty: presets.difficulty,
    damageBonus: Number(presets.damageBonus ?? 0)
  });
  if (!opts) return null;
  return rollAttack(actor, statKey, {
    mode: opts.mode,
    difficulty: opts.difficulty ?? presets.difficulty,
    damageBonus: opts.damageBonus ?? 0,
    weaponName: presets.weaponName
  });
}

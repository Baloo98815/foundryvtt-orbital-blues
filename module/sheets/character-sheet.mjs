import { promptRoll, rollCheck, rollPerception, rollBlues, promptAttack, rollAttack } from "../helpers/roll.mjs";
import { OB } from "../helpers/config.mjs";

// Fallback compatibilité v14 : ActorSheet classique — plus simple pour un premier jet.
// Migration vers ApplicationV2 (foundry.applications.sheets.ActorSheetV2) recommandée
// une fois le contenu stabilisé.
const BaseActorSheet = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;
// TextEditor : namespace v13+, repli sur le global déprécié.
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation
  ?? foundry.applications?.ux?.TextEditor
  ?? globalThis.TextEditor;

export class OrbitalBluesCharacterSheet extends BaseActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "actor", "character"],
      template: "systems/orbital-blues/templates/actor/character-sheet.hbs",
      width: 720,
      height: 720,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    context.system = context.actor.system;
    context.config = OB;

    context.gambits  = context.actor.items.filter((i) => i.type === "gambit");
    context.troubles = context.actor.items.filter((i) => i.type === "trouble");
    context.gear     = context.actor.items.filter((i) => i.type === "gear");

    context.enriched = {
      biography: await TextEditorImpl.enrichHTML(context.system.biography ?? ""),
      notes:     await TextEditorImpl.enrichHTML(context.system.notes ?? "")
    };

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Test de caractéristique (Shift+clic = jet direct sans dialogue).
    html.find(".ob-roll-stat").on("click", (ev) => {
      const stat = ev.currentTarget.dataset.stat;
      if (ev.shiftKey) rollCheck(this.actor, stat);
      else promptRoll(this.actor, stat);
    });

    // Test de Perception (2d6 sans modificateur).
    html.find(".ob-roll-perception").on("click", (ev) => {
      rollPerception(this.actor, { mode: ev.shiftKey ? "upperHand" : "normal" });
    });

    // Blues check (2d6 + Cran → +1 Blues si >= 8).
    html.find(".ob-roll-blues").on("click", () => rollBlues(this.actor));

    // Attaque via une arme (item gear marqué comme arme).
    html.find(".ob-attack").on("click", (ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      const item = this.actor.items.get(id);
      if (!item) return;
      const presets = {
        weaponName: item.name,
        difficulty: Number(item.system.difficulty ?? OB.targetNumber),
        damageBonus: Number(item.system.damageBonus ?? 0)
      };
      const stat = item.system.attackStat ?? "muscle";
      if (ev.shiftKey) rollAttack(this.actor, stat, presets);
      else promptAttack(this.actor, stat, presets);
    });

    html.find(".ob-item-create").on("click", (ev) => {
      const type = ev.currentTarget.dataset.type;
      const name = game.i18n.format("OB.Item.New", {
        type: game.i18n.localize(`OB.ItemType.${type}`)
      });
      Item.create({ name, type }, { parent: this.actor });
    });

    html.find(".ob-item-edit").on("click", (ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.sheet.render(true);
    });

    html.find(".ob-item-delete").on("click", (ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.items.get(id)?.delete();
    });
  }
}

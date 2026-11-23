import { OB } from "../helpers/config.mjs";
import { promptRoll, rollCheck } from "../helpers/roll.mjs";

const BaseActorSheet = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;

export class OrbitalBluesNpcSheet extends BaseActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "actor", "npc"],
      template: "systems/orbital-blues/templates/actor/npc-sheet.hbs",
      width: 600,
      height: 640
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = context.actor.system;
    context.config = OB;
    // Stats du PNJ (sans la Menace, affichée à part).
    context.moods = [1, 2, 3, 4, 5, 6].map((n) => ({ n, value: context.system.mood?.[n] ?? "" }));
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Test de caractéristique (Shift+clic = jet direct).
    html.find(".ob-roll-stat").on("click", (ev) => {
      const stat = ev.currentTarget.dataset.stat;
      if (ev.shiftKey) rollCheck(this.actor, stat);
      else promptRoll(this.actor, stat);
    });

    // Humeur : D6 sur la table, résultat dans le chat.
    html.find(".ob-roll-mood").on("click", async () => {
      const roll = await new Roll("1d6").evaluate();
      const label = this.actor.system.mood?.[roll.total] || "—";
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `${game.i18n.localize("OB.Npc.Mood")} — <strong>${roll.total}. ${label}</strong>`
      });
    });
  }
}

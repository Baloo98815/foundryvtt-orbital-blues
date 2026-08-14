import { promptRoll, rollCheck } from "../helpers/roll.mjs";
import { OB } from "../helpers/config.mjs";

const BaseActorSheet = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;

export class OrbitalBluesShipSheet extends BaseActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "actor", "ship"],
      template: "systems/orbital-blues/templates/actor/ship-sheet.hbs",
      width: 720,
      height: 640
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = context.actor.system;
    context.config = OB;

    context.parts = context.actor.items.filter((i) => i.type === "shipPart");
    context.cargo = context.actor.items.filter((i) => i.type === "cargo");

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".ob-roll-shipstat").on("click", (ev) => {
      const stat = ev.currentTarget.dataset.stat;
      if (ev.shiftKey) rollCheck(this.actor, stat);
      else promptRoll(this.actor, stat);
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

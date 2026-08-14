import { OB } from "../helpers/config.mjs";

const BaseActorSheet = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;

export class OrbitalBluesNpcSheet extends BaseActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "actor", "npc"],
      template: "systems/orbital-blues/templates/actor/npc-sheet.hbs",
      width: 560,
      height: 480
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = context.actor.system;
    context.config = OB;
    return context;
  }
}

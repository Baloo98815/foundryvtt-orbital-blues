import { OB } from "../helpers/config.mjs";

const BaseItemSheet = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;
const TextEditorImpl = foundry.applications?.ux?.TextEditor?.implementation
  ?? foundry.applications?.ux?.TextEditor
  ?? globalThis.TextEditor;

export class OrbitalBluesItemSheet extends BaseItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  get template() {
    return `systems/orbital-blues/templates/item/${this.item.type}-sheet.hbs`;
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = context.item.system;
    context.config = OB;
    context.enriched = {
      description: await TextEditorImpl.enrichHTML(context.system.description ?? "")
    };
    return context;
  }

  /**
   * Glisser un trait / désavantage d'arme sur un objet : l'ajoute aux Tags.
   * @override
   */
  async _onDrop(event) {
    const data = TextEditorImpl.getDragEventData?.(event)
      ?? foundry.applications?.ux?.TextEditor?.implementation?.getDragEventData?.(event)
      ?? JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
    if (data?.type !== "Item" || this.item.type !== "gear" || !this.isEditable) return super._onDrop?.(event);
    const dropped = await fromUuid(data.uuid);
    if (dropped?.type !== "weaponTrait") return;

    const current = (this.item.system.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
    if (current.some((t) => t.toLowerCase() === dropped.name.toLowerCase())) {
      ui.notifications.info(game.i18n.localize("OB.Gear.TraitDuplicate"));
      return;
    }
    current.push(dropped.name);
    await this.item.update({ "system.tags": current.join(", ") });
    ui.notifications.info(game.i18n.format("OB.Gear.TraitAdded", { name: dropped.name }));
  }
}

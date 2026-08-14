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
}

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
    if (this.item.type === "gear") context.traitChips = await this._buildTraitChips();
    return context;
  }

  /** Découpe les Tags et associe chaque trait connu à sa description (compendium). */
  async _buildTraitChips() {
    const tags = (this.item.system.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
    if (!tags.length) return [];
    const pack = game.packs.get("orbital-blues.traits");
    const docs = pack ? await pack.getDocuments() : [];
    const key = (v) => String(v ?? "").toLowerCase().replace(/[-\s]+/g, " ").trim();
    return tags.map((name) => {
      const doc = docs.find((d) => key(d.name) === key(name) || key(d.system.nameEn) === key(name));
      return { name, known: !!doc, drawback: doc?.system.kind === "drawback", description: doc?.system.description ?? "" };
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // Clic sur un trait : affiche / masque sa description.
    html.find(".ob-trait-chip").on("click", (ev) => {
      ev.preventDefault();
      const chip = ev.currentTarget;
      const panel = chip.closest(".ob-traits").querySelector(`.ob-trait-desc[data-trait="${chip.dataset.trait}"]`);
      const wasOpen = !panel.hidden;
      chip.closest(".ob-traits").querySelectorAll(".ob-trait-desc").forEach((p) => (p.hidden = true));
      chip.closest(".ob-traits").querySelectorAll(".ob-trait-chip").forEach((c) => c.classList.remove("open"));
      if (!wasOpen) { panel.hidden = false; chip.classList.add("open"); }
    });
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

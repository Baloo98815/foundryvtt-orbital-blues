/**
 * Orbital Blues Item Sheet
 */
export class OrbitalBluesItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "item"],
      width: 520,
      height: 420,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    return `systems/orbital-blues/templates/item/${this.item.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    context.system = context.item.system;
    context.config = CONFIG.ORBITAL_BLUES;
    context.enrichedDescription = await TextEditor.enrichHTML(
      context.system.description || "",
      { relativeTo: this.item, secrets: this.item.isOwner }
    );

    // Weapon-specific data
    if (this.item.type === "weapon") {
      context.weaponCategories = CONFIG.ORBITAL_BLUES.weaponCategories;
      context.weaponSubcategories = CONFIG.ORBITAL_BLUES.weaponSubcategories;
      context.weaponTraits = CONFIG.ORBITAL_BLUES.weaponTraits;
      // Mark which traits are selected
      const selectedTraits = context.system.traits || [];
      context.traitCheckboxes = CONFIG.ORBITAL_BLUES.weaponTraits.map(t => ({
        key: t,
        label: game.i18n.localize(`ORBITAL_BLUES.Weapon.TraitsList.${t}`),
        checked: selectedTraits.includes(t)
      }));
    }

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (this.isEditable) {
      // Handle trait checkboxes for weapons
      html.find(".ob-trait-checkbox").on("change", this._onTraitChange.bind(this));
    }
  }

  async _onTraitChange(event) {
    const traitKey = event.currentTarget.dataset.trait;
    const checked = event.currentTarget.checked;
    const currentTraits = [...(this.item.system.traits || [])];

    if (checked && !currentTraits.includes(traitKey)) {
      currentTraits.push(traitKey);
    } else if (!checked) {
      const idx = currentTraits.indexOf(traitKey);
      if (idx > -1) currentTraits.splice(idx, 1);
    }

    await this.item.update({ "system.traits": currentTraits });
  }
}

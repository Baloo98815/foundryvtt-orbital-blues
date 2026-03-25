/**
 * Orbital Blues Item Document
 */
export class OrbitalBluesItem extends Item {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;

    if (itemData.type === "weapon") this._prepareWeaponData(systemData);
  }

  _prepareWeaponData(systemData) {
    // Normalize traits to always be an array
    if (!Array.isArray(systemData.traits)) {
      systemData.traits = [];
    }
  }

  /**
   * Roll an attack with this weapon
   * Weapons use Muscle (melee) or Savvy (ranged) by default
   */
  async rollAttack(mode = "normal") {
    if (this.type !== "weapon") return;
    const actor = this.parent;
    if (!actor) return ui.notifications.warn("No actor associated with this weapon.");

    const isRanged = this.system.category === "ranged";
    const statKey = isRanged ? "savvy" : "muscle";
    const statValue = actor.system.stats[statKey]?.value ?? 0;

    return actor.constructor.rollCheck({
      actor,
      label: `${game.i18n.localize("ORBITAL_BLUES.Rolls.StatCheck")} — ${this.name}`,
      modifier: statValue,
      mode,
      type: "stat"
    });
  }

  /**
   * Get a formatted string of weapon traits
   */
  get traitsLabel() {
    if (!this.system.traits || this.system.traits.length === 0) return "—";
    return this.system.traits
      .map(t => game.i18n.localize(`ORBITAL_BLUES.Weapon.TraitsList.${t}`) || t)
      .join(", ");
  }
}

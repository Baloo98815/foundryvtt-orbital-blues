/**
 * Orbital Blues Ship Sheet
 */
export class OrbitalBluesShipSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "actor", "ship"],
      template: "systems/orbital-blues/templates/actor/ship-sheet.hbs",
      width: 680,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    context.system = context.actor.system;
    context.config = CONFIG.ORBITAL_BLUES;

    // Prepare crew equipment items
    const crewEquipment = [];
    for (const item of context.actor.items) {
      if (item.type === "equipment") crewEquipment.push(item);
    }
    context.crewEquipment = crewEquipment;

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Ship stat rolls
    html.find(".ob-ship-stat-roll").on("click", this._onShipStatRoll.bind(this));

    if (this.isEditable) {
      html.find(".item-create").on("click", this._onItemCreate.bind(this));
      html.find(".item-edit").on("click", ev => {
        const li = ev.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        item.sheet.render(true);
      });
      html.find(".item-delete").on("click", async ev => {
        const li = ev.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        await item.delete();
      });
      // Crew Project pip management
      html.find(".ob-crew-project-pip").on("click", this._onCrewProjectPip.bind(this));
    }
  }

  async _onShipStatRoll(event) {
    event.preventDefault();
    const stat = event.currentTarget.dataset.stat;
    const statValue = this.actor.system.stats[stat]?.value ?? 0;
    const statLabel = game.i18n.localize(`ORBITAL_BLUES.ShipStats.${stat.charAt(0).toUpperCase() + stat.slice(1)}`);

    let mode = "normal";
    if (event.shiftKey) mode = "upper";
    else if (event.altKey) mode = "odds";

    // Use the same roll engine as characters
    const { OrbitalBluesActor } = game.orbital_blues;
    return OrbitalBluesActor.rollCheck({
      actor: this.actor,
      label: `${statLabel} Check`,
      modifier: statValue,
      mode,
      type: "stat"
    });
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type || "equipment";
    return Item.create({ name: `New ${type}`, type }, { parent: this.actor });
  }

  async _onCrewProjectPip(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.pip);
    const currentPips = this.actor.system.crewProjects.pips ?? 0;
    const newPips = index <= currentPips ? index - 1 : index;
    await this.actor.update({ "system.crewProjects.pips": Math.clamp(newPips, 0, 4) });
  }
}

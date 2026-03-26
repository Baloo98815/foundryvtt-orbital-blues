/**
 * Orbital Blues Character Sheet
 */
export class OrbitalBluesActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["orbital-blues", "sheet", "actor", "character"],
      template: "systems/orbital-blues/templates/actor/character-sheet.hbs",
      width: 720,
      height: 820,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "gambits" }],
      scrollY: [".sheet-body"]
    });
  }

  /** @override */
  async getData() {
    const context = await super.getData();
    const actorData = context.actor;
    context.system = actorData.system;
    context.flags = actorData.flags;
    context.config = CONFIG.ORBITAL_BLUES;

    // Prepare items for display
    this._prepareItems(context);
    // Enrich HTML descriptions (async in V13)
    context.enrichedBiography = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.biography || "",
      { relativeTo: this.actor, secrets: this.actor.isOwner }
    );

    return context;
  }

  /**
   * Organize items by type
   */
  _prepareItems(context) {
    const weapons = [];
    const equipment = [];
    const mementos = [];
    const gambits = [];
    const troubles = [];

    for (const item of context.actor.items) {
      item.img = item.img || Item.DEFAULT_ICON;
      if (item.type === "weapon") weapons.push(item);
      else if (item.type === "equipment") equipment.push(item);
      else if (item.type === "memento") mementos.push(item);
      else if (item.type === "gambit") gambits.push(item);
      else if (item.type === "trouble") troubles.push(item);
    }

    context.weapons = weapons;
    context.equipment = equipment;
    context.mementos = mementos;
    context.gambits = gambits;
    context.troubles = troubles;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Stat roll buttons
    html.find(".ob-stat-roll").on("click", this._onStatRoll.bind(this));

    // Blues check button
    html.find(".ob-blues-check").on("click", this._onBluesCheck.bind(this));

    // Observation check button
    html.find(".ob-obs-check").on("click", this._onObsCheck.bind(this));

    // Blues brewing button (reset)
    html.find(".ob-blues-reset").on("click", this._onBluesReset.bind(this));

    // Heart +/- controls
    html.find(".ob-heart-change").on("click", this._onHeartChange.bind(this));

    // Blues +/- controls
    html.find(".ob-blues-change").on("click", this._onBluesChange.bind(this));

    // Item controls (only for owners)
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
        li.slideUp(200, () => this.render(false));
      });
      html.find(".item-attack").on("click", this._onItemAttack.bind(this));
    }
  }

  /**
   * Handle stat roll clicks
   * Right-click or shift-click for mode selection
   */
  async _onStatRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const stat = element.dataset.stat;

    let mode = "normal";
    if (event.shiftKey) mode = "upper";
    else if (event.altKey || event.ctrlKey) mode = "odds";

    // If right-click, show dialog for mode selection
    if (event.type === "contextmenu") {
      mode = await this._getRollModeDialog();
      if (mode === null) return;
    }

    await this.actor.rollStatCheck(stat, mode);
  }

  async _onBluesCheck(event) {
    event.preventDefault();
    await this.actor.rollBluesCheck();
  }

  async _onObsCheck(event) {
    event.preventDefault();
    await this.actor.rollObservationCheck();
  }

  async _onBluesReset(event) {
    event.preventDefault();
    await this.actor.update({ "system.blues.value": 0 });
    ui.notifications.info(game.i18n.localize("ORBITAL_BLUES.Blues.Reset") + ": " + this.actor.name);
  }

  async _onHeartChange(event) {
    event.preventDefault();
    const delta = parseInt(event.currentTarget.dataset.delta);
    const current = this.actor.system.heart.value;
    const max = this.actor.system.heart.max;
    await this.actor.update({ "system.heart.value": Math.clamp(current + delta, 0, max) });
  }

  async _onBluesChange(event) {
    event.preventDefault();
    const delta = parseInt(event.currentTarget.dataset.delta);
    const current = this.actor.system.blues.value;
    await this.actor.update({ "system.blues.value": Math.max(0, current + delta) });
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const name = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const itemData = { name, type, system: {} };
    return Item.create(itemData, { parent: this.actor });
  }

  async _onItemAttack(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);

    let mode = "normal";
    if (event.shiftKey) mode = "upper";
    else if (event.altKey) mode = "odds";

    await item.rollAttack(mode);
  }

  /**
   * Show a dialog to choose roll mode
   */
  async _getRollModeDialog() {
    return new Promise(resolve => {
      new Dialog({
        title: game.i18n.localize("ORBITAL_BLUES.Rolls.RollMode"),
        content: `
          <p>${game.i18n.localize("ORBITAL_BLUES.Rolls.RollMode")} :</p>
        `,
        buttons: {
          upper: {
            icon: '<i class="fas fa-arrow-up"></i>',
            label: game.i18n.localize("ORBITAL_BLUES.Rolls.UpperHand"),
            callback: () => resolve("upper")
          },
          normal: {
            icon: '<i class="fas fa-dice"></i>',
            label: game.i18n.localize("ORBITAL_BLUES.Rolls.Normal"),
            callback: () => resolve("normal")
          },
          odds: {
            icon: '<i class="fas fa-arrow-down"></i>',
            label: game.i18n.localize("ORBITAL_BLUES.Rolls.AgainstTheOdds"),
            callback: () => resolve("odds")
          }
        },
        default: "normal",
        close: () => resolve(null)
      }).render(true);
    });
  }
}

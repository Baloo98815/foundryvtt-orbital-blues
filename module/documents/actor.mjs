/**
 * Orbital Blues Actor Document
 */
export class OrbitalBluesActor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Base data preparation before items are processed
  }

  /** @override */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags["orbital-blues"] || {};

    if (actorData.type === "character") this._prepareCharacterData(systemData);
    if (actorData.type === "ship") this._prepareShipData(systemData);
    if (actorData.type === "npc") this._prepareNPCData(systemData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(systemData) {
    // Heart max = 8 + Muscle (min 0)
    const muscle = systemData.stats.muscle.value ?? 0;
    systemData.heart.max = Math.max(1, 8 + muscle);
    // Clamp current heart
    systemData.heart.value = Math.clamp(
      systemData.heart.value,
      0,
      systemData.heart.max
    );
    // Blues warning flag
    systemData.bluesBrewing = systemData.blues.value >= 8;
  }

  /**
   * Prepare Ship type specific data
   */
  _prepareShipData(systemData) {
    // Ship stat clamp -1 to 3
    for (const stat of ["body", "mobility", "systems"]) {
      systemData.stats[stat].value = Math.clamp(
        systemData.stats[stat].value,
        -1,
        3
      );
    }
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareNPCData(systemData) {
    const muscle = systemData.stats.muscle.value ?? 0;
    systemData.heart.max = Math.max(1, 8 + muscle);
    systemData.heart.value = Math.clamp(
      systemData.heart.value,
      0,
      systemData.heart.max
    );
  }

  /**
   * Roll a Stat Check (2d6 + stat, target 8+)
   * @param {string} statKey - "muscle", "grit", or "savvy"
   * @param {string} [mode="normal"] - "normal", "upper", "odds"
   */
  async rollStatCheck(statKey, mode = "normal") {
    const statValue = this.system.stats[statKey]?.value ?? 0;
    const statLabel = game.i18n.localize(`ORBITAL_BLUES.Stats.${statKey.charAt(0).toUpperCase() + statKey.slice(1)}`);
    return OrbitalBluesActor.rollCheck({
      actor: this,
      label: `${game.i18n.localize("ORBITAL_BLUES.Rolls.StatCheck")}: ${statLabel}`,
      modifier: statValue,
      mode,
      type: "stat"
    });
  }

  /**
   * Roll a Blues Check (2d6 + Grit, target 8+)
   * On success (8+): gain 1 Blues
   * On fail (<8): no Blues gained
   */
  async rollBluesCheck() {
    const grit = this.system.stats.grit?.value ?? 0;
    const result = await OrbitalBluesActor.rollCheck({
      actor: this,
      label: game.i18n.localize("ORBITAL_BLUES.Rolls.BluesCheck"),
      modifier: grit,
      mode: "normal",
      type: "blues"
    });
    return result;
  }

  /**
   * Roll an Observation Check (2d6, no modifier, target 8+)
   */
  async rollObservationCheck() {
    return OrbitalBluesActor.rollCheck({
      actor: this,
      label: game.i18n.localize("ORBITAL_BLUES.Rolls.ObservationCheck"),
      modifier: 0,
      mode: "normal",
      type: "observation"
    });
  }

  /**
   * Core roll engine for Orbital Blues
   * @param {object} options
   * @param {OrbitalBluesActor} options.actor
   * @param {string} options.label
   * @param {number} options.modifier
   * @param {string} options.mode - "normal" | "upper" | "odds"
   * @param {string} options.type - "stat" | "blues" | "observation"
   */
  static async rollCheck({ actor, label, modifier, mode, type }) {
    const target = 8;

    // Build dice formula
    let formula;
    let diceDesc;
    if (mode === "upper") {
      formula = "3d6kh2";
      diceDesc = game.i18n.localize("ORBITAL_BLUES.Rolls.UpperHand");
    } else if (mode === "odds") {
      formula = "3d6kl2";
      diceDesc = game.i18n.localize("ORBITAL_BLUES.Rolls.AgainstTheOdds");
    } else {
      formula = "2d6";
      diceDesc = game.i18n.localize("ORBITAL_BLUES.Rolls.Normal");
    }

    const roll = new Roll(modifier !== 0 ? `${formula} + ${modifier}` : formula);
    await roll.evaluate();

    const total = roll.total;
    const success = total >= target;

    // Blues Check special handling
    let bluesFlavor = "";
    if (type === "blues" && actor) {
      if (success) {
        // Gain 1 Blues
        const currentBlues = actor.system.blues.value ?? 0;
        await actor.update({ "system.blues.value": currentBlues + 1 });
        bluesFlavor = `<p class="ob-roll-outcome ob-blues-gain">${actor.name} ${game.i18n.localize("ORBITAL_BLUES.Blues.Gained")} (total: ${currentBlues + 1})</p>`;
        if (currentBlues + 1 >= 8) {
          bluesFlavor += `<p class="ob-blues-brewing">🎵 ${game.i18n.localize("ORBITAL_BLUES.Blues.Brewing")}</p>`;
        }
      } else {
        bluesFlavor = `<p class="ob-roll-outcome ob-blues-none">${actor.name} ${game.i18n.localize("ORBITAL_BLUES.Blues.NoGained")}</p>`;
      }
    }

    // Chat message flavor
    const flavor = `
      <div class="ob-roll-card">
        <div class="ob-roll-header">
          <span class="ob-roll-label">${label}</span>
          <span class="ob-roll-mode">${diceDesc}</span>
        </div>
        <div class="ob-roll-target">${game.i18n.localize("ORBITAL_BLUES.Rolls.Target")}: ${target}${modifier !== 0 ? ` | Mod: ${modifier >= 0 ? "+" : ""}${modifier}` : ""}</div>
        <div class="ob-roll-result ${success ? "success" : "failure"}">
          ${success ? game.i18n.localize("ORBITAL_BLUES.Rolls.Success") : game.i18n.localize("ORBITAL_BLUES.Rolls.Failure")}
        </div>
        ${bluesFlavor}
      </div>
    `;

    await roll.toMessage({
      speaker: actor ? ChatMessage.getSpeaker({ actor }) : {},
      flavor,
      rollMode: game.settings.get("core", "rollMode")
    });

    return { roll, total, success };
  }
}

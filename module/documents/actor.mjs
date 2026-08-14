/**
 * Extension de la classe Actor pour Orbital Blues.
 */
export class OrbitalBluesActor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Rien pour l'instant : les stats sont définies telles quelles.
  }

  /** @override */
  prepareDerivedData() {
    const sys = this.system;

    // Bornage cœur / intégrité
    if (sys.resources?.heart) {
      sys.resources.heart.value = Math.clamp(
        sys.resources.heart.value ?? 0, 0,
        sys.resources.heart.max ?? 0
      );
    }
    if (sys.resources?.integrity) {
      sys.resources.integrity.value = Math.clamp(
        sys.resources.integrity.value ?? 0, 0,
        sys.resources.integrity.max ?? 0
      );
    }
    if (sys.resources?.blues) {
      sys.resources.blues.value = Math.clamp(
        sys.resources.blues.value ?? 0, 0,
        sys.resources.blues.max ?? 9
      );
    }
    if (sys.resources?.fuel) {
      sys.resources.fuel.value = Math.clamp(
        sys.resources.fuel.value ?? 0, 0,
        sys.resources.fuel.max ?? 0
      );
    }
    if (sys.resources?.cargoUsed) {
      sys.resources.cargoUsed.value = Math.clamp(
        sys.resources.cargoUsed.value ?? 0, 0,
        sys.resources.cargoUsed.max ?? 0
      );
    }

    // Nombre de Troubles — sert notamment au jet de mort (D6 <= nb Troubles → fin).
    sys.troublesCount = this.items?.filter((it) => it.type === "trouble").length ?? 0;
  }

  /**
   * Récupère les items d'un type donné (gambit, trouble, gear, cargo, shipPart)
   * @param {string} type
   */
  getItemsOfType(type) {
    return this.items.filter((it) => it.type === type);
  }
}

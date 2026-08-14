/**
 * Constantes de configuration — Orbital Blues
 */
export const OB = {};

OB.stats = {
  muscle: "OB.Stat.Muscle",
  grit:   "OB.Stat.Grit",
  savvy:  "OB.Stat.Savvy"
};

OB.shipStats = {
  engines: "OB.ShipStat.Engines",
  systems: "OB.ShipStat.Systems",
  hull:    "OB.ShipStat.Hull"
};

// Modes de jet (règles officielles) :
//  - normal      : 2d6
//  - upperHand   : Avantage — 3d6, on retire le plus bas (kh2)
//  - againstOdds : Désavantage — 3d6, on retire le plus haut (kl2)
OB.rollModes = {
  normal:      "OB.RollMode.Normal",
  upperHand:   "OB.RollMode.UpperHand",
  againstOdds: "OB.RollMode.AgainstOdds"
};

// Caractéristiques pouvant servir à une attaque (mêlée : Muscle ; distance : Astuce).
OB.attackStats = {
  muscle: "OB.Stat.Muscle",
  savvy:  "OB.Stat.Savvy"
};

// Seuil de réussite / difficulté par défaut.
OB.targetNumber = 8;

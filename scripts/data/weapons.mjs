/**
 * Armes de départ — source : page Notion « Equipements et Mementos ».
 * Mêlée → attaque au Muscle (Force) ; distance → attaque à l'Astuce (Savvy).
 * traits : traits + drawback. type : catégorie d'arme. rangeIdeal : portée idéale.
 */

// [name, type, traits]  — mêlée
export const MELEE_WEAPONS = [
  ["Knuckleduster", "Improvisée", "Stun"],
  ["Switchblade (cran d'arrêt)", "Improvisée", "Concealable"],
  ["Baseball Bat", "Improvisée", "Intimidating"],
  ["Baton (matraque)", "Improvisée", "Stun"],
  ["Tire Iron (démonte-pneu)", "Improvisée", "Stun"],
  ["Boot Knife", "Improvisée", "Concealable"],
  ["Crewman's Wrench (clé anglaise)", "Improvisée", "Stun"],
  ["Plasma Torch", "Improvisée", "Armour piercing"],
  ["Machete", "Mêlée", "Intimidating"],
  ["Mono-Edge Knife", "Mêlée", "Armour piercing"],
  ["Stun Gun", "Mêlée", "Stun"],
  ["Arme Martiale", "Martiale", "1 trait au choix (Armour piercing, Concealable, Deadly, Defensive, Intimidating ou Precise) + 1 drawback (Conspicuous ou Heavy)"]
];

// [name, type, traits]  — distance
export const RANGED_WEAPONS = [
  ["Pistol, Deringer", "Personnelle", "Concealable"],
  ["Pistol, Tranq", "Personnelle", "Stun"],
  ["Revolver, Snub-Nose", "Personnelle", "Concealable"],
  ["Pistol, Machine", "Personnelle", "Rapid Fire"],
  ["Pistol, 9mm", "Personnelle", "Precise"],
  ["Revolver, Single-Action", "Personnelle", "Intimidating"],
  ["Shotgun, Sawed-Off", "Personnelle", "Shot"],
  ["SMG", "Personnelle", "Rapid Fire"],
  ["Hand Cannon", "Militaire", "Armour piercing, Loud"],
  ["Rifle, Sniper", "Militaire", "Long Range, Limited ammo"],
  ["Rifle, Assault", "Militaire", "Rapid Fire, Loud"],
  ["Shotgun, 12-Gauge", "Militaire", "Intimidating, Loud"]
];

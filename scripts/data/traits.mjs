/**
 * Traits et désavantages d'armes — source : extraction du livre (Notion).
 * [nom FR, nom EN, catégorie, description]
 */
export const WEAPON_TRAITS = [
  ["Perforante", "Armour-Piercing", "trait", "Le seuil de réussite pour les attaques est toujours 8."],
  ["Entravante", "Bind", "trait", "En cas de réussite, la cible ne peut ni se déplacer ni agir lors de son prochain tour."],
  ["Dissimulable", "Concealable", "trait", "Petit, facile à dissimuler. Faites les tests pour le dissimuler avec Avantage."],
  ["Dangereuse", "Dangerous", "trait", "En cas de réussite, élimine automatiquement un sbire."],
  ["Létale", "Deadly", "trait", "En cas de réussite, élimine un sbire ou réduit la Taille d'une bande d'un point supplémentaire."],
  ["Défensive", "Defensive", "trait", "Quand vous vous défendez contre des attaques de mêlée, le seuil de réussite de votre adversaire est augmenté de 1."],
  ["Explosive", "Explosive", "trait", "Endommage les structures proches lorsqu'elle est utilisée. En cas de réussite, réduit la Taille d'une bande du double de la valeur normale. Choisissez Bruyante ou Munitions limitées en plus des inconvénients habituels."],
  ["Intimidante", "Intimidating", "trait", "Inspire la peur chez les individus faibles. Les intimidations faites avec cette arme se font avec l'Avantage."],
  ["Portée longue", "Long Ranged", "trait", "Peut tirer sur des cibles éloignées sans pénalité."],
  ["Silencieuse", "Silent", "trait", "Ne fait pas un bruit tonitruant lorsqu'elle est utilisée."],
  ["Étourdissante", "Stun", "trait", "Les cibles réduites à zéro Cœur sont inconscientes au lieu d'être mortes."],
  ["Tir rapide", "Rapid-Fire", "trait", "En cas de réussite, réduit la Taille d'une bande d'un point supplémentaire."],
  ["Précise", "Precise", "trait", "Peut attaquer un endroit précis sur ou près de la cible sans devoir lancer avec Désavantage."],
  ["Shrapnel", "Shot", "trait", "Tire de nombreux petits projectiles via une seule cartouche. Faites les attaques contre les cibles proches et à portée moyenne avec Avantage. Lancez avec Désavantage contre les cibles lointaines. Les attaques contre les cibles très éloignées sont impossibles."],
  ["Voyante", "Conspicuous", "drawback", "Lancez avec Désavantage pour les tests de dissimulation."],
  ["Bruyante", "Loud", "drawback", "Quand tu tires, même les gens sur la lune d'à côté l'entendent probablement. Les ennemis rappliquent."],
  ["Lourde", "Heavy", "drawback", "Nécessite au moins +1 en Force pour pouvoir le transporter."],
  ["Munitions limitées", "Limited Ammo", "drawback", "Les munitions sont rares, chères et lourdes. Attaquer avec impose une Dette."]
];

/** EN → FR (clés normalisées), pour traduire les traits des armes existantes. */
const norm = (s) => s.toLowerCase().replace(/[-\s]+/g, " ").trim();
export const TRAIT_EN_TO_FR = {
  ...Object.fromEntries(WEAPON_TRAITS.map(([fr, en]) => [norm(en), fr])),
  "armour piercing": "Perforante",
  "rapid fire": "Tir rapide",
  "long range": "Portée longue",
  "limited ammo": "Munitions limitées"
};
export const normTrait = norm;

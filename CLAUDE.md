# Orbital Blues — Foundry VTT System

Système de jeu complet pour **Orbital Blues** (Soul Muppet Publishing) sur **Foundry VTT V13**.
Lo-fi Space Western. 2d6 + stat, cible 8+.

GitHub : https://github.com/Baloo98815/foundryvtt-orbital-blues
Dossier Foundry (Mac) : `~/Library/Application Support/FoundryVTT/Data/systems/orbital-blues/`

---

## Structure du projet

```
orbital-blues/
├── system.json               Manifeste Foundry (id: orbital-blues)
├── template.json             Schéma de données des acteurs et objets
├── orbital-blues.mjs         Point d'entrée ESM — init, hooks, helpers HBS
├── module/
│   ├── documents/
│   │   ├── actor.mjs         OrbitalBluesActor (préparation données, rolls)
│   │   └── item.mjs          OrbitalBluesItem
│   └── sheets/
│       ├── actor-sheet.mjs   OrbitalBluesActorSheet (perso + PNJ)
│       ├── ship-sheet.mjs    OrbitalBluesShipSheet
│       └── item-sheet.mjs    OrbitalBluesItemSheet
├── templates/
│   ├── actor/
│   │   ├── character-sheet.hbs
│   │   └── ship-sheet.hbs
│   └── item/
│       ├── weapon-sheet.hbs
│       ├── equipment-sheet.hbs
│       ├── memento-sheet.hbs
│       ├── gambit-sheet.hbs
│       └── trouble-sheet.hbs
├── styles/orbital-blues.css  Esthétique vintage space-western
├── lang/
│   ├── en.json               Localisation anglais
│   └── fr.json               Localisation français
├── tests/
│   ├── mocks/foundry.mjs     Mocks globaux Foundry pour Vitest
│   ├── actor.test.mjs        Tests données acteur (15 tests)
│   ├── rolls.test.mjs        Tests moteur de dés (18 tests)
│   ├── sheets.test.mjs       Tests getData fiches (12 tests)
│   └── items.test.mjs        Tests fiche objet / traits (10 tests)
├── package.json              Vitest
└── vitest.config.mjs
```

---

## Types d'acteurs et d'objets

**Acteurs** : `character`, `ship`, `npc`
**Objets** : `weapon`, `equipment`, `memento`, `gambit`, `trouble`

---

## Mécanique de jeu principale

| Jet | Formule | Cible |
|-----|---------|-------|
| Stat Check | 2d6 + stat | 8+ |
| Upper Hand | 3d6kh2 + stat | 8+ |
| Against the Odds | 3d6kl2 + stat | 8+ |
| Blues Check | 2d6 + Grit | 8+ (succès = +1 Blues) |
| Observation | 2d6 (sans modif.) | 8+ |

- **Cœur (Heart)** = 8 + Muscle (min 1). Représente les PV.
- **Blues** : ressource 0–12. À 8+ → état "Blues Brewing" (animation CSS).
  À 12 → le personnage peut jouer sa chanson (mécanique narrative).
- **Stats** : Muscle, Grit, Savvy (valeurs –1 à 3).
- **Stats vaisseau** : Body, Mobility, Systems (valeurs –1 à 3).

---

## Points clés Foundry V13 (bugs déjà corrigés)

Ces changements V13 ont déjà été appliqués — ne pas les réintroduire :

1. **`await super.getData()`** — DocumentSheet.getData() est async en V13.
   Tous les sheets font `const context = await super.getData()`.

2. **`Math.clamp()`** — remplace l'ancien `Math.clamped()` (supprimé en V13).

3. **`TextEditor.enrichHTML()`** — doit être `await`-é. L'option `{async: false}` a été supprimée.

4. **`{{prosemirror}}`** — remplace le helper `{{editor}}` supprimé en V13.
   Usage : `{{prosemirror enrichedBiography name="system.biography" fieldLabel="Biography" editable=editable button=false}}`

5. **`String.prototype.capitalize()`** supprimé → utiliser `str.charAt(0).toUpperCase() + str.slice(1)`.

6. **`system.json`** — `gridDistance`/`gridUnits` remplacés par `"grid": { "distance": 1, "units": "m" }`.

---

## Synchronisation dossier Foundry

Après toute modification, synchroniser vers Foundry :

```bash
rsync -av --delete \
  ~/chemin/vers/orbital-blues/ \
  ~/Library/Application\ Support/FoundryVTT/Data/systems/orbital-blues/ \
  --exclude='.git' --exclude='node_modules' --exclude='.DS_Store'
```

Depuis la VM Claude (si dossiers montés) :
```bash
rsync -av --delete \
  /sessions/.../mnt/module-orbital-blues/orbital-blues/ \
  /sessions/.../mnt/systems/orbital-blues/ \
  --exclude='.git' --exclude='node_modules'
```

---

## Tests unitaires

```bash
npm test                # Lance tous les tests (55 tests)
npm run test:watch      # Mode watch (relance à chaque sauvegarde)
npm run test:coverage   # Rapport de couverture HTML
```

Mocks Foundry dans `tests/mocks/foundry.mjs`.
`__setRollTotal(n)` permet de contrôler le total des dés dans les tests de rolls.

---

## GitHub

Repo public : https://github.com/Baloo98815/foundryvtt-orbital-blues
Branche principale : `master`

Workflow git (depuis le Mac) :
```bash
git add -A
git commit -m "description"
git push origin master
```

---

## État du projet (mars 2026)

- [x] Système Foundry V13 fonctionnel
- [x] Fiche personnage complète (stats, cœur, blues, gambits, troubles, équipement)
- [x] Fiche vaisseau
- [x] Fiches objets (weapon, equipment, memento, gambit, trouble)
- [x] Moteur de dés complet (normal, Upper Hand, Against the Odds, Blues Check)
- [x] Localisation FR + EN
- [x] CSS vintage space-western
- [x] 55 tests unitaires Vitest (tous ✅)
- [x] Repo GitHub public
- [ ] Bouton Exertion (dépenser du Cœur pour relancer un dé)
- [ ] Automatisation initiative dans le Combat Tracker
- [ ] Icône système

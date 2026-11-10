# Orbital Blues — Système Foundry VTT (v14)

Système **non officiel** pour jouer à *Orbital Blues* (Sam Sleney & Zachary Cox / Soulmuppet Publishing) sur Foundry Virtual Tabletop. Usage privé.

Testé contre Foundry v14 build 365.

## Installation

### Option A — copie manuelle (recommandée pour usage privé)

1. Copier le dossier du système dans `Data/systems/orbital-blues/` de ton Foundry :
   - Windows : `%localappdata%/FoundryVTT/Data/systems/orbital-blues/`
   - macOS   : `~/Library/Application Support/FoundryVTT/Data/systems/orbital-blues/`
   - Linux   : `~/.local/share/FoundryVTT/Data/systems/orbital-blues/`
   - Ne copie **pas** `node_modules/` (inutile pour Foundry).
2. Relance Foundry, crée un nouveau monde en sélectionnant *Orbital Blues* comme système.

### Option B — installation par URL de manifeste

Dans Foundry : **Configuration → Systèmes de jeu → Installer un système**, puis colle
l'URL du manifeste en bas :

```
https://raw.githubusercontent.com/Baloo98815/foundryvtt-orbital-blues/main/system.json
```

> Nécessite qu'une release GitHub contienne le zip du système (champ `download` de
> `system.json`). Voir la section « Publier une release » ci-dessous.

## Structure

```
orbital-blues/
├── system.json          — manifeste (+ documentTypes)
├── module/              — code JS (ES modules)
│   ├── orbital-blues.mjs
│   ├── data/            — DataModels (schémas Actor / Item)
│   ├── documents/       — Actor / Item étendus
│   ├── sheets/          — feuilles Character / Ship / NPC / Item
│   └── helpers/         — config, jets de dés
├── templates/           — Handlebars
│   ├── actor/           — character / ship / npc
│   ├── item/            — gambit / trouble / gear / cargo / shipPart
│   ├── chat/            — carte de résultat
│   └── dialog/          — dialogue de jet
├── lang/                — fr.json, en.json
└── styles/              — CSS
```

## Mécaniques implémentées

Conformes au résumé des règles (jet **binaire**, seuil 8).

- **Trois stats personnage** : Muscle (Force), Grit (Cran), Savvy (Astuce).
- **Trois stats vaisseau** : Engines (Moteurs), Systems (Systèmes), Hull (Coque).
- **Test de caractéristique** : 2d6 + stat, **réussite si total ≥ 8**, sinon échec.
  - *Upper Hand* (avantage) : 3d6, on retire le plus bas.
  - *Against the Odds* (désavantage) : 3d6, on retire le plus haut.
- **Test de Perception** : 2d6 sans modificateur vs 8.
- **Blues Check** : 2d6 + Cran vs 8 → **+1 Blues** en cas de réussite (appliqué automatiquement).
- **Attaque** : 3d6 (4d6 avec avantage/désavantage), on garde 2 dés + stat vs Difficulté (défaut 8) ;
  le dé restant = dégâts + bonus d'arme. Le système choisit automatiquement le meilleur découpage
  (toucher tout en maximisant les dégâts).
- **Initiative** : 1d3 + Astuce. *(Variante mêlée 2d3 à déclarer manuellement.)*
- **Ressources personnage** : Heart, Blues (max 9, pour permettre Trouble's Brewing à 8), Cash.
- **Ressources vaisseau** : Integrity, Fuel, Cargo.
- **Items** : Gambit, Trouble, Gear (avec option « arme »), Cargo, Ship Part.
- Compteur de **Troubles** exposé (`actor.system.troublesCount`) pour le jet de mort.

### Armes

Coche « C'est une arme » sur un objet *Gear* pour révéler : caractéristique d'attaque (Muscle/Astuce),
difficulté et bonus de dégâts. Un bouton d'attaque (🎯) apparaît alors sur la ligne de l'objet
(Shift+clic = jet direct sans dialogue).

## Compendiums

Cinq compendiums sont livrés avec le système (127 entrées) :

| Compendium | Contenu | Type d'item |
|---|---|---|
| Gambits | 34 Gambits avec effet mécanique | `gambit` |
| Troubles | 20 Troubles (description, déclencheurs, questions) | `trouble` |
| Armes | 24 armes de départ (mêlée + distance) | `gear` (arme) |
| Équipement | 31 équipements d'équipage | `gear` |
| Mementos | 18 souvenirs de background | `gear` |

### Reconstruire les compendiums

La **source de vérité** est dans `scripts/data/*.mjs` (données) et `src/packs/**` (JSON
généré). Le dossier `packs/**` est la base **LevelDB** compilée que Foundry charge.

```bash
npm install           # une fois : installe le Foundry CLI
npm run build:packs   # régénère src/packs + packs à partir de scripts/data
```

Après un rebuild, **relance complètement Foundry** (les compendiums sont enregistrés au
chargement du système, un simple F5 ne suffit pas). Les compendiums livrés sont
verrouillés par défaut : clic droit → *Toggle Edit Lock* pour les modifier, ou glisse
les entrées dans un dossier/monde.

> Pour éditer le contenu : modifie `scripts/data/*.mjs` puis relance `npm run build:packs`.
> Ne modifie pas `packs/**` à la main (format binaire).

## Publier une release et mettre à jour Foundry

Foundry ne propose la mise à jour que si la `version` du manifeste est **supérieure** à celle installée.

1. **Monter la version** dans `system.json` (et `package.json`), par ex. `0.1.2`.
2. **Reconstruire les compendiums** si les données ont changé : `npm run build:packs`.
3. **Commit et push** sur `main`, sans oublier `packs/` (base LevelDB compilée).
4. **Créer le zip**, avec `system.json` à la racine, sans `node_modules`, `.git`, `src/` ni `scripts/` :

   ```bash
   zip -r system.zip system.json README.md module templates lang styles packs -x "*.DS_Store"
   ```

5. **Créer la release GitHub** (tag `v<version>`) avec `system.json` et `system.zip` :

   ```bash
   gh release create v0.1.2 system.zip system.json --title "v0.1.2" --notes "Description des changements"
   ```

6. **Sur le serveur Foundry (VPS)** : *Configuration → Systèmes de jeu* → bouton **Mettre à jour**
   à côté d'Orbital Blues. S'il n'apparaît pas, désinstaller puis réinstaller via l'URL du manifeste :

   ```
   https://github.com/Baloo98815/foundryvtt-orbital-blues/releases/latest/download/system.json
   ```

   Les mondes ne sont pas affectés.
7. **Relancer le serveur Foundry** (ou au moins le monde) : les compendiums ne sont rechargés
   qu'au démarrage.

**Alternative sans release** : copier les fichiers directement dans `Data/systems/orbital-blues/`
du VPS (`rsync` / `scp`), puis redémarrer Foundry.

## Encore à faire

Mécaniques non automatisées (narration MJ ou travail futur) :

1. **Jet de mort** à 0 Cœur (D6 vs nombre de Troubles), Knocking on Heaven's Door, Swansong.
2. **Effort/Exertion** : dépense de Cœur pour relancer des dés — non automatisé.
3. **Trouble's Brewing** : reset des Blues + choix de récompense en fin de scène.
4. **Diving Save**, **Soin** (2 jets Astuce + Force), portées de combat.
5. Application automatique des **dégâts** à une cible ciblée.

## Interactions

- **Onglet Principal** : jets rapides (clic sur bouton dé), Shift+clic = jet direct sans dialogue.
- **Onglet Objets** : gestion Gambits / Troubles / Gear.
- **Onglet Biographie** : concept, apparence, passé, biographie riche (ProseMirror).

## Licence

Code : MIT. *Orbital Blues* reste la propriété de Soulmuppet Publishing.

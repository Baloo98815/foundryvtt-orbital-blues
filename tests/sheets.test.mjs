/**
 * Tests — OrbitalBluesActorSheet.getData()
 *
 * Covers:
 *  • getData() returns actor, system, flags, config
 *  • Items are correctly sorted by type (weapons, equipment, gambits…)
 *  • Biography is enriched
 *  • Sheet can be instantiated for a character (no JS error)
 *  • Sheet can be instantiated for a ship
 */

import { OrbitalBluesActorSheet } from '../module/sheets/actor-sheet.mjs';
import { OrbitalBluesShipSheet }  from '../module/sheets/ship-sheet.mjs';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function makeItem(type, name = `A ${type}`) {
  return {
    _id: `${type}-id`,
    type,
    name,
    img: 'icons/svg/item-bag.svg',
    system: { description: `${name} description`, traits: [] }
  };
}

function makeCharacterActor(itemsArray = []) {
  const items = [...itemsArray];
  items.get = (id) => items.find(i => i._id === id);

  return {
    type: 'character',
    name: 'Rosa Malone',
    img: 'icons/mystery-man.svg',
    flags: {},
    isOwner: true,
    items,
    system: {
      stats: {
        muscle: { value: 1 },
        grit:   { value: 2 },
        savvy:  { value: 0 }
      },
      heart:     { value: 7, max: 9 },
      blues:     { value: 4 },
      credits:   50,
      debts:     20,
      savings:   100,
      biography: 'Once a mercenary...',
      notes:     '',
      bluesBrewing: false
    }
  };
}

function makeShipActor() {
  const items = [];
  items.get = () => undefined;
  return {
    type: 'ship',
    name: 'The Broken Compass',
    img: '',
    flags: {},
    isOwner: true,
    items,
    system: {
      stats: {
        body:     { value: 1 },
        mobility: { value: 2 },
        systems:  { value: 0 }
      },
      crewProjects: { pips: 0 },
      notes: ''
    }
  };
}

/* ------------------------------------------------------------------ */
/* Character sheet — getData() structure                               */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActorSheet — getData()', () => {
  it('returns context with actor, system, flags and config', async () => {
    const actor  = makeCharacterActor();
    const sheet  = new OrbitalBluesActorSheet(actor);
    const context = await sheet.getData();

    expect(context.actor).toBeDefined();
    expect(context.system).toBeDefined();
    expect(context.flags).toBeDefined();
    expect(context.config).toBeDefined();
    expect(context.config).toBe(CONFIG.ORBITAL_BLUES);
  });

  it('exposes system.stats on the context', async () => {
    const actor  = makeCharacterActor();
    const sheet  = new OrbitalBluesActorSheet(actor);
    const context = await sheet.getData();

    expect(context.system.stats).toBeDefined();
    expect(context.system.stats.muscle.value).toBe(1);
    expect(context.system.stats.grit.value).toBe(2);
  });

  it('enriches biography HTML', async () => {
    const actor  = makeCharacterActor();
    const sheet  = new OrbitalBluesActorSheet(actor);
    const context = await sheet.getData();

    // TextEditor.enrichHTML is mocked to return text as-is
    expect(context.enrichedBiography).toBe('Once a mercenary...');
  });

  it('returns empty arrays when no items', async () => {
    const actor  = makeCharacterActor([]);
    const sheet  = new OrbitalBluesActorSheet(actor);
    const context = await sheet.getData();

    expect(context.weapons).toEqual([]);
    expect(context.equipment).toEqual([]);
    expect(context.gambits).toEqual([]);
    expect(context.troubles).toEqual([]);
    expect(context.mementos).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* Character sheet — item grouping                                     */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActorSheet — item grouping', () => {
  it('puts weapons in context.weapons', async () => {
    const actor = makeCharacterActor([
      makeItem('weapon', 'Rusty Revolver'),
      makeItem('weapon', 'Plasma Knife')
    ]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.weapons).toHaveLength(2);
    expect(context.weapons[0].name).toBe('Rusty Revolver');
  });

  it('puts equipment in context.equipment', async () => {
    const actor = makeCharacterActor([makeItem('equipment', 'Medkit')]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.equipment).toHaveLength(1);
    expect(context.equipment[0].name).toBe('Medkit');
  });

  it('puts gambits in context.gambits', async () => {
    const actor = makeCharacterActor([makeItem('gambit', 'Quick Draw')]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.gambits).toHaveLength(1);
    expect(context.gambits[0].name).toBe('Quick Draw');
  });

  it('puts troubles in context.troubles', async () => {
    const actor = makeCharacterActor([makeItem('trouble', 'Wanted')]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.troubles).toHaveLength(1);
    expect(context.troubles[0].name).toBe('Wanted');
  });

  it('puts mementos in context.mementos', async () => {
    const actor = makeCharacterActor([makeItem('memento', 'Old Photo')]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.mementos).toHaveLength(1);
    expect(context.mementos[0].name).toBe('Old Photo');
  });

  it('separates mixed items correctly', async () => {
    const actor = makeCharacterActor([
      makeItem('weapon', 'Gun'),
      makeItem('gambit', 'Sneak'),
      makeItem('trouble', 'Debt'),
      makeItem('equipment', 'Rope'),
      makeItem('memento', 'Ring')
    ]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.weapons).toHaveLength(1);
    expect(context.gambits).toHaveLength(1);
    expect(context.troubles).toHaveLength(1);
    expect(context.equipment).toHaveLength(1);
    expect(context.mementos).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/* Ship sheet — getData() structure                                    */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesShipSheet — getData()', () => {
  it('returns context with actor, system and config', async () => {
    const actor  = makeShipActor();
    const sheet  = new OrbitalBluesShipSheet(actor);
    const context = await sheet.getData();

    expect(context.actor).toBeDefined();
    expect(context.system).toBeDefined();
    expect(context.config).toBeDefined();
  });

  it('exposes ship stats', async () => {
    const actor  = makeShipActor();
    const sheet  = new OrbitalBluesShipSheet(actor);
    const context = await sheet.getData();

    expect(context.system.stats.body.value).toBe(1);
    expect(context.system.stats.mobility.value).toBe(2);
    expect(context.system.stats.systems.value).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* NPC sheet — getData() structure                                     */
/* ------------------------------------------------------------------ */

function makeNPCActor() {
  const items = [];
  items.get = () => undefined;
  return {
    type: 'npc',
    name: 'Space Bandit',
    img:  '',
    flags: {},
    isOwner: true,
    items,
    system: {
      stats: {
        muscle: { value: 1 },
        grit:   { value: 0 },
        savvy:  { value: -1 }
      },
      heart:     { value: 6, max: 9 },
      biography: 'A ruthless outlaw.',
      notes:     ''
    }
  };
}

describe('OrbitalBluesActorSheet — NPC sheet', () => {
  it('can be instantiated for an NPC without throwing', () => {
    expect(() => new OrbitalBluesActorSheet(makeNPCActor())).not.toThrow();
  });

  it('getData() returns actor and system for NPC', async () => {
    const context = await new OrbitalBluesActorSheet(makeNPCActor()).getData();

    expect(context.actor).toBeDefined();
    expect(context.system).toBeDefined();
    expect(context.system.stats.muscle.value).toBe(1);
    expect(context.system.stats.savvy.value).toBe(-1);
  });

  it('getData() returns empty item arrays for NPC with no items', async () => {
    const context = await new OrbitalBluesActorSheet(makeNPCActor()).getData();

    expect(context.weapons).toEqual([]);
    expect(context.gambits).toEqual([]);
    expect(context.troubles).toEqual([]);
    expect(context.equipment).toEqual([]);
    expect(context.mementos).toEqual([]);
  });

  it('getData() enriches NPC biography', async () => {
    const context = await new OrbitalBluesActorSheet(makeNPCActor()).getData();
    // mock enrichHTML returns text as-is
    expect(context.enrichedBiography).toBe('A ruthless outlaw.');
  });

  it('getData() enriches empty biography without crashing', async () => {
    const actor   = makeNPCActor();
    actor.system.biography = '';
    const context = await new OrbitalBluesActorSheet(actor).getData();
    expect(context.enrichedBiography).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/* ActorSheet — item default icon                                      */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActorSheet — item default icon', () => {
  it('assigns Item.DEFAULT_ICON to items whose img is falsy', async () => {
    const noImgItem = {
      _id: 'item-no-img',
      type: 'weapon',
      name: 'Mystery Blaster',
      img:  null,
      system: { traits: [] }
    };
    const actor   = makeCharacterActor([noImgItem]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.weapons[0].img).toBe(Item.DEFAULT_ICON);
  });

  it('keeps the existing img when item already has one', async () => {
    const imgItem = {
      _id:  'item-has-img',
      type: 'gambit',
      name: 'Daring Escape',
      img:  'icons/svg/dagger.svg',
      system: {}
    };
    const actor   = makeCharacterActor([imgItem]);
    const context = await new OrbitalBluesActorSheet(actor).getData();

    expect(context.gambits[0].img).toBe('icons/svg/dagger.svg');
  });
});

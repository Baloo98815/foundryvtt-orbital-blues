/**
 * Tests — OrbitalBluesItemSheet
 *
 * Covers:
 *  • getData() returns system, config, enrichedDescription
 *  • Weapon getData() builds traitCheckboxes with correct checked state
 *  • _onTraitChange adds a new trait to the array
 *  • _onTraitChange removes an existing trait
 *  • _onTraitChange ignores duplicate additions
 */

import { OrbitalBluesItemSheet } from '../module/sheets/item-sheet.mjs';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function makeWeaponItem(overrides = {}) {
  return {
    type:    'weapon',
    name:    'Pulse Revolver',
    img:     'icons/svg/item-bag.svg',
    isOwner: true,
    system: {
      description: 'A sleek handgun.',
      category:    'ranged',
      subcategory: 'personal',
      traits:      ['rapid-fire'],
      ...overrides.system
    },
    async update(data) {
      for (const [key, value] of Object.entries(data)) {
        foundry.utils.setProperty(this, key, value);
      }
      return this;
    },
    ...overrides
  };
}

function makeEquipmentItem() {
  return {
    type:    'equipment',
    name:    'Medkit',
    img:     'icons/svg/item-bag.svg',
    isOwner: true,
    system:  { description: 'Heals stuff.', integrated: false, bulky: false },
    async update(data) {
      for (const [key, value] of Object.entries(data)) {
        foundry.utils.setProperty(this, key, value);
      }
      return this;
    }
  };
}

/* ------------------------------------------------------------------ */
/* getData() — base fields                                             */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesItemSheet — getData()', () => {
  it('returns system, config, and enrichedDescription', async () => {
    const item   = makeEquipmentItem();
    const sheet  = new OrbitalBluesItemSheet(item);
    const context = await sheet.getData();

    expect(context.system).toBeDefined();
    expect(context.config).toBe(CONFIG.ORBITAL_BLUES);
    expect(context.enrichedDescription).toBe('Heals stuff.');
  });

  it('enriches description via TextEditor.enrichHTML', async () => {
    const item  = makeEquipmentItem();
    item.system.description = 'Custom description text.';
    const sheet = new OrbitalBluesItemSheet(item);
    const context = await sheet.getData();

    // Mock returns text as-is
    expect(context.enrichedDescription).toBe('Custom description text.');
  });
});

/* ------------------------------------------------------------------ */
/* getData() — weapon-specific traitCheckboxes                        */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesItemSheet — weapon traitCheckboxes', () => {
  it('builds a traitCheckboxes array for weapons', async () => {
    const item    = makeWeaponItem({ system: { traits: ['rapid-fire'], description: '', category: 'ranged', subcategory: 'personal' } });
    const sheet   = new OrbitalBluesItemSheet(item);
    const context = await sheet.getData();

    expect(Array.isArray(context.traitCheckboxes)).toBe(true);
    expect(context.traitCheckboxes.length).toBe(CONFIG.ORBITAL_BLUES.weaponTraits.length);
  });

  it('marks selected traits as checked = true', async () => {
    const item    = makeWeaponItem({ system: { traits: ['rapid-fire', 'deadly'], description: '', category: 'ranged', subcategory: 'personal' } });
    const sheet   = new OrbitalBluesItemSheet(item);
    const context = await sheet.getData();

    const rapidFire = context.traitCheckboxes.find(t => t.key === 'rapid-fire');
    const deadly    = context.traitCheckboxes.find(t => t.key === 'deadly');
    expect(rapidFire.checked).toBe(true);
    expect(deadly.checked).toBe(true);
  });

  it('marks unselected traits as checked = false', async () => {
    const item    = makeWeaponItem({ system: { traits: ['rapid-fire'], description: '', category: 'ranged', subcategory: 'personal' } });
    const sheet   = new OrbitalBluesItemSheet(item);
    const context = await sheet.getData();

    const stun = context.traitCheckboxes.find(t => t.key === 'stun');
    expect(stun.checked).toBe(false);
  });

  it('returns no traitCheckboxes for non-weapon items', async () => {
    const item    = makeEquipmentItem();
    const sheet   = new OrbitalBluesItemSheet(item);
    const context = await sheet.getData();

    expect(context.traitCheckboxes).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/* Item helpers for other types                                        */
/* ------------------------------------------------------------------ */

function makeMementoItem(overrides = {}) {
  return {
    type:    'memento',
    name:    'Cracked Locket',
    img:     'icons/svg/item-bag.svg',
    isOwner: true,
    system:  { description: 'A keepsake from home.', source: '', ...overrides.system },
    async update(data) {
      for (const [key, value] of Object.entries(data)) {
        foundry.utils.setProperty(this, key, value);
      }
      return this;
    },
    ...overrides
  };
}

function makeGambitItem(overrides = {}) {
  return {
    type:    'gambit',
    name:    'Quick Draw',
    img:     'icons/svg/item-bag.svg',
    isOwner: true,
    system:  { description: 'React before the other guy.', source: '', ...overrides.system },
    async update(data) {
      for (const [key, value] of Object.entries(data)) {
        foundry.utils.setProperty(this, key, value);
      }
      return this;
    },
    ...overrides
  };
}

function makeTroubleItem(overrides = {}) {
  return {
    type:    'trouble',
    name:    'Wanted',
    img:     'icons/svg/item-bag.svg',
    isOwner: true,
    system:  { description: 'Bounty on your head.', source: '', bluesTriggers: 'When confronted by law.', ...overrides.system },
    async update(data) {
      for (const [key, value] of Object.entries(data)) {
        foundry.utils.setProperty(this, key, value);
      }
      return this;
    },
    ...overrides
  };
}

/* ------------------------------------------------------------------ */
/* getData() — memento                                                 */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesItemSheet — memento getData()', () => {
  it('returns system, config, enrichedDescription', async () => {
    const context = await new OrbitalBluesItemSheet(makeMementoItem()).getData();

    expect(context.system).toBeDefined();
    expect(context.config).toBe(CONFIG.ORBITAL_BLUES);
    expect(context.enrichedDescription).toBe('A keepsake from home.');
  });

  it('does not include traitCheckboxes', async () => {
    const context = await new OrbitalBluesItemSheet(makeMementoItem()).getData();
    expect(context.traitCheckboxes).toBeUndefined();
  });

  it('enriches empty description without crashing', async () => {
    const item    = makeMementoItem({ system: { description: '', source: '' } });
    const context = await new OrbitalBluesItemSheet(item).getData();
    expect(context.enrichedDescription).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/* getData() — gambit                                                  */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesItemSheet — gambit getData()', () => {
  it('returns system, config, enrichedDescription', async () => {
    const context = await new OrbitalBluesItemSheet(makeGambitItem()).getData();

    expect(context.system).toBeDefined();
    expect(context.config).toBe(CONFIG.ORBITAL_BLUES);
    expect(context.enrichedDescription).toBe('React before the other guy.');
  });

  it('does not include traitCheckboxes', async () => {
    const context = await new OrbitalBluesItemSheet(makeGambitItem()).getData();
    expect(context.traitCheckboxes).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/* getData() — trouble                                                 */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesItemSheet — trouble getData()', () => {
  it('returns system, config, enrichedDescription', async () => {
    const context = await new OrbitalBluesItemSheet(makeTroubleItem()).getData();

    expect(context.system).toBeDefined();
    expect(context.config).toBe(CONFIG.ORBITAL_BLUES);
    expect(context.enrichedDescription).toBe('Bounty on your head.');
  });

  it('exposes bluesTriggers in system', async () => {
    const context = await new OrbitalBluesItemSheet(makeTroubleItem()).getData();
    expect(context.system.bluesTriggers).toBe('When confronted by law.');
  });

  it('does not include traitCheckboxes', async () => {
    const context = await new OrbitalBluesItemSheet(makeTroubleItem()).getData();
    expect(context.traitCheckboxes).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/* Template path — dynamic per item type                               */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesItemSheet — template path', () => {
  it.each([
    ['weapon',    'systems/orbital-blues/templates/item/weapon-sheet.hbs'],
    ['equipment', 'systems/orbital-blues/templates/item/equipment-sheet.hbs'],
    ['memento',   'systems/orbital-blues/templates/item/memento-sheet.hbs'],
    ['gambit',    'systems/orbital-blues/templates/item/gambit-sheet.hbs'],
    ['trouble',   'systems/orbital-blues/templates/item/trouble-sheet.hbs'],
  ])('type "%s" resolves to correct .hbs path', (type, expectedPath) => {
    const item  = { type, name: 'Test', img: '', isOwner: true, system: { description: '', traits: [] } };
    const sheet = new OrbitalBluesItemSheet(item);
    expect(sheet.template).toBe(expectedPath);
  });
});

/* ------------------------------------------------------------------ */
/* _onTraitChange — add / remove traits                                */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesItemSheet — _onTraitChange', () => {
  /**
   * Simulate a checkbox change event.
   */
  function fakeEvent(traitKey, checked) {
    return {
      currentTarget: {
        dataset: { trait: traitKey },
        checked
      }
    };
  }

  it('adds a new trait when checked = true', async () => {
    const item  = makeWeaponItem({ system: { traits: ['rapid-fire'], description: '', category: 'ranged', subcategory: 'personal' } });
    const sheet = new OrbitalBluesItemSheet(item);

    await sheet._onTraitChange(fakeEvent('stun', true));

    expect(item.system.traits).toContain('rapid-fire');
    expect(item.system.traits).toContain('stun');
  });

  it('removes a trait when checked = false', async () => {
    const item  = makeWeaponItem({ system: { traits: ['rapid-fire', 'stun'], description: '', category: 'ranged', subcategory: 'personal' } });
    const sheet = new OrbitalBluesItemSheet(item);

    await sheet._onTraitChange(fakeEvent('stun', false));

    expect(item.system.traits).toContain('rapid-fire');
    expect(item.system.traits).not.toContain('stun');
  });

  it('does not add duplicate traits', async () => {
    const item  = makeWeaponItem({ system: { traits: ['rapid-fire'], description: '', category: 'ranged', subcategory: 'personal' } });
    const sheet = new OrbitalBluesItemSheet(item);

    await sheet._onTraitChange(fakeEvent('rapid-fire', true)); // already in list

    const count = item.system.traits.filter(t => t === 'rapid-fire').length;
    expect(count).toBe(1);
  });

  it('removing a trait that is not present does nothing', async () => {
    const item  = makeWeaponItem({ system: { traits: ['rapid-fire'], description: '', category: 'ranged', subcategory: 'personal' } });
    const sheet = new OrbitalBluesItemSheet(item);

    await sheet._onTraitChange(fakeEvent('stun', false)); // 'stun' not in list

    expect(item.system.traits).toEqual(['rapid-fire']);
  });
});

/**
 * Tests — OrbitalBluesActor
 *
 * Covers:
 *  • Character heart.max formula (8 + Muscle)
 *  • heart.value clamping
 *  • bluesBrewing flag
 *  • Ship stat clamping
 *  • NPC heart formula
 */

import { OrbitalBluesActor } from '../module/documents/actor.mjs';

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

/**
 * Build a character actor with sane defaults, overridable via `overrides`.
 */
function makeCharacter(overrides = {}) {
  const data = {
    type: 'character',
    name: 'Test Cowboy',
    system: {
      stats: {
        muscle: { value: 0 },
        grit:   { value: 0 },
        savvy:  { value: 0 }
      },
      heart: { value: 5, max: 8, min: 0 },
      blues: { value: 0 },
      credits: 0, debts: 0, savings: 0,
      biography: '', notes: '',
      ...overrides.system
    },
    ...overrides
  };
  return new OrbitalBluesActor(data);
}

function makeShip(overrides = {}) {
  return new OrbitalBluesActor({
    type: 'ship',
    name: 'The Rusted Mule',
    system: {
      stats: {
        body:     { value: 1 },
        mobility: { value: 1 },
        systems:  { value: 1 }
      },
      ...overrides.system
    },
    ...overrides
  });
}

/* ------------------------------------------------------------------ */
/* Character — heart.max = 8 + Muscle                                  */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — character heart.max', () => {
  it('is 8 when Muscle = 0', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 5, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.heart.max).toBe(8);
  });

  it('is 10 when Muscle = 2', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 2 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 5, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.heart.max).toBe(10);
  });

  it('is 7 when Muscle = -1', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: -1 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 5, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.heart.max).toBe(7);
  });

  it('is at least 1 even with extreme negative Muscle', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: -99 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 0, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.heart.max).toBeGreaterThanOrEqual(1);
  });
});

/* ------------------------------------------------------------------ */
/* Character — heart.value clamping                                    */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — heart.value clamping', () => {
  it('clamps heart.value to [0, heart.max]', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 999, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.heart.value).toBe(8);
  });

  it('clamps negative heart.value to 0', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: -5, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.heart.value).toBe(0);
  });

  it('leaves heart.value unchanged when already in range', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 4, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.heart.value).toBe(4);
  });
});

/* ------------------------------------------------------------------ */
/* Character — bluesBrewing flag                                       */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — bluesBrewing flag', () => {
  it('is false when blues < 8', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 5, max: 8 }, blues: { value: 7 } } });
    actor.prepareDerivedData();
    expect(actor.system.bluesBrewing).toBe(false);
  });

  it('is true when blues = 8', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 5, max: 8 }, blues: { value: 8 } } });
    actor.prepareDerivedData();
    expect(actor.system.bluesBrewing).toBe(true);
  });

  it('is true when blues > 8', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 5, max: 8 }, blues: { value: 11 } } });
    actor.prepareDerivedData();
    expect(actor.system.bluesBrewing).toBe(true);
  });

  it('is false when blues = 0', () => {
    const actor = makeCharacter({ system: { stats: { muscle: { value: 0 }, grit: { value: 0 }, savvy: { value: 0 } }, heart: { value: 5, max: 8 }, blues: { value: 0 } } });
    actor.prepareDerivedData();
    expect(actor.system.bluesBrewing).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* Ship — stat clamping [-1, 3]                                        */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — ship stat clamping', () => {
  it('clamps stats above 3 down to 3', () => {
    const actor = makeShip({ system: { stats: { body: { value: 99 }, mobility: { value: 1 }, systems: { value: 1 } } } });
    actor.prepareDerivedData();
    expect(actor.system.stats.body.value).toBe(3);
  });

  it('clamps stats below -1 up to -1', () => {
    const actor = makeShip({ system: { stats: { body: { value: -5 }, mobility: { value: 1 }, systems: { value: 1 } } } });
    actor.prepareDerivedData();
    expect(actor.system.stats.body.value).toBe(-1);
  });

  it('leaves valid stats unchanged', () => {
    const actor = makeShip({ system: { stats: { body: { value: 2 }, mobility: { value: -1 }, systems: { value: 0 } } } });
    actor.prepareDerivedData();
    expect(actor.system.stats.body.value).toBe(2);
    expect(actor.system.stats.mobility.value).toBe(-1);
    expect(actor.system.stats.systems.value).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* NPC — same heart formula as character                               */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — NPC heart', () => {
  it('has heart.max = 8 + Muscle', () => {
    const actor = new OrbitalBluesActor({
      type: 'npc',
      name: 'Space Bandit',
      system: {
        stats: { muscle: { value: 1 }, grit: { value: 0 }, savvy: { value: 0 } },
        heart: { value: 5, max: 8 }
      }
    });
    actor.prepareDerivedData();
    expect(actor.system.heart.max).toBe(9);
  });
});

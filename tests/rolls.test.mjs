/**
 * Tests — Roll engine (OrbitalBluesActor.rollCheck)
 *
 * Covers:
 *  • Correct dice formula per mode (normal / upper hand / against the odds)
 *  • Modifier added to formula
 *  • Success when total ≥ 8, failure when total < 8
 *  • Blues Check: blues.value increments on success, unchanged on failure
 *  • rollStatCheck uses the right stat modifier
 *  • rollBluesCheck uses Grit
 *  • rollObservationCheck uses no modifier
 */

import { OrbitalBluesActor } from '../module/documents/actor.mjs';

/* ------------------------------------------------------------------ */
/* Helper — build a ready actor                                        */
/* ------------------------------------------------------------------ */

function makeActor(systemOverrides = {}) {
  return new OrbitalBluesActor({
    type: 'character',
    name: 'Dice Rider',
    system: {
      stats: {
        muscle: { value: 2 },
        grit:   { value: 1 },
        savvy:  { value: 0 }
      },
      heart: { value: 8, max: 10 },
      blues: { value: 3 },
      ...systemOverrides
    }
  });
}

/* ------------------------------------------------------------------ */
/* rollCheck — dice formulas                                           */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor.rollCheck — dice formula', () => {
  it('uses 2d6 in normal mode (no modifier)', async () => {
    __setRollTotal(9);
    const createdFormulas = [];
    const OriginalRoll = global.Roll;
    global.Roll = class extends OriginalRoll {
      constructor(formula) {
        super(formula);
        createdFormulas.push(formula);
      }
    };

    await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });

    expect(createdFormulas[0]).toBe('2d6');
    global.Roll = OriginalRoll;
  });

  it('adds modifier to formula when modifier ≠ 0', async () => {
    __setRollTotal(9);
    const createdFormulas = [];
    const OriginalRoll = global.Roll;
    global.Roll = class extends OriginalRoll {
      constructor(formula) { super(formula); createdFormulas.push(formula); }
    };

    await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 2, mode: 'normal', type: 'stat'
    });

    expect(createdFormulas[0]).toBe('2d6 + 2');
    global.Roll = OriginalRoll;
  });

  it('uses 3d6kh2 in Upper Hand mode', async () => {
    __setRollTotal(9);
    const createdFormulas = [];
    const OriginalRoll = global.Roll;
    global.Roll = class extends OriginalRoll {
      constructor(formula) { super(formula); createdFormulas.push(formula); }
    };

    await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'upper', type: 'stat'
    });

    expect(createdFormulas[0]).toBe('3d6kh2');
    global.Roll = OriginalRoll;
  });

  it('uses 3d6kl2 in Against the Odds mode', async () => {
    __setRollTotal(9);
    const createdFormulas = [];
    const OriginalRoll = global.Roll;
    global.Roll = class extends OriginalRoll {
      constructor(formula) { super(formula); createdFormulas.push(formula); }
    };

    await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'odds', type: 'stat'
    });

    expect(createdFormulas[0]).toBe('3d6kl2');
    global.Roll = OriginalRoll;
  });
});

/* ------------------------------------------------------------------ */
/* rollCheck — success / failure (target = 8)                         */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor.rollCheck — success / failure', () => {
  it('returns success = true when total = 8 (exact target)', async () => {
    __setRollTotal(8);
    const result = await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });
    expect(result.success).toBe(true);
  });

  it('returns success = true when total > 8', async () => {
    __setRollTotal(12);
    const result = await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });
    expect(result.success).toBe(true);
  });

  it('returns success = false when total = 7 (just below target)', async () => {
    __setRollTotal(7);
    const result = await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });
    expect(result.success).toBe(false);
  });

  it('returns success = false when total = 2 (minimum roll)', async () => {
    __setRollTotal(2);
    const result = await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });
    expect(result.success).toBe(false);
  });

  it('returns the roll total in the result object', async () => {
    __setRollTotal(10);
    const result = await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });
    expect(result.total).toBe(10);
  });
});

/* ------------------------------------------------------------------ */
/* Blues Check — blues.value updates                                   */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor.rollCheck — Blues Check', () => {
  it('increments blues.value by 1 on success', async () => {
    __setRollTotal(9); // success
    const actor = makeActor({ blues: { value: 3 } });

    await OrbitalBluesActor.rollCheck({
      actor, label: 'Blues Check', modifier: 1, mode: 'normal', type: 'blues'
    });

    expect(actor.system.blues.value).toBe(4);
  });

  it('does NOT change blues.value on failure', async () => {
    __setRollTotal(5); // failure
    const actor = makeActor({ blues: { value: 3 } });

    await OrbitalBluesActor.rollCheck({
      actor, label: 'Blues Check', modifier: 1, mode: 'normal', type: 'blues'
    });

    expect(actor.system.blues.value).toBe(3);
  });

  it('can push blues.value past 8 (brewing threshold)', async () => {
    __setRollTotal(10); // success
    const actor = makeActor({ blues: { value: 7 } });

    await OrbitalBluesActor.rollCheck({
      actor, label: 'Blues Check', modifier: 0, mode: 'normal', type: 'blues'
    });

    expect(actor.system.blues.value).toBe(8);
  });
});

/* ------------------------------------------------------------------ */
/* rollStatCheck — uses correct stat modifier                          */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — rollStatCheck', () => {
  it('passes the muscle stat value as modifier', async () => {
    __setRollTotal(9);
    const capturedModifiers = [];
    const actor = makeActor(); // muscle = 2

    // Spy on rollCheck to capture its arguments
    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedModifiers.push(opts.modifier);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollStatCheck('muscle', 'normal');

    expect(capturedModifiers[0]).toBe(2); // muscle value = 2
    OrbitalBluesActor.rollCheck = original;
  });

  it('passes the grit stat value as modifier', async () => {
    __setRollTotal(9);
    const capturedModifiers = [];
    const actor = makeActor(); // grit = 1

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedModifiers.push(opts.modifier);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollStatCheck('grit', 'normal');

    expect(capturedModifiers[0]).toBe(1); // grit value = 1
    OrbitalBluesActor.rollCheck = original;
  });

  it('passes mode = "upper" when called with upper hand', async () => {
    __setRollTotal(11);
    const capturedModes = [];
    const actor = makeActor();

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedModes.push(opts.mode);
      return { roll: {}, total: 11, success: true };
    };

    await actor.rollStatCheck('muscle', 'upper');

    expect(capturedModes[0]).toBe('upper');
    OrbitalBluesActor.rollCheck = original;
  });
});

/* ------------------------------------------------------------------ */
/* rollBluesCheck — uses Grit                                          */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — rollBluesCheck', () => {
  it('uses Grit as the modifier', async () => {
    __setRollTotal(9);
    const capturedModifiers = [];
    const actor = makeActor(); // grit = 1

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedModifiers.push(opts.modifier);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollBluesCheck();

    expect(capturedModifiers[0]).toBe(1); // grit = 1
    OrbitalBluesActor.rollCheck = original;
  });

  it('uses type = "blues"', async () => {
    __setRollTotal(9);
    const capturedTypes = [];
    const actor = makeActor();

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedTypes.push(opts.type);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollBluesCheck();

    expect(capturedTypes[0]).toBe('blues');
    OrbitalBluesActor.rollCheck = original;
  });
});

/* ------------------------------------------------------------------ */
/* rollObservationCheck — no modifier                                  */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — rollObservationCheck', () => {
  it('uses modifier = 0 (no stat bonus)', async () => {
    __setRollTotal(9);
    const capturedModifiers = [];
    const actor = makeActor();

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedModifiers.push(opts.modifier);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollObservationCheck();

    expect(capturedModifiers[0]).toBe(0);
    OrbitalBluesActor.rollCheck = original;
  });

  it('uses type = "observation"', async () => {
    __setRollTotal(9);
    const capturedTypes = [];
    const actor = makeActor();

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedTypes.push(opts.type);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollObservationCheck();

    expect(capturedTypes[0]).toBe('observation');
    OrbitalBluesActor.rollCheck = original;
  });
});

/* ------------------------------------------------------------------ */
/* rollCheck — formulas with modifier (all three modes)               */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor.rollCheck — formulas with modifier', () => {
  function captureFormula() {
    const formulas = [];
    const OriginalRoll = global.Roll;
    global.Roll = class extends OriginalRoll {
      constructor(formula) { super(formula); formulas.push(formula); }
    };
    return { formulas, restore: () => { global.Roll = OriginalRoll; } };
  }

  it('normal mode with modifier → "2d6 + 2"', async () => {
    __setRollTotal(9);
    const { formulas, restore } = captureFormula();
    await OrbitalBluesActor.rollCheck({ actor: makeActor(), label: 'Test', modifier: 2, mode: 'normal', type: 'stat' });
    expect(formulas[0]).toBe('2d6 + 2');
    restore();
  });

  it('Upper Hand with modifier → "3d6kh2 + 1"', async () => {
    __setRollTotal(11);
    const { formulas, restore } = captureFormula();
    await OrbitalBluesActor.rollCheck({ actor: makeActor(), label: 'Test', modifier: 1, mode: 'upper', type: 'stat' });
    expect(formulas[0]).toBe('3d6kh2 + 1');
    restore();
  });

  it('Against the Odds with modifier → "3d6kl2 + 3"', async () => {
    __setRollTotal(8);
    const { formulas, restore } = captureFormula();
    await OrbitalBluesActor.rollCheck({ actor: makeActor(), label: 'Test', modifier: 3, mode: 'odds', type: 'stat' });
    expect(formulas[0]).toBe('3d6kl2 + 3');
    restore();
  });

  it('negative modifier → "2d6 + -1" (valid Foundry formula)', async () => {
    __setRollTotal(6);
    const { formulas, restore } = captureFormula();
    await OrbitalBluesActor.rollCheck({ actor: makeActor(), label: 'Test', modifier: -1, mode: 'normal', type: 'stat' });
    expect(formulas[0]).toBe('2d6 + -1');
    restore();
  });

  it('modifier = 0 → formula without modifier suffix', async () => {
    __setRollTotal(9);
    const { formulas, restore } = captureFormula();
    await OrbitalBluesActor.rollCheck({ actor: makeActor(), label: 'Test', modifier: 0, mode: 'upper', type: 'stat' });
    expect(formulas[0]).toBe('3d6kh2');
    restore();
  });
});

/* ------------------------------------------------------------------ */
/* rollCheck — result object structure                                 */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor.rollCheck — result object', () => {
  it('returns { roll, total, success }', async () => {
    __setRollTotal(10);
    const result = await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });
    expect(result).toHaveProperty('roll');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('success');
  });

  it('total in result matches mocked roll total', async () => {
    __setRollTotal(5);
    const result = await OrbitalBluesActor.rollCheck({
      actor: makeActor(), label: 'Test', modifier: 0, mode: 'normal', type: 'stat'
    });
    expect(result.total).toBe(5);
  });
});

/* ------------------------------------------------------------------ */
/* rollStatCheck — savvy stat                                          */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor — rollStatCheck (savvy)', () => {
  it('passes savvy stat value as modifier', async () => {
    __setRollTotal(9);
    const capturedModifiers = [];
    const actor = makeActor(); // savvy = 0

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedModifiers.push(opts.modifier);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollStatCheck('savvy', 'normal');

    expect(capturedModifiers[0]).toBe(0); // savvy = 0
    OrbitalBluesActor.rollCheck = original;
  });

  it('uses type = "stat" for a savvy roll', async () => {
    __setRollTotal(9);
    const capturedTypes = [];
    const actor = makeActor();

    const original = OrbitalBluesActor.rollCheck;
    OrbitalBluesActor.rollCheck = async (opts) => {
      capturedTypes.push(opts.type);
      return { roll: {}, total: 9, success: true };
    };

    await actor.rollStatCheck('savvy', 'normal');

    expect(capturedTypes[0]).toBe('stat');
    OrbitalBluesActor.rollCheck = original;
  });
});

/* ------------------------------------------------------------------ */
/* Blues Check — edge cases                                            */
/* ------------------------------------------------------------------ */

describe('OrbitalBluesActor.rollCheck — Blues Check edge cases', () => {
  it('blues at 11 increments to 12 on success', async () => {
    __setRollTotal(9); // success
    const actor = makeActor({ blues: { value: 11 } });

    await OrbitalBluesActor.rollCheck({
      actor, label: 'Blues Check', modifier: 0, mode: 'normal', type: 'blues'
    });

    expect(actor.system.blues.value).toBe(12);
  });

  it('blues at 0 increments to 1 on success', async () => {
    __setRollTotal(10); // success
    const actor = makeActor({ blues: { value: 0 } });

    await OrbitalBluesActor.rollCheck({
      actor, label: 'Blues Check', modifier: 0, mode: 'normal', type: 'blues'
    });

    expect(actor.system.blues.value).toBe(1);
  });

  it('blues unchanged on failure (total = 7)', async () => {
    __setRollTotal(7); // failure
    const actor = makeActor({ blues: { value: 5 } });

    await OrbitalBluesActor.rollCheck({
      actor, label: 'Blues Check', modifier: 0, mode: 'normal', type: 'blues'
    });

    expect(actor.system.blues.value).toBe(5);
  });

  it('stat type does not modify blues on success', async () => {
    __setRollTotal(9); // success but type = stat
    const actor = makeActor({ blues: { value: 3 } });

    await OrbitalBluesActor.rollCheck({
      actor, label: 'Muscle Check', modifier: 2, mode: 'normal', type: 'stat'
    });

    // Blues must not change for stat checks
    expect(actor.system.blues.value).toBe(3);
  });
});

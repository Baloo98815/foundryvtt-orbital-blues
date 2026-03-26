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
});

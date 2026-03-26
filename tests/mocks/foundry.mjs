/**
 * Foundry VTT V13 — global mocks for unit testing with Vitest.
 *
 * This file is loaded as a setupFile before every test suite.
 * It defines every global that our system modules reference at class-definition
 * time (extends Actor, extends ActorSheet, etc.) and at runtime.
 */

/* ------------------------------------------------------------------ */
/* Math.clamp  (added in Foundry V13)                                  */
/* ------------------------------------------------------------------ */
Math.clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/* ------------------------------------------------------------------ */
/* foundry.utils + foundry.applications.ux (V13)                       */
/* ------------------------------------------------------------------ */
global.foundry = {
  utils: {
    mergeObject(target, ...sources) {
      return Object.assign({}, target, ...sources);
    },
    setProperty(obj, key, value) {
      const parts = key.split('.');
      let cur = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        if (cur[parts[i]] == null || typeof cur[parts[i]] !== 'object') {
          cur[parts[i]] = {};
        }
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
    }
  },
  // V13 namespaced APIs
  applications: {
    ux: {
      TextEditor: {
        implementation: {
          async enrichHTML(text, _opts) { return text ?? ''; }
        }
      }
    }
  }
};

/* ------------------------------------------------------------------ */
/* Roll (controllable mock total)                                       */
/* ------------------------------------------------------------------ */
let _mockRollTotal = 7; // default: failure (< 8)

/**
 * Call this in a test to control what Roll returns.
 * @param {number} n
 */
global.__setRollTotal = (n) => { _mockRollTotal = n; };

global.Roll = class Roll {
  constructor(formula) {
    this.formula = formula;
    this._resolvedTotal = null;
  }
  async evaluate() {
    this._resolvedTotal = _mockRollTotal;
    return this;
  }
  get total() {
    return this._resolvedTotal ?? _mockRollTotal;
  }
  async toMessage(_opts) {
    return {};
  }
};

/* ------------------------------------------------------------------ */
/* Base Document classes                                                */
/* ------------------------------------------------------------------ */
global.Actor = class Actor {
  constructor(data = {}) {
    this.type   = data.type   ?? 'character';
    this.name   = data.name   ?? 'Test Character';
    this.img    = data.img    ?? '';
    this.flags  = data.flags  ?? {};
    this.system = data.system ?? {};
    this.isOwner = true;

    // items: plain array with a `.get(id)` helper (mirrors Foundry Collection)
    const rawItems = data.items ?? [];
    const items = [...rawItems];
    items.get = (id) => items.find(i => i._id === id || i.id === id);
    this.items = items;
  }
  prepareData()        { this.prepareBaseData(); this.prepareDerivedData(); }
  prepareBaseData()    {}
  prepareDerivedData() {}
  async update(data) {
    for (const [key, value] of Object.entries(data)) {
      foundry.utils.setProperty(this, key, value);
    }
    return this;
  }
};

global.Item = class Item {
  static DEFAULT_ICON = 'icons/svg/item-bag.svg';
  constructor(data = {}) {
    this.type   = data.type   ?? 'weapon';
    this.name   = data.name   ?? 'Test Item';
    this.img    = data.img    ?? Item.DEFAULT_ICON;
    this.system = data.system ?? {};
    this.isOwner = true;
    this._id = data._id ?? 'item-001';
  }
  static create(data, _opts) { return Promise.resolve(new global.Item(data)); }
  async update(data) {
    for (const [key, value] of Object.entries(data)) {
      foundry.utils.setProperty(this, key, value);
    }
    return this;
  }
};

/* ------------------------------------------------------------------ */
/* Sheet base classes                                                   */
/* ------------------------------------------------------------------ */
global.ActorSheet = class ActorSheet {
  constructor(actor) {
    this.actor     = actor;
    this.isEditable = true;
  }
  static get defaultOptions() { return {}; }
  async getData() {
    return {
      actor:    this.actor,
      editable: this.isEditable
    };
  }
  activateListeners() {}
  render() {}
};

global.ItemSheet = class ItemSheet {
  constructor(item) {
    this.item      = item;
    this.isEditable = true;
  }
  static get defaultOptions() { return {}; }
  async getData() {
    return {
      item:     this.item,
      editable: this.isEditable
    };
  }
  activateListeners() {}
};

/* ------------------------------------------------------------------ */
/* TextEditor                                                           */
/* ------------------------------------------------------------------ */
global.TextEditor = {
  async enrichHTML(text, _opts) { return text ?? ''; }
};

/* ------------------------------------------------------------------ */
/* game                                                                 */
/* ------------------------------------------------------------------ */
global.game = {
  i18n: {
    localize: (key) => key   // return key as-is so tests can assert on it
  },
  settings: {
    get: (_scope, key) => key === 'rollMode' ? 'publicroll' : null
  },
  actors: {
    getName: (_name) => null
  }
};

/* ------------------------------------------------------------------ */
/* CONFIG                                                               */
/* ------------------------------------------------------------------ */
global.CONFIG = {
  ORBITAL_BLUES: {
    stats: {
      muscle: 'ORBITAL_BLUES.Stats.Muscle',
      grit:   'ORBITAL_BLUES.Stats.Grit',
      savvy:  'ORBITAL_BLUES.Stats.Savvy'
    },
    shipStats: {},
    weaponCategories:    ['ranged', 'melee'],
    weaponSubcategories: ['personal', 'military', 'improvised', 'martial'],
    weaponTraits: [
      'rapid-fire', 'concealable', 'stun', 'precise',
      'deadly', 'defensive', 'heavy', 'explosive'
    ],
    rollModes: {}
  },
  Actor: { documentClass: null, trackableAttributes: {} },
  Item:  { documentClass: null }
};

/* ------------------------------------------------------------------ */
/* ChatMessage                                                          */
/* ------------------------------------------------------------------ */
global.ChatMessage = {
  getSpeaker: (_opts) => ({})
};

/* ------------------------------------------------------------------ */
/* Hooks                                                                */
/* ------------------------------------------------------------------ */
global.Hooks = {
  once: (_event, _fn) => {},
  on:   (_event, _fn) => {}
};

/* ------------------------------------------------------------------ */
/* Handlebars / loadTemplates                                           */
/* ------------------------------------------------------------------ */
global.Handlebars = { registerHelper: () => {} };
global.loadTemplates = async (_paths) => {};

/* ------------------------------------------------------------------ */
/* Sheet registries (Actors / Items)                                   */
/* ------------------------------------------------------------------ */
global.Actors = { unregisterSheet: () => {}, registerSheet: () => {} };
global.Items  = { unregisterSheet: () => {}, registerSheet: () => {} };

/* ------------------------------------------------------------------ */
/* UI helpers                                                           */
/* ------------------------------------------------------------------ */
global.ui = {
  notifications: { info: () => {}, warn: () => {}, error: () => {} }
};

global.Dialog = class Dialog {
  constructor(_data) {}
  render() {}
};

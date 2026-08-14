/**
 * Modèles de données (DataModels) pour les Objets — Orbital Blues.
 * Remplace les définitions de template.json (déprécié en v14).
 */

const fields = foundry.data.fields;

/** Champs communs à tous les objets. */
function baseItemFields() {
  return {
    description: new fields.HTMLField({ required: true, initial: "" }),
    source:      new fields.StringField({ required: true, initial: "" })
  };
}

/* -------------------------------------------- */

export class OrbitalBluesGambitData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseItemFields(),
      trigger: new fields.StringField({ required: true, initial: "" }),
      effect:  new fields.StringField({ required: true, initial: "" })
    };
  }
}

/* -------------------------------------------- */

export class OrbitalBluesTroubleData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseItemFields(),
      hook:      new fields.StringField({ required: true, initial: "" }),
      triggered: new fields.BooleanField({ required: true, initial: false })
    };
  }
}

/* -------------------------------------------- */

export class OrbitalBluesGearData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseItemFields(),
      quantity:    new fields.NumberField({ required: true, integer: true, initial: 1 }),
      tags:        new fields.StringField({ required: true, initial: "" }),
      damage:      new fields.StringField({ required: true, initial: "" }),
      range:       new fields.StringField({ required: true, initial: "" }),
      cash:        new fields.NumberField({ required: true, integer: true, initial: 0 }),
      isWeapon:    new fields.BooleanField({ required: true, initial: false }),
      attackStat:  new fields.StringField({ required: true, initial: "muscle" }),
      damageBonus: new fields.NumberField({ required: true, integer: true, initial: 0 }),
      difficulty:  new fields.NumberField({ required: true, integer: true, initial: 8 })
    };
  }
}

/* -------------------------------------------- */

export class OrbitalBluesCargoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseItemFields(),
      units: new fields.NumberField({ required: true, integer: true, initial: 1 }),
      buy:   new fields.NumberField({ required: true, integer: true, initial: 0 }),
      sell:  new fields.NumberField({ required: true, integer: true, initial: 0 }),
      legal: new fields.BooleanField({ required: true, initial: true })
    };
  }
}

/* -------------------------------------------- */

export class OrbitalBluesShipPartData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseItemFields(),
      slot: new fields.StringField({ required: true, initial: "" }),
      tags: new fields.StringField({ required: true, initial: "" })
    };
  }
}

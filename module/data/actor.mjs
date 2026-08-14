/**
 * Modèles de données (DataModels) pour les Acteurs — Orbital Blues.
 * Remplace les définitions de template.json (déprécié en v14).
 */

const fields = foundry.data.fields;

/** Champ de caractéristique simple : { value }. */
function statField(initial = 0) {
  return new fields.SchemaField({
    value: new fields.NumberField({ required: true, integer: true, initial })
  });
}

/** Champ de ressource : { value, max }. */
function resourceField(value = 0, max = 0) {
  return new fields.SchemaField({
    value: new fields.NumberField({ required: true, integer: true, initial: value }),
    max:   new fields.NumberField({ required: true, integer: true, initial: max })
  });
}

/** Champs communs à tous les acteurs. */
function baseActorFields() {
  return {
    biography: new fields.HTMLField({ required: true, initial: "" }),
    notes:     new fields.HTMLField({ required: true, initial: "" })
  };
}

/* -------------------------------------------- */

export class OrbitalBluesCharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseActorFields(),
      stats: new fields.SchemaField({
        muscle: statField(0),
        grit:   statField(0),
        savvy:  statField(0)
      }),
      resources: new fields.SchemaField({
        heart: resourceField(3, 3),
        blues: resourceField(0, 9),
        cash:  new fields.SchemaField({
          value: new fields.NumberField({ required: true, integer: true, initial: 0 })
        })
      }),
      details: new fields.SchemaField({
        name:    new fields.StringField({ required: true, initial: "" }),
        concept: new fields.StringField({ required: true, initial: "" }),
        look:    new fields.StringField({ required: true, initial: "" }),
        past:    new fields.StringField({ required: true, initial: "" })
      })
    };
  }
}

/* -------------------------------------------- */

export class OrbitalBluesShipData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseActorFields(),
      stats: new fields.SchemaField({
        engines: statField(0),
        systems: statField(0),
        hull:    statField(0)
      }),
      resources: new fields.SchemaField({
        integrity: resourceField(3, 3),
        fuel:      resourceField(0, 0),
        cargoUsed: resourceField(0, 6)
      }),
      details: new fields.SchemaField({
        shipClass: new fields.StringField({ required: true, initial: "" }),
        callsign:  new fields.StringField({ required: true, initial: "" }),
        quirk:     new fields.StringField({ required: true, initial: "" })
      })
    };
  }
}

/* -------------------------------------------- */

export class OrbitalBluesNpcData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...baseActorFields(),
      stats: new fields.SchemaField({
        threat: statField(1)
      }),
      resources: new fields.SchemaField({
        heart: resourceField(3, 3)
      }),
      details: new fields.SchemaField({
        role:   new fields.StringField({ required: true, initial: "" }),
        motive: new fields.StringField({ required: true, initial: "" })
      })
    };
  }
}

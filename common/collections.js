ReactionCore.Collections.TransitTimesCache = new Mongo.Collection('TransitTimesCache');
TransitTimesCache = ReactionCore.Collections.TransitTimesCache;

ReactionCore.Schemas.TransitTimesCache = new SimpleSchema({
  postal: {
    type: String,
    index: 1
  },
  city: {
    type: String,
    optional: true
  },
  state: {
    type: String,
    optional: true
  },
  stateAbbr: {
    type: String,
    optional: true
  },
  county: {
    type: String,
    optional: true
  },
  latitude: {
    type: Number,
    optional: true,
    decimal: true
  },
  longitude: {
    type: Number,
    optional: true,
    decimal: true
  },
  upsTransitTime: {
    type: Number,
    optional: true
  },
  fedexTransitTime: {
    type: Number,
    optional: true
  }
});

ReactionCore.Collections.TransitTimesCache.attachSchema(ReactionCore.Schemas.TransitTimesCache);

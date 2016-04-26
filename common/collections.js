ReactionCore.Collections.TransitTimesCache = new Mongo.Collection('TransitTimes');

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

ReactionCore.Schemas.TransitTimesAddress = new SimpleSchema({
  address1: {
    type: String,
    optional: true,
    label: 'Address1'
  },
  address2: {
    type: String,
    optional: true,
    label: 'Address2'
  },
  city: {
    type: String,
    optional: true,
    label: 'City'
  },
  state: {
    type: String,
    optional: true,
    label: 'State'
  },
  zipcode: {
    type: String,
    optional: true,
    label: 'Zipcode'
  },
  countryCode: {
    type: String,
    optional: true,
    label: 'Country Code (Two letter country code)'
  }
});

ReactionCore.Schemas.TransitTimesPackageConfig = new SimpleSchema([
  ReactionCore.Schemas.PackageConfig, {
    'settings.fedex.key': {
      type: String,
      label: 'Fedex API key',
      optional: true
    },
    'settings.fedex.password': {
      type: String,
      label: 'Fedex API password',
      optional: true
    },
    'settings.fedex.accountNumber': {
      type: String,
      label: 'Fedex API Account Number',
      optional: true
    },
    'settings.fedex.meterNumber': {
      type: String,
      label: 'Fedex API Meter Number',
      optional: true
    },
    'settings.fedex.liveApi': {
      type: Boolean,
      label: 'Use Live API? (uncheck for testing)',
      optional: true,
      defaultValue: false
    },
    'settings.ups.liveApi': {
      type: Boolean,
      label: 'Use Live API? (uncheck for testing)',
      optional: true,
      defaultValue: false
    },
    'settings.ups.accessKey': {
      type: String,
      label: 'UPS Access Key',
      optional: true
    },
    'settings.ups.username': {
      type: String,
      label: 'UPS Username',
      optional: true
    },
    'settings.ups.password': {
      type: String,
      label: 'UPS Password',
      optional: true
    },
    'settings.selectedShippingProvider': {
      type: String,
      label: 'Carrier to calculate transit time',
      optional: true,
      allowedValues: ['UPS', 'Fedex']
    },
    'settings.shippingAddress': {
      type: ReactionCore.Schemas.TransitTimesAddress,
      optional: true
    },
    'settings.defaultTransitTime': {
      type: Number,
      optional: true
    },
    'settings.localDeliveryPostalCodes': {
      type: [String],
      optional: true
    }
  }
]);

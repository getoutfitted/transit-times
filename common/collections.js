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
    'settings.selectedShipping': {
      type: String,
      label: 'Carrier to calculate transit time',
      optional: true,
      allowedValues: ['UPS', 'Fedex']
    }
  }
]);

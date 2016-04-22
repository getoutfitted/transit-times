Package.describe({
  summary: 'Transit Times Calculator',
  name: 'getoutfitted:transit-times',
  version: '0.1.0',
  git: 'https://github.com/getoutfitted/transit-times'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3.1');
  api.use('meteor-platform');
  api.use('less');
  api.use('underscore');
  api.use('standard-minifiers');
  api.use('reactioncommerce:core');
  api.use('reactioncommerce:reaction-router');
  api.use('reactioncommerce:reaction-collections');

  // Register package
  api.addFiles('server/registry.js', 'server');

  // Setup globals
  api.addFiles('common/globals.js');

  api.addFiles([
    'common/collections.js',
    'common/shipping.js'
  ], ['client', 'server']);

  api.addFiles([
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js',
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js'
  ], 'client');
  
  api.export("TransitTimes");
});

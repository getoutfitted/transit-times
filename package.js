Package.describe({
  summary: 'Transit Times Calculator',
  name: 'getoutfitted:transit-times',
  version: '0.1.0',
  git: 'https://github.com/getoutfitted/product-bundles'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3');
  api.use('meteor-platform');
  api.use('less');
  api.use('underscore');
  api.use('standard-minifiers');
  api.use('reactioncommerce:core');
  api.use('reactioncommerce:reaction-router');
  api.use('reactioncommerce:reaction-collections');
  api.use('momentjs:moment@2.10.6');

  api.addFiles([
    'server/registry.js',
  ], 'server');

  api.addFiles([
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js',
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js'
  ], 'client');
});

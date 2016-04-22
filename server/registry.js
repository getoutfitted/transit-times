ReactionCore.registerPackage({
  label: 'GetOutfitted Transit Time Calculator',
  name: 'transit-times',
  icon: 'fa fa-calculator',
  autoEnable: false,
  settings: {},
  registry: [{
    route: '/dashboard/transit-times',
    provides: 'dashboard',
    name: 'transitTimes',
    label: 'Getoutfitted Transit Time Calculator ',
    description: 'Calculate transit times from UPS or FedEx',
    container: 'getoutfitted',
    icon: 'fa fa-calculator',
    template: 'transitTimesDashboard',
    workflow: 'coreWorkflow',
    priority: 3
  }, {
    route: '/dashboard/transit-times/settings',
    provides: 'settings',
    label: 'GetOutfitted Transit Time Settings',
    name: 'transitTimesSettings',
    template: 'transitTimesSettings'
  }]
});

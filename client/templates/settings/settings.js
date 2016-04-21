Template.transitTimesSettings.helpers({
  packageData: function () {
    return ReactionCore.Collections.Packages.findOne({
      name: 'transit-times',
      shopId: ReactionCore.getShopId()
    });
  }
});

AutoForm.hooks({
  'transit-times-update-form': {
    onSuccess: function (operation, result, template) {
      Alerts.removeSeen();
      return Alerts.add('Transit Times settings saved.', 'success', {
        autoHide: true
      });
    },
    onError: function (operation, error, template) {
      Alerts.removeSeen();
      return Alerts.add('Transit Times settings update failed. ' + error, 'danger');
    }
  }
});

TransitTimes._getSettings = function () {
  const tt = ReactionCore.Collections.Packages.findOne({
    name: 'transit-times',
    shopId: ReactionCore.getShopId()
  });

  if (!tt) {
    throw new Meteor.Error(500, "TransitTimes package not found ");
  }
  return tt.settings;
};

TransitTimes.getSelectedProvider = function () {
  const settings = TransitTimes._getSettings();
  return settings.selectedShippingProvider; // Changed from `selectedShipping`
};

/**
 * Calculates the time in transit for an order
 * Calculation is based on the destination of the order,
 * the shipping location and the provider used for shipping.
 * @param   {Object} order a ReactionCommerce order object
 * @returns {Number}       number of business days in transit
 */
TransitTimes.calculateTransitTime = function (order) {
  const shippingAddress = order.shipping[0].address;
  const destinationPostal = shippingAddress.postal;
  const isLocalDelivery = TransitTimes.isLocalDelivery(destinationPostal);
  const defaultTransitTime = afPackage.settings.buffer.shipping || 4;
  if (localDelivery) {
    return 0; // TransitTimes.localDeliveryTime()
  }

  const shippingProvider = TransitTimes.getSelectedProvider();
  const transitTime = TransitTimes.findOne({postal: shippingAddress.postal});
  if (transitTime && shippingProvider === 'UPS') {
    return transitTime.upsTransitTime;
  }

  const formattedShippingAddress = TransitTimes.addressFormatForFedExApi(shippingAddress);
  const carrierTransitTime = TransitTimes.determineShippingCarrier(
    afPackage.settings.selectedShipping, formattedShippingAddress);

  return carrierTransitTime || defaultTransitTime;
};

TransitTimes.calculateShippingDay = function (order) {
  let start = moment(order.startTime);
  let bonusTransitDays = 0;
  if (start.isoWeekday() === 6) {
    bonusTransitDays = bonusTransitDays + 1;
  } else if (start.isoWeekday() === 7) {
    bonusTransitDays = bonusTransitDays + 2;
  }

  let timeInTransit = TransitTimes.calculateTransitTime(order);
  let shippingDay = moment(start).subtract(timeInTransit + bonusTransitDays, 'days');
  if (shippingDay.isoWeekday() >= 6 || shippingDay.isoWeekday() + timeInTransit >= 6) {
    return shippingDay.subtract(2, 'days');
  }
  return shippingDay;
};

// Calculates the day an order should return to the warehouse
TransitTimes.calculateReturnDay = function (order) {
  let end = moment(order.endTime);
  let bonusTransitDays = 0;
  if (end.isoWeekday() === 6) {
    bonusTransitDays = bonusTransitDays + 2;
  } else if (end.isoWeekday() === 7) {
    bonusTransitDays = bonusTransitDays + 1;
  }

  let timeInTransit = TransitTimes.calculateTransitTime(order);
  let returnDay = moment(end).add(timeInTransit + bonusTransitDays, 'days');
  if (returnDay.isoWeekday() >= 6 || returnDay.isoWeekday() + timeInTransit >= 6) {
    return returnDay.add(2, 'days');
  }
  return returnDay;
};

TransitTimes.scrapeUPSTransitTimes = function () {
  let addrs = ReactionCore.Collections.TransitTimes.find({upsTransitTime: null}, {limit: 5000});
  let total = addrs.count();
  let count = 0;
  addrs.forEach(function (addr) {
    Meteor.setTimeout(() => {
      try {
        let tt = TransitTimes.UPS.getUPSTransitTime({address1: '', city: addr.city, region: addr.stateAbbr, postal: addr.postal, country: 'US'});
        TransitTimes.update({postal: addr.postal}, {$set: {upsTransitTime: tt}});
        count++;
        if (count % 100 === 0) {
          ReactionCore.Log.info('-------');
          ReactionCore.Log.info(`Import Number ${count} of ${total}`);
          ReactionCore.Log.info('-------');
        }
      } catch (e) {
        TransitTimes.update({postal: addr.postal}, {$set: {upsTransitTime: 7}});
      }
    }, 10);
  });
};

TransitTimes.scrapeFedExTransitTimes = function () {
  let addrs = ReactionCore.Collections.TransitTimes.find({fedexTransitTime: null}, {limit: 5000});
  let total = addrs.count();
  let count = 0;
  addrs.forEach(function (addr) {
    Meteor.setTimeout(() => {
      try {
        let tt = TransitTimes.FedExApi.getFedexTransitTime({address1: '123 Anywhere St', city: addr.city, region: addr.stateAbbr, postal: addr.postal, country: 'US'});
        TransitTimes.update({postal: addr.postal}, {$set: {fedexTransitTime: tt}});
        ReactionCore.Log.info(`Transit time of ${tt} set for Fedex for zipcode ${addr.postal}`);
      } catch (e) {
        TransitTimes.update({postal: addr.postal}, {$set: {fedexTransitTime: 7}});
        ReactionCore.Log.info(`Error getting transit time for Fedex for zipcode ${addr.postal}`);
      }
    }, 100);
  });
};

import moment from 'moment';

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

TransitTimes.getDefaultTransitTime = function () {
  const settings = TransitTimes._getSettings();
  return settings.defaultTransitTime || 4;
};

TransitTimes.getAPIAuth = function (provider) {
  const settings = TransitTimes._getSettings();
  if (provider === 'ups') {
    return settings.ups;
  }
  if (provider === 'fedex') {
    return settings.fedex;
  }

  throw new Meteor.Error(404, `Shipping provider ${provider} not found or setup`);
};

// What is this doing?
TransitTimes.formatAddress = function (address) {
  let shippingAddress = {};
  shippingAddress.address1 = address.address1;
  if (address.address2) {
    shippingAddress.address2 = address.address2;
  }
  shippingAddress.city = address.city;
  shippingAddress.region = address.region;
  shippingAddress.postal = address.postal;
  shippingAddress.country = address.country;
  return shippingAddress;
};


TransitTimes.isLocalDelivery = function (postal) {
  check(postal, String);
  return _.contains(TransitTimes.LocalDelivery.postalCodes, postal);
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
  if (isLocalDelivery) {
    return 0; // TransitTimes.localDeliveryTime()
  }

  const defaultTransitTime = TransitTimes.getDefaultTransitTime();
  const shippingProvider = TransitTimes.getSelectedProvider();
  const transitTime = TransitTimesCache.findOne({postal: shippingAddress.postal});
  const formattedShippingAddress = TransitTimes.formatAddress(shippingAddress);

  if (shippingProvider === 'UPS') {
    if (transitTime) {
      return transitTime.upsTransitTime;
    }
    return TransitTimes.UPS.getUPSTransitTime(formattedShippingAddress) || defaultTransitTime;
  }

  if (shippingProvider === 'Fedex') {
    if (transitTime) {
      return transitTime.fedexTransitTime;
    }
    return TransitTimes.FedExApi.getFedexTransitTime(formattedShippingAddress) || defaultTransitTime;
  }

  return defaultTransitTime;
};

TransitTimes.calculateShippingDay = function (order) {
  let start = moment(order.startTime);
  let weekendArrivalDays = 0;
  if (start.isoWeekday() === 6) {
    weekendArrivalDays = weekendArrivalDays + 1;
  } else if (start.isoWeekday() === 7) {
    weekendArrivalDays = weekendArrivalDays + 2;
  }

  let timeInTransit = TransitTimes.calculateTransitTime(order);

  if (timeInTransit === 0) {
    return start.toDate();
  }

  let shippingDay = moment(start).subtract(timeInTransit + weekendArrivalDays, 'days');
  if (shippingDay.isoWeekday() + timeInTransit >= 6) {
    return shippingDay.subtract(2, 'days').toDate();
  }
  return shippingDay.toDate();
};

// Calculates the day an order should return to the warehouse
TransitTimes.calculateReturnDay = function (order) {
  let end = moment(order.endTime);
  let weekendReturnDays = 0;
  if (end.isoWeekday() === 6) {
    weekendReturnDays = weekendReturnDays + 2;
  } else if (end.isoWeekday() === 7) {
    weekendReturnDays = weekendReturnDays + 1;
  }

  let timeInTransit = TransitTimes.calculateTransitTime(order);

  if (timeInTransit === 0) {
    return end.toDate();
  }

  let dropoffDay = moment(end).add(weekendReturnDays, 'days');
  let returnDay = moment(end).add(timeInTransit + weekendReturnDays, 'days');
  if (dropoffDay.isoWeekday() + timeInTransit >= 6) {
    return returnDay.add(2, 'days').toDate();
  }
  return returnDay.toDate();
};

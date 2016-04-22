import moment from 'moment';
import 'twix';

TransitTimes.date = {};

TransitTimes.date.isWeekend = function (date) {
  check(date, Date);
  return moment(date).isoWeekday() === 7 || moment(date).isoWeekday() === 6;
};

TransitTimes.date.isSunday = function (date) {
  check(date, Date);
  return moment(date).isoWeekday() === 7;
};

TransitTimes.date.isSaturday = function (date) {
  check(date, Date);
  return moment(date).isoWeekday() === 6;
};

// This feels a bit misleading as it returns the current day unless it's a weekend.
TransitTimes.date.previousBusinessDay = function (date) {
  check(date, Date);
  if (this.isSunday(date)) {
    return moment(date).subtract(2, 'days');
  } else if (this.isSaturday(date)) {
    return moment(date).subtract(1, 'days');
  }
  return date;
};

// Name and return value don't really match here
TransitTimes.date.nextBusinessDay = function (date) {
  check(date, Date);
  if (this.isSunday(date)) {
    return moment(date).add(1, 'days');
  } else if (this.isSaturday(date)) {
    return moment(date).add(2, 'days');
  }
  return date;
};

TransitTimes.date.ifWeekendSetPreviousBizDay = function (date) {
  check(date, Date);
  if (TransitTimes.date.isWeekend(date)) {
    date = TransitTimes.date.previousBusinessDay(date);
  }
  return moment(date);
};

TransitTimes.date.ifWeekendSetNextBizDay = function (date) {
  check(date, Date);
  if (TransitTimes.date.isWeekend(date)) {
    date = TransitTimes.date.nextBusinessDay(date);
  }
  return moment(date);
};

TransitTimes.date.enoughBizDaysForTransit = function (startDate, endDate, transitTime) {
  check(startDate, Date);
  check(endDate, Date);
  check(transitTime, Number);
  let bizDays = 0;
  let range = moment(startDate).twix(endDate, {allDay: true});
  let iter = range.iterate('days');
  while (iter.hasNext()) {
    let dayOfTheWeek = iter.next().isoWeekday();
    if (dayOfTheWeek < 6) {
      bizDays++;
    }
  }
  return bizDays >= transitTime;
};

TransitTimes.date.determineShipReturnByDate = function (endTime) {
  check(endTime, Date);
  let shipReturnBy = moment(endTime).add(1, 'day');
  shipReturnBy = TransitTimes.date.ifWeekendSetNextBizDay(shipReturnBy.toDate());
  return shipReturnBy.toDate();
};

TransitTimes.date.determineArrivalDate = function (startTime) {
  check(startTime, Date);
  let arrivalDate = moment(startTime).subtract(1, 'day');
  arrivalDate = TransitTimes.date.ifWeekendSetPreviousBizDay(arrivalDate.toDate());
  return arrivalDate.toDate();
};

TransitTimes.date.determineShipmentDate = function (arrivalDate, transitTime) {
  check(arrivalDate, Date);
  check(transitTime, Number);
  let shipmentDate = moment(arrivalDate).subtract(transitTime, 'days');
  let enoughTransitTime = false;
  while (enoughTransitTime === false) {
    enoughTransitTime = TransitTimes.date.enoughBizDaysForTransit(shipmentDate.toDate(), arrivalDate, transitTime);
    shipmentDate = moment(shipmentDate).subtract(1, 'day');
  }
  shipmentDate = TransitTimes.date.ifWeekendSetPreviousBizDay(shipmentDate.toDate());
  return shipmentDate.toDate();
};

TransitTimes.date.determineReturnDate = function (shipReturnBy, transitTime) {
  check(shipReturnBy, Date);
  check(transitTime, Number);
  let returnDate = moment(shipReturnBy).add(transitTime, 'days');
  let enoughTransitTime = false;
  while (enoughTransitTime === false) {
    enoughTransitTime = TransitTimes.date.enoughBizDaysForTransit(shipReturnBy, returnDate.toDate(), transitTime);
    returnDate = moment(returnDate).add(1, 'day');
  }
  returnDate = TransitTimes.date.ifWeekendSetNextBizDay(returnDate.toDate());
  return returnDate.toDate();
};

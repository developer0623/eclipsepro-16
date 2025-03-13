import * as moment from 'moment';
export const initDate = (
  startDate: moment.Moment,
  endDate: moment.Moment,
  duration?: 'week' | 'month' | 'day'
) => {
  let newStartDate = startDate;
  let newEndDate = endDate;

  if (duration === 'week') {
    newStartDate = moment(startDate).startOf('week');
    newEndDate = moment(endDate).endOf('week');
  } else if (duration === 'month') {
    newStartDate = moment(startDate).startOf('month');
    newEndDate = moment(endDate).endOf('month');
  }

  return { startDate: newStartDate, endDate: newEndDate };
};

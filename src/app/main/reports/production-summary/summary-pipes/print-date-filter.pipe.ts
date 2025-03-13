import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'printDateFilter',
})
export class PrintDateFilterPipe implements PipeTransform {
  transform(startDate, endDate, state): string {
    const startMoment = moment(startDate);
    const startDay = startMoment.format('DD');
    const startMonth = startMoment.format('MMM');
    const startYear = startMoment.format('YYYY');

    const endMoment = moment(endDate);
    const endDay = endMoment.format('DD');
    const endMonth = endMoment.format('MMM');
    const endYear = endMoment.format('YYYY');

    let newText = '';
    if (state === 'Day') {
      newText = `${endMonth} ${endDay}<span>${endYear}</span>`;
    } else if (state === 'Month') {
      newText = `${endMonth}<span>${endYear}</span>`;
    } else {
      if (startYear === endYear) {
        newText = `${startMonth} ${startDay} - ${endMonth} ${endDay} <span>${endYear}</span>`;
      } else {
        newText = `${startMonth} ${startDay} <span>${startYear}</span> - ${endMonth} ${endDay} <span>${endYear}</span>`;
      }
    }
    return newText;
  }
}

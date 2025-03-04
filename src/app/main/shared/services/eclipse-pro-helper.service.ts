import { Injectable } from '@angular/core';
import * as MobileDetect from 'mobile-detect';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class EclipseProHelperService {
  mobileDetect;

  constructor() {
    this.mobileDetect = new MobileDetect(window.navigator.userAgent);
  }

  isMobile() {
    return this.mobileDetect.mobile();
  }

  buildRepeatText(downtimeData) {
    let repeatText = '';

    const pluralize = (count: number, singular: string, plural: string) =>
      count > 1 ? count + ' ' + plural : singular;
    switch (downtimeData.occurs) {
      case 'Daily':
        repeatText = `Daily: Every ${pluralize(downtimeData.everyCount, 'Day', 'Days')}`;
        break;
      case 'Weekly':
        const days = downtimeData.daysOfWeek.join(', ').replace(/,(?!.*,)/gim, ' and');
        repeatText = `Weekly: Every ${pluralize(
          downtimeData.everyCount,
          'week on',
          'weeks on'
        )} ${days}`;
        break;
      case 'Monthly':
        let datesWithSuffix = [];

        if (downtimeData.monthValue === 'Each') {
          downtimeData.selectedDate.sort((a: number, b: number) => a - b);

          datesWithSuffix = downtimeData.selectedDate.map((selectedDate: number) => {
            const j = selectedDate % 10;
            const k = selectedDate % 100;
            if (j === 1 && k !== 11) return selectedDate + 'st';
            if (j === 2 && k !== 12) return selectedDate + 'nd';
            if (j === 3 && k !== 13) return selectedDate + 'rd';
            return selectedDate + 'th';
          });
        }

        const weekDayOfMonth =
          downtimeData.weekDayOfMonth === 'WeekendDay'
            ? 'Weekend Day'
            : downtimeData.weekDayOfMonth === 'WeekDay'
            ? 'Week Day'
            : downtimeData.weekDayOfMonth;

        repeatText = `Monthly: Every ${pluralize(
          downtimeData.everyCount,
          'Month on the',
          'Months on the'
        )} ${
          downtimeData.monthValue === 'Each'
            ? datesWithSuffix.join(', ').replace(/,(?!.*,)/gim, ' and')
            : downtimeData.dayOfMonth + ' ' + weekDayOfMonth
        }`;
        break;
      case 'OneTime':
        repeatText = 'One Time';
        break;
    }
    return repeatText;
  }

  buildDuration(duration) {
    const timeDuration = moment.duration(duration);

    return {
      hours: timeDuration.hours(),
      mins: timeDuration.minutes(),
    };
  }

  buildStartTime(startTime: string) {
    const time = moment(startTime, 'HH:mm');
    return {
      hours: time.format('hh'),
      mins: time.format('mm'),
      meridian: time.format('A'),
    };
  }
}

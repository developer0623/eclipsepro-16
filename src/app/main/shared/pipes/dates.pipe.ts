import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { UnitsService } from '../services/units.service';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  constructor(private unitsService: UnitsService) {}
  transform(startDate, endDate): unknown {
    let dateIn = moment(startDate);
    if (!dateIn.isValid()) return '';

    let dateOut = moment(endDate);
    if (!dateOut.isValid()) {
      dateOut = moment(Date.now());
    }

    if (dateIn.isBefore('1980-01-02')) {
      return '';
    }
    if (dateOut.isBefore('1980-01-02')) {
      dateOut = moment();
    }

    let age = dateOut.diff(dateIn, 'days');
    let units = ' d';
    if (age > 365) {
      age = this.unitsService.round(dateOut.diff(dateIn, 'years', true), 1);
      units = ' y';
    }
    return age + units;
  }
}

@Pipe({
  name: 'amsDate',
})
export class AmsDatesPipe implements PipeTransform {
  transform(date): string {
    let dateIn = moment(date);
    if (!dateIn.isValid()) return '';
    if (dateIn.isBefore('1980-01-02')) {
      return '';
    }
    return dateIn.format('L');
  }
}

@Pipe({
  name: 'amsTime',
})
export class AmsTimePipe implements PipeTransform {
  transform(date): string {
    let dateIn = moment(date);
    if (!dateIn.isValid()) return '';
    if (dateIn.isBefore('1980-01-02')) {
      return '';
    }
    dateIn.add(0.5, 'seconds').startOf('second'); //round to nearest second
    return dateIn.format('LTS');
  }
}

@Pipe({
  name: 'amsDateTime',
})
export class AmsDateTimePipe implements PipeTransform {
  transform(date): string {
    let dateIn = moment(date);
    if (dateIn.isBefore('1980-01-02')) {
      return '';
    }
    //todo:review this format
    dateIn.add(0.5, 'seconds').startOf('second'); //round to nearest second
    return dateIn.format('L') + ' ' + dateIn.format('LT');
  }
}

@Pipe({
  name: 'amsDateTimeSec',
})
export class AmsDateTimeSecPipe implements PipeTransform {
  transform(date): unknown {
    let dateIn = moment(date);
    if (dateIn.isBefore('1980-01-02')) {
      return '';
    }
    //todo:review this format
    dateIn.add(0.5, 'seconds').startOf('second'); //round to nearest second
    return dateIn.format('L') + ' ' + dateIn.format('LTS');
  }
}

@Pipe({
  name: 'amsTimeAgo',
})
export class AmsTimeAgoPipe implements PipeTransform {
  transform(date): unknown {
    let dateIn = moment(date);
    if (dateIn.isBefore('1980-01-02')) {
      return '';
    }
    return dateIn.fromNow(true);
  }
}

@Pipe({
  name: 'timeSpan',
})
export class TimeSpanPipe implements PipeTransform {
  transform(timeSpan, format): unknown {
    let timeSpanIn = moment.duration(timeSpan);
    if (!format) {
      format = 'human';
    }
    //todo:add other formats (x H x M x S)
    //here's a way to do more formatting but I don't need it yet: moment.utc(timeSpanIn.asMilliseconds()).format('m:ss.SSS');
    switch (format) {
      case 'secondsWithMs':
        return timeSpanIn.asSeconds().toFixed(3);
      case 'human':
      default:
        return timeSpanIn.humanize();
    }
  }
}

@Pipe({
  name: 'taskTimeAgo',
})
export class TaskTimeAgoPipe implements PipeTransform {
  transform(lastRunStateChange: Date | string) {
    const nowMoment = moment();
    const oldMoment = moment(lastRunStateChange);
    const diffTime = oldMoment.diff(nowMoment, 'minutes');
    if (!diffTime) {
      return '';
    }

    if (diffTime >= 0) {
      if (diffTime < 10) {
        return `<span class='red-color'>${diffTime}<span class='time-sign'>M</span></span>`;
      }
      if (diffTime < 60) {
        return `<span class='normal-color'>${diffTime}<span class='time-sign'>M</span></span>`;
      }
      if (diffTime < 1440) {
        const hours = Math.floor(diffTime / 60);
        const minutes = diffTime % 60;
        return `<span class='normal-color'>${hours}<span class='time-sign'>H</span> ${minutes}<span class='time-sign'>M</span></span>`;
      }
      if (diffTime < 43200) {
        const days = Math.floor(diffTime / 1440) + 1;
        return `<span class='normal-color'>${days}<span class='time-sign'>D</span></span>`;
      }
      const months = Math.floor(diffTime / 43200) + 1;
      return `<span class='normal-color'>${months}<span class='time-sign'>MON</span></span>`;
    } else {
      if (diffTime >= -60) {
        const newDiff = Math.abs(diffTime);
        return `<span class='red-color'><span class='late-sign'>late</span>${newDiff}<span class='time-sign'>M</span></span>`;
      }
      if (diffTime >= -1440) {
        const newDiff = Math.abs(diffTime);
        const hours = Math.floor(newDiff / 60);
        const minutes = newDiff % 60;
        return `<span class='red-color'><span class='late-sign'>late</span>${hours}<span class='time-sign'>H</span> ${minutes}<span class='time-sign'>M</span></span>`;
      }
      if (diffTime >= -43200) {
        const newDiff = Math.abs(diffTime);
        const days = Math.floor(newDiff / 1440) + 1;
        return `<span class='red-color'><span class='late-sign'>late</span>${days}<span class='time-sign'>D</span></span>`;
      }
      const newDiff = Math.abs(diffTime);
      const months = Math.floor(newDiff / 43200) + 1;
      return `<span class='red-color'><span class='late-sign'>late</span>${months}<span class='time-sign'>MON</span></span>`;
    }
  }
}

@Pipe({
  name: 'maDate',
})
export class MaDatePipe implements PipeTransform {
  transform(startDate, state): string {
    const mm = moment(startDate);
    const day = mm.format('DD');
    const month = mm.format('MMM');
    const year = mm.format('YYYY');

    //todo: make this generic (not just for material)
    let newText = '';
    switch (state) {
      case 'month': {
        newText = `${month} ${year}`;
        break;
      }

      default: {
        newText = `${month} ${day}<span class='last-child'>${year}</span>`;
        break;
      }
    }

    return newText;
  }
}

@Pipe({
  name: 'taskCompleteAgo',
})
export class TaskCompleteAgoPipe implements PipeTransform {
  transform(completedDate: Date | string, startDate: Date | string) {
    const nowMoment = moment(startDate);
    const oldMoment = moment(completedDate);
    const diffTime = oldMoment.diff(nowMoment, 'minutes');
    let newText = '';
    if (diffTime < 60 && diffTime >= 0) {
      newText = `${diffTime}<span class='time-sign'>M</span>`;
    } else if (diffTime >= 60 && diffTime < 1440) {
      const hours = Math.floor(diffTime / 60);
      const minutes = diffTime % 60;
      newText = `${hours}<span class='time-sign'>H</span> ${minutes}<span class='time-sign'>M</span>`;
    } else if (diffTime >= 1440 && diffTime < 43200) {
      const days = Math.floor(diffTime / 1440) + 1;
      newText = `${days}<span class='time-sign'>D</span>`;
    } else if (diffTime >= 43200) {
      const months = Math.floor(diffTime / 43200) + 1;
      newText = `${months}<span class='time-sign'>MON</span>`;
    }

    return newText;
  }
}
@Pipe({
  name: 'taskActiveAgo',
})
export class TaskActiveAgoPipe implements PipeTransform {
  transform(lastRunStateChange: Date | string) {
    const nowMoment = moment();
    const oldMoment = moment(lastRunStateChange);
    const diffTime = nowMoment.diff(oldMoment, 'seconds');
    const secondRes = 5; //todo: parameterize

    if (!diffTime || diffTime <= 0) {
      return '';
    }

    let remain = diffTime;
    const months = Math.floor(remain / 2592000);
    remain -= months * 2592000;
    const days = Math.floor(remain / 86400);
    remain -= days * 86400;
    const hours = Math.floor(remain / 3600) % 24;
    remain -= hours * 3600;
    const minutes = Math.floor(remain / 60) % 60;
    remain -= minutes * 60;
    const seconds = Math.floor((remain % 60) / secondRes) * secondRes; // rem % 60/secondRes*secondRes;

    if (months > 0) {
      return `${months}<span class='time-sign'>MON</span>`;
    }
    if (days > 0) {
      return `${days}<span class='time-sign'>D&nbsp;</span>${hours}<span class='time-sign'>H</span>`;
    }
    if (hours > 0) {
      return `${hours}<span class='time-sign'>H&nbsp;</span>${minutes}<span class='time-sign'>M</span>`;
    }
    if (minutes > 0) {
      return `${minutes}<span class='time-sign'>M&nbsp;</span>${seconds}<span class='time-sign'>S</span>`;
    }
    if (seconds >= 0) {
      return `${seconds}<span class='time-sign'>S</span>`;
    }
    return '';
  }
}

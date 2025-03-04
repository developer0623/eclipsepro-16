import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { IScheduledDowntimeDto } from 'src/app/core/dto';
import { EclipseProHelperService } from '../services/eclipse-pro-helper.service';

@Pipe({
  name: 'filterMachineNames',
})
export class FilterMachineNamesPipe implements PipeTransform {
  private cached: { [key: string]: string } = {};

  transform(machinesText: string) {
    console.log(machinesText);
  }

  // transform(input: string[], machineList: { [key: string]: { description: string } }): string {
  //   console.log('machineList==========', machineList);
  //   if (input) {
  //     if (this.cached[input.join(',')]) {
  //       return this.cached[input.join(',')];
  //     } else {
  //       const machines = input.map((downtimeMachineId) => {
  //         if (machineList[downtimeMachineId]) {
  //           return machineList[downtimeMachineId].description;
  //         } else {
  //           return `Machine ID ${downtimeMachineId} (Error ID not valid!)`;
  //         }
  //       });
  //       this.cached[input.join(',')] = machines.join(', ');
  //       return this.cached[input.join(',')];
  //     }
  //   }
  //   return '';
  // }
}

@Pipe({
  name: 'buildDuration',
})
export class BuildDurationPipe implements PipeTransform {
  transform(input: string, isDuration: boolean): string {
    if (typeof input === 'undefined') {
      return;
    }

    if (isDuration) {
      let duration = moment.duration(input);

      let hours = duration.hours();
      let minutes = duration.minutes();

      let formattedDuration =
        (hours > 0 ? hours + ' Hours ' : '') + (minutes > 0 ? minutes + ' Mins' : '');

      return formattedDuration || '0 Mins';
    } else {
      let time = moment(input, 'HH:mm');
      let formattedTime = time.format('hh:mm A');
      return formattedTime;
    }
  }
}

@Pipe({
  name: 'repeatText',
})
export class RepeatTextPipe implements PipeTransform {
  constructor(private eclipseProHelper: EclipseProHelperService) {}
  transform(input: IScheduledDowntimeDto): string {
    return this.eclipseProHelper.buildRepeatText(input);
  }
}

@Pipe({
  name: 'sideLabel',
})
export class SideLabelPipe implements PipeTransform {
  transform(input: string): string {
    switch (input) {
      case 'Weekly':
        return 'Week(s)on';
      case 'Monthly':
        return 'Month(s)';
      default:
        return 'Days';
    }
  }
}

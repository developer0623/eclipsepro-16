import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timebarPercent',
})
export class TimebarPercentPipe implements PipeTransform {
  transform(value: string): string {
    return (Number(value) * 100).toFixed(2);
  }
}

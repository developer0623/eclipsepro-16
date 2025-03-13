import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summaryPercent',
})
export class SummaryPercentPipe implements PipeTransform {
  transform(value: string): string {
    return (Number(value) * 100).toFixed(1);
  }
}

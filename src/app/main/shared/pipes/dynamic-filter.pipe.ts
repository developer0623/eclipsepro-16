import { Pipe, PipeTransform } from '@angular/core';
import { AmsDatesPipe, AmsDateTimePipe } from './dates.pipe';
import { UnitsService } from '../services/units.service';

@Pipe({
  name: 'dynamicFilter',
})
export class DynamicFilterPipe implements PipeTransform {
  constructor(private unitsService: UnitsService) {}
  transform(input: any, filterExpression: string): any {
    if (!filterExpression) {
      return input;
    }
    switch (filterExpression) {
      case 'amsDate':
        return AmsDatesPipe.prototype.transform(input);
      case 'amsDateTime':
        return AmsDateTimePipe.prototype.transform(input);
      case 'unitsFormat:"in":3':
        return this.unitsService.formatUserUnits(input, 'in', 3);
    }
    return input;
  }
}

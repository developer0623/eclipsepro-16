import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFilter',
})
export class NumberFilterPipe implements PipeTransform {
  transform(val: string): string {
    let nVal = Number(val);
    return nVal.toFixed(2);
  }
}

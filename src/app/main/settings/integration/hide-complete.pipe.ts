import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideComplete',
})
export class HideCompletePipe implements PipeTransform {
  transform(values: any[], isHide: boolean): unknown {
    if (!values || values.length === 0) return [];
    return values.filter((val) => !isHide || !val.complete);
  }
}

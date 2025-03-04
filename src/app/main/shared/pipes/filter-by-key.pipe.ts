import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKey',
})
export class FilterByKeyPipe implements PipeTransform {
  transform(values: any[], keyName: string, keyVal: string): unknown {
    if (!values || values.length === 0) return [];
    return values.filter((val) => val[keyName] === keyVal);
  }
}

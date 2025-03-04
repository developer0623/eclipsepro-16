import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'andonDisplayFilter',
})
export class AndonDisplayFilterPipe implements PipeTransform {
  transform(values: any[], viewKey: string, playKey): unknown {
    if (!values || values.length === 0) return [];
    return values.filter((val) => val.viewKey === viewKey && val.playKey === playKey);
  }
}

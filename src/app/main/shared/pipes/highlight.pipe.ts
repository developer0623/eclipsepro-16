import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, ctrlValue: string): string {
    const re = new RegExp(ctrlValue, 'gi');
    const match = text.match(re);
    return ctrlValue ? text.replace(re, (match) => `<b>${match}</b>`) : text;
  }
}

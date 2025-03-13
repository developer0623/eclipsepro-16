import { Directive, Input, ElementRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[appFocusMe]',
})
export class FocusMeDirective {
  @Input() appFocusMe: boolean;
  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  @Input('appFocusMe') set focusMe(value: boolean) {
    this.ngZone.run(() => {
      if (value) {
        this.elementRef.nativeElement.focus();
        this.appFocusMe = false;
      }
    });
  }
}

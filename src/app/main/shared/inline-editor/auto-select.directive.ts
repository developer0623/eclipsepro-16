import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appAutoSelect]',
})
export class AutoSelectDirective implements OnInit {
  @Input('isDisableAuto') isDisableAuto = false;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (!this.isDisableAuto) {
      window.setTimeout(() => {
        this.elementRef.nativeElement.select();
      }, 0);
    }
  }
}

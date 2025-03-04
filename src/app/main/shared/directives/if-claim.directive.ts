import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserHasClaim } from '../services/store/user/selector';

@Directive({
  selector: '[ifClaim]',
})
export class IfClaimDirective {
  @Input() ifClaimHide = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store
  ) {}

  @Input('ifClaim')
  set ifClaimDirective(ifClaim: string) {
    this.updateView(ifClaim);
  }

  private updateView(ifClaim: string) {
    const isDisabled = !this.store.selectSignal(UserHasClaim(ifClaim));
    const showElement = this.ifClaimHide ? isDisabled : !isDisabled;

    this.viewContainer.clear();
    if (showElement) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

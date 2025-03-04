import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserHasRole } from '../services/store/user/selector';

@Directive({
  selector: '[ifNotRole]',
})
export class IfNotRoleDirective implements OnInit, OnDestroy {
  @Input() ifNotRole: string;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store
  ) {}

  ngOnInit() {
    this.updateView();
  }

  ngOnDestroy() {
    this.clearView();
  }

  private updateView() {
    const roleExists = this.store.selectSignal(UserHasRole(this.ifNotRole));

    if (!roleExists) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.clearView();
    }
  }

  private clearView() {
    this.viewContainer.clear();
  }
}

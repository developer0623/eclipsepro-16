import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserHasRole } from '../services/store/user/selector';

@Directive({
  selector: '[ifRole]',
})
export class IfRoleDirective implements OnInit, OnDestroy {
  @Input() ifRole: string;
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
    const roleExists = this.store.selectSignal(UserHasRole(this.ifRole));

    if (roleExists) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.clearView();
    }
  }

  private clearView() {
    this.viewContainer.clear();
  }
}

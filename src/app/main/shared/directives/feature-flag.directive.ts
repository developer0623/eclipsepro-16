import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagService } from '../services/feature-flag.service';
@Directive({
  selector: '[featureFlag]',
})
export class FeatureFlagDirective {
  @Input() featureFlagHide = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  @Input('featureFlag')
  set featureFlagDirective(featureFlag: string) {
    this.updateView(featureFlag);
  }

  private updateView(featureFlag: string) {
    const isDisabled = this.featureFlagService.featureDisabled(featureFlag);
    const showElement = this.featureFlagHide ? isDisabled : !isDisabled;

    this.viewContainer.clear();
    if (showElement) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

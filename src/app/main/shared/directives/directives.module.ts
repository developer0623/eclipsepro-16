import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolTipRendererDirective } from './tool-tip-renderer.directive';
import { MatTabScrollToCenterDirective } from './scroll-to-center.directive';
import { IfClaimDirective } from './if-claim.directive';
import { FeatureFlagDirective } from './feature-flag.directive';
import { BtfMarkdownDirective } from './btf-markdown.directive';
import { DebounceKeyUpDirective } from './debounce-key-up.directive';
import { IfRoleDirective } from './if-role.directive';
import { IfNotRoleDirective } from './if-not-role.directive';

@NgModule({
  declarations: [
    ToolTipRendererDirective,
    MatTabScrollToCenterDirective,
    IfClaimDirective,
    FeatureFlagDirective,
    BtfMarkdownDirective,
    DebounceKeyUpDirective,
    IfRoleDirective,
    IfNotRoleDirective,
  ],
  imports: [CommonModule],
  exports: [
    ToolTipRendererDirective,
    MatTabScrollToCenterDirective,
    IfClaimDirective,
    FeatureFlagDirective,
    BtfMarkdownDirective,
    DebounceKeyUpDirective,
    IfRoleDirective,
    IfNotRoleDirective,
  ],
})
export class DirectivesModule {}

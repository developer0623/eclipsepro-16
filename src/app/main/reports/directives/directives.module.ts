import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusMeDirective } from './focus-me.directive';

@NgModule({
  declarations: [FocusMeDirective],
  imports: [CommonModule],
  exports: [FocusMeDirective],
})
export class ReportsDirectivesModule {}

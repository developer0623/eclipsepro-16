import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoadingIndicatorComponent } from './loading-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [LoadingIndicatorComponent],
  exports: [LoadingIndicatorComponent],
})
export class LoadingIndicatorModule {
}

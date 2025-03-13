import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryPercentPipe } from './summary-percent.pipe';
import { SummaryDateFilterPipe } from './summary-date-filter.pipe';
import { TimebarPercentPipe } from './timebar-percent.pipe';
import { PrintDateFilterPipe } from './print-date-filter.pipe';
import { NumberFilterPipe } from './number-filter.pipe';

@NgModule({
  declarations: [
    SummaryPercentPipe,
    SummaryDateFilterPipe,
    TimebarPercentPipe,
    PrintDateFilterPipe,
    NumberFilterPipe,
  ],
  imports: [CommonModule],
  exports: [
    SummaryPercentPipe,
    SummaryDateFilterPipe,
    TimebarPercentPipe,
    PrintDateFilterPipe,
    NumberFilterPipe,
  ],
})
export class SummaryPipesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UnitsFormatPipe,
  UnitsValuePipe,
  UserDisplayUnitsPipe,
  TaskLenghValuePipe,
} from './units.pipe';
import { ObscureNumberStringPipe } from './obscure-number-string.pipe';
import { ShowInMiniPipe } from './show-in-mini.pipe';
import { OrderByPipe } from './order-by.pipe';
import { ShowInLargePipe } from './show-in-large.pipe';
import { MetricLargeFilterPipe } from './metric-large-filter.pipe';
import {
  AgePipe,
  AmsDatesPipe,
  AmsTimePipe,
  AmsDateTimePipe,
  AmsDateTimeSecPipe,
  AmsTimeAgoPipe,
  TimeSpanPipe,
  MaDatePipe,
  TaskActiveAgoPipe,
  TaskCompleteAgoPipe,
  TaskTimeAgoPipe,
} from './dates.pipe';
import { TimeAgoPipe } from './basic.pipe';
import { FilterByKeyPipe } from './filter-by-key.pipe';
import { AndonDisplayFilterPipe } from './andon-display-filter.pipe';
import { GroupByPipe } from './group-by.pipe';
import { OrderStatusPipe } from './order-status.pipe';
import { HighlightPipe } from './highlight.pipe';
import { DynamicFilterPipe } from './dynamic-filter.pipe';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { BuildDurationPipe, RepeatTextPipe, SideLabelPipe } from './dashboard.pipe';

@NgModule({
  declarations: [
    UnitsFormatPipe,
    UnitsValuePipe,
    UserDisplayUnitsPipe,
    TaskLenghValuePipe,
    ObscureNumberStringPipe,
    ShowInMiniPipe,
    OrderByPipe,
    ShowInLargePipe,
    MetricLargeFilterPipe,
    AmsDatesPipe,
    AgePipe,
    AmsTimePipe,
    AmsDateTimePipe,
    AmsDateTimeSecPipe,
    AmsTimeAgoPipe,
    TimeSpanPipe,
    TimeAgoPipe,
    FilterByKeyPipe,
    AndonDisplayFilterPipe,
    OrderStatusPipe,
    MaDatePipe,
    GroupByPipe,
    HighlightPipe,
    DynamicFilterPipe,
    TaskActiveAgoPipe,
    TaskCompleteAgoPipe,
    TaskTimeAgoPipe,
    ObjectToArrayPipe,
    BuildDurationPipe,
    RepeatTextPipe,
    SideLabelPipe,
  ],
  imports: [CommonModule],
  exports: [
    UnitsFormatPipe,
    UnitsValuePipe,
    UserDisplayUnitsPipe,
    TaskLenghValuePipe,
    ObscureNumberStringPipe,
    ShowInMiniPipe,
    OrderByPipe,
    ShowInLargePipe,
    MetricLargeFilterPipe,
    AmsDatesPipe,
    AgePipe,
    AmsTimePipe,
    AmsDateTimePipe,
    AmsDateTimeSecPipe,
    AmsTimeAgoPipe,
    TimeSpanPipe,
    TimeAgoPipe,
    FilterByKeyPipe,
    AndonDisplayFilterPipe,
    OrderStatusPipe,
    MaDatePipe,
    GroupByPipe,
    HighlightPipe,
    DynamicFilterPipe,
    TaskActiveAgoPipe,
    TaskCompleteAgoPipe,
    TaskTimeAgoPipe,
    ObjectToArrayPipe,
    BuildDurationPipe,
    RepeatTextPipe,
    SideLabelPipe,
  ],
})
export class PipesModule {}

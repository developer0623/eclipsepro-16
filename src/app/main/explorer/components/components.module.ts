import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxTranslateModule } from '../../../translate/translate.module';
import { DcLinearBarChartComponent } from './dc-linear-bar-chart/dc-linear-bar-chart.component';
import { DcTimeBarChartComponent } from './dc-time-bar-chart/dc-time-bar-chart.component';
import { DcParetoChartComponent } from './dc-pareto-chart/dc-pareto-chart.component';

@NgModule({
  declarations: [DcLinearBarChartComponent, DcTimeBarChartComponent, DcParetoChartComponent],
  imports: [CommonModule, FlexLayoutModule, NgxTranslateModule],
  exports: [DcLinearBarChartComponent, DcTimeBarChartComponent, DcParetoChartComponent],
})
export class ComponentsModule {}

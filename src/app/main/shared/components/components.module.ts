import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { InlineEditorModule } from '../inline-editor/inline-editor.module';
import { DirectivesModule } from '../directives/directives.module';
import { MachineDashboardMiniComponent } from './machine-dashboard-mini/machine-dashboard-mini.component';
import { DeviceDashboardMiniComponent } from './device-dashboard-mini/device-dashboard-mini.component';
import { HoleCountModeIconComponent } from './hole-count-mode-icon/hole-count-mode-icon.component';
import { LockoutIndicatorComponent } from './lockout-indicator/lockout-indicator.component';
import { RunStateIndicatorComponent } from './run-state-indicator/run-state-indicator.component';
import { SnapshotBarComponent } from './snapshot-bar/snapshot-bar.component';
import { DurationDisplayComponent } from './duration-display/duration-display.component';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { MetricLargeComponent } from './metric-large/metric-large.component';
import { HelpIconComponent } from './help-icon/help-icon.component';
import { SparklineComponent } from './sparkline/sparkline.component';
import { BulletChartComponent } from './bullet-chart/bullet-chart.component';
import { NvD3Component } from './nvd3/nvd3.component';
import { CustomToolTipComponent } from './custom-tooltip/custom-tooltip.component';
import { ShiftSelectComponent } from './shift-select/shift-select.component';
import { ShiftSummaryComponent } from './shift-summary/shift-summary.component';
import { ScheduleSummaryComponent } from './schedule-summary/schedule-summary.component';
import { ParetoComponent } from './pareto/pareto.component';
import { TimelineXAxisComponent } from './timeline-xaxis/timeline-xaxis.component';
import { TimelineBlockComponent } from './timeline-block/timeline-block.component';
import { ProductionLogComponent } from './production-log/production-log.component';
import { BulletChartPreviewComponent } from './bullet-chart-preview/bullet-chart-preview.component';
import { AndonDisplayComponent } from './andon-display/andon-display.component';
import { CurrentTimeComponent } from './current-time/current-time.component';
import { LinkHelperComponent } from './link-helper/link-helper.component';
import { CoilTypePreviewComponent } from './coil-type-preview/coil-type-preview.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { AgGridTempComponent } from './ag-grid-temp/ag-grid-temp.component';
import { AgGridAngular } from 'ag-grid-angular';
import { PunchPatternPreviewComponent } from './punch-pattern-preview/punch-pattern-preview.component';
import { JobDetailPreviewComponent } from './job-detail-preview/job-detail-preview.component';
import { LinkHelperCellComponent } from './link-helper-cell/link-helper-cell.component';
import { AlertCellComponent } from './alert-cell/alert-cell.component';
import { ShiftHistoryChartComponent } from './shift-history-chart/shift-history-chart.component';
import { Xl200PatternsComponent } from './xl200-patterns/xl200-patterns.component';
import { BundleTagCellComponent } from './bundle-tag-cell/bundle-tag-cell.component';
import { IntegrationActionCellComponent } from './integration-action-cell/integration-action-cell.component';
import { RunblocksChartComponent } from './runblocks-chart/runblocks-chart.component';
import {
  SchedulePreviouscurrentnextComponent,
  PCNRow,
} from './schedule-previouscurrentnext/schedule-previouscurrentnext.component';

import { MachineTabComponent } from './machine-tab/machine-tab.component';
import { MachineTabsComponent } from './machine-tabs/machine-tabs.component';
import { SchedulerTabsComponent } from './scheduler-tabs/scheduler-tabs.component';
import { IntegrationExportEventsComponent } from './integration-export-events/integration-export-events.component';
import { CheckboxCellComponent } from './checkbox-cell/checkbox-cell.component';
import { FoldersGridComponent } from './folders-grid/folders-grid.component';
import { PathfinderUsersGridComponent } from './pathfinder-users-grid/pathfinder-users-grid.component';
import { MachineDashboardMiniMetricComponent } from './machine-dashboard-mini-metric/machine-dashboard-mini-metric.component';
import { DeviceHourlyChartComponent } from './device-hourly-chart/device-hourly-chart.component';
import { MachineDeviceTabComponent } from './machine-device-tab/machine-device-tab.component';

@NgModule({
  declarations: [
    MachineDashboardMiniComponent,
    MachineDashboardMiniMetricComponent,
    DeviceDashboardMiniComponent,
    HoleCountModeIconComponent,
    LockoutIndicatorComponent,
    RunStateIndicatorComponent,
    SnapshotBarComponent,
    DurationDisplayComponent,
    MetricLargeComponent,
    HelpIconComponent,
    SparklineComponent,
    BulletChartComponent,
    NvD3Component,
    CustomToolTipComponent,
    ShiftSelectComponent,
    ShiftSummaryComponent,
    ScheduleSummaryComponent,
    ParetoComponent,
    TimelineXAxisComponent,
    TimelineBlockComponent,
    ProductionLogComponent,
    BulletChartPreviewComponent,
    AndonDisplayComponent,
    CurrentTimeComponent,
    LinkHelperComponent,
    CoilTypePreviewComponent,
    AgGridTempComponent,
    PunchPatternPreviewComponent,
    JobDetailPreviewComponent,
    LinkHelperCellComponent,
    AlertCellComponent,
    ShiftHistoryChartComponent,
    DeviceHourlyChartComponent,
    Xl200PatternsComponent,
    BundleTagCellComponent,
    IntegrationActionCellComponent,
    IntegrationExportEventsComponent,
    RunblocksChartComponent,
    SchedulePreviouscurrentnextComponent,
    PCNRow,
    MachineTabComponent,
    MachineTabsComponent,
    SchedulerTabsComponent,
    CheckboxCellComponent,
    FoldersGridComponent,
    PathfinderUsersGridComponent,
    MachineDeviceTabComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    PipesModule,
    DirectivesModule,
    InlineEditorModule,
    NgxTranslateModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    OverlayModule,
    AgGridAngular,
    MatProgressBarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSelectModule,
    RouterModule,
  ],
  exports: [
    MachineDashboardMiniComponent,
    MachineDashboardMiniMetricComponent,
    DeviceDashboardMiniComponent,
    HoleCountModeIconComponent,
    LockoutIndicatorComponent,
    RunStateIndicatorComponent,
    SnapshotBarComponent,
    DurationDisplayComponent,
    MetricLargeComponent,
    HelpIconComponent,
    SparklineComponent,
    BulletChartComponent,
    NvD3Component,
    CustomToolTipComponent,
    ShiftSelectComponent,
    ShiftSummaryComponent,
    ScheduleSummaryComponent,
    ParetoComponent,
    TimelineXAxisComponent,
    TimelineBlockComponent,
    ProductionLogComponent,
    BulletChartPreviewComponent,
    AndonDisplayComponent,
    CurrentTimeComponent,
    LinkHelperComponent,
    CoilTypePreviewComponent,
    AgGridTempComponent,
    PunchPatternPreviewComponent,
    JobDetailPreviewComponent,
    LinkHelperCellComponent,
    AlertCellComponent,
    ShiftHistoryChartComponent,
    DeviceHourlyChartComponent,
    Xl200PatternsComponent,
    BundleTagCellComponent,
    IntegrationActionCellComponent,
    IntegrationExportEventsComponent,
    RunblocksChartComponent,
    SchedulePreviouscurrentnextComponent,
    PCNRow,
    MachineTabComponent,
    MachineTabsComponent,
    SchedulerTabsComponent,
    CheckboxCellComponent,
    FoldersGridComponent,
    PathfinderUsersGridComponent,
    MachineDeviceTabComponent,
  ],
})
export class ComponentsModule {}

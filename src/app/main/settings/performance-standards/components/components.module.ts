import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableCellComponent } from './table-cell/table-cell.component';
import { TableDefaultCellComponent } from './table-default-cell/table-default-cell.component';
import { PerformanceChartComponent } from './performance-chart/performance-chart.component';
import { PerformanceItemComponent } from './performance-item/performance-item.component';
import { PerformanceTooltipDirective } from './performance-tooltip.directive';
import { PerformanceDialogComponent } from './performance-dialog/performance-dialog.component';

@NgModule({
  declarations: [
    TableHeaderComponent,
    TableRowComponent,
    TableCellComponent,
    TableDefaultCellComponent,
    PerformanceChartComponent,
    PerformanceItemComponent,
    PerformanceTooltipDirective,
    PerformanceDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    OverlayModule,
    MatDialogModule,
    MatTabsModule,
    MatRadioModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  exports: [
    TableHeaderComponent,
    TableRowComponent,
    TableCellComponent,
    TableDefaultCellComponent,
    PerformanceChartComponent,
    PerformanceItemComponent,
  ],
})
export class ComponentsModule {}

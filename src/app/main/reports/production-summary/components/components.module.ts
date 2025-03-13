import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { HeaderTooltipComponent } from './header-tooltip/header-tooltip.component';
import { MachineSummaryComponent } from './machine-summary/machine-summary.component';
import { SummaryHistoryComponent } from './summary-history/summary-history.component';
import { SummaryStateComponent } from './summary-state/summary-state.component';
import { SummaryTimebarComponent } from './summary-timebar/summary-timebar.component';
import { SummaryPipesModule } from '../summary-pipes/summary-pipes.module';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';
import { PrintMachineSummaryComponent } from './print-machine-summary/print-machine-summary.component';
import { PrintSummaryStateComponent } from './print-summary-state/print-summary-state.component';
import { PrintSummaryTimebarComponent } from './print-summary-timebar/print-summary-timebar.component';
import { MachineSummaryDialogComponent } from './machine-summary-dialog/machine-summary-dialog.component';

@NgModule({
  declarations: [
    HeaderTooltipComponent,
    MachineSummaryComponent,
    SummaryHistoryComponent,
    SummaryStateComponent,
    SummaryTimebarComponent,
    PrintDialogComponent,
    PrintMachineSummaryComponent,
    PrintSummaryStateComponent,
    PrintSummaryTimebarComponent,
    MachineSummaryDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSelectModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    PipesModule,
    SummaryPipesModule,
  ],
  exports: [
    HeaderTooltipComponent,
    MachineSummaryComponent,
    SummaryHistoryComponent,
    SummaryStateComponent,
    SummaryTimebarComponent,
    PrintDialogComponent,
    PrintMachineSummaryComponent,
    PrintSummaryStateComponent,
    PrintSummaryTimebarComponent,
  ],
})
export class ProductionSummaryComponentsModule {}

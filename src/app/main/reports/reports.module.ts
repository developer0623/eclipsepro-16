import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxTranslateModule } from '../../translate/translate.module';
import { DelaySummaryComponent } from './delay-summary/delay-summary.component';
import { ComponentsModule as ReportsComponentsModule } from './components/components.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { ComponentsModule } from '../shared/components/components.module';
import { DirectivesModule } from '../shared/directives/directives.module';
import { SummaryPipesModule } from './production-summary/summary-pipes/summary-pipes.module';
import { ProductionSummaryComponentsModule } from './production-summary/components/components.module';
import { ScrapSummaryComponent } from './scrap-summary/scrap-summary.component';
import { ProductionSummaryComponent } from './production-summary/production-summary.component';
import { ProductionEventsComponent } from './production-events/production-events.component';
import { MaterialUsageComponent } from './material-usage/material-usage.component';
import { CoilSummaryComponent } from './coil-summary/coil-summary.component';
import { CoilScrapComponent } from './coil-scrap/coil-scrap.component';
import { ToolingUsageComponent } from './tooling-usage/tooling-usage.component';
import { MaterialDemandComponent } from './material-demand/material-demand.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderSequenceComponent } from './order-sequence/order-sequence.component';
import { QualityAuditComponent } from './quality-audit/quality-audit.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [
    DelaySummaryComponent,
    ScrapSummaryComponent,
    ProductionSummaryComponent,
    ProductionEventsComponent,
    MaterialUsageComponent,
    CoilSummaryComponent,
    CoilScrapComponent,
    ToolingUsageComponent,
    MaterialDemandComponent,
    OrderSummaryComponent,
    OrderSequenceComponent,
    QualityAuditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    NgxTranslateModule,
    NgScrollbarModule,
    OverlayModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatMenuModule,
    MatDividerModule,
    ScrollingModule,
    ReportsComponentsModule,
    ComponentsModule,
    PipesModule,
    ProductionSummaryComponentsModule,
    SummaryPipesModule,
    DirectivesModule,
    ReportsRoutingModule
  ],
  providers: [
    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ReportsModule {}

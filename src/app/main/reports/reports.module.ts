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
// const delaySummaryState = {
//   name: 'app.report_delay-summary',
//   url: '/report/delay-summary?startDate&endDate&group1&group2&machines&delayCodes',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     group1: { type: 'query', dynamic: true },
//     group2: { type: 'query', dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//     delayCodes: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: DelaySummaryComponent },
//   },
// };

// const scrapSummaryState = {
//   name: 'app.report_scrap-summary',
//   url: '/report/scrap-summary?startDate&endDate&group1&group2&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     group1: { type: 'query', dynamic: true },
//     group2: { type: 'query', dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: ScrapSummaryComponent },
//   },
// };

// const productionSummaryState = {
//   name: 'app.report_production-summary',
//   url: '/report/production-summary?startDate&endDate&duration&shifts&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     duration: { type: 'query', dynamic: true },
//     shifts: { type: 'query', array: true, dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: ProductionSummaryComponent },
//   },
// };

// const productionEventsState = {
//   name: 'app.report_production-events',
//   url: '/report/production-events?startDate&endDate&shifts&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     shifts: { type: 'query', array: true, dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: ProductionEventsComponent },
//   },
// };

// const materialUsageState = {
//   name: 'app.report_material-usage',
//   url: '/report/material-usage?startDate&endDate&duration&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     duration: { type: 'query', dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: MaterialUsageComponent },
//   },
// };

// const coilSummaryState = {
//   name: 'app.report_coil-summary',
//   url: '/report/coil-summary?startDate&endDate&duration&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     duration: { type: 'query', dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: CoilSummaryComponent },
//   },
// };

// const coilScrapState = {
//   name: 'app.report_coil-scrap',
//   url: '/report/coil-scrap?startDate&endDate&duration&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     duration: { type: 'query', dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: CoilScrapComponent },
//   },
// };

// const toolingUsageState = {
//   name: 'app.report_tooling-usage',
//   url: '/report/tooling-usage?startDate&endDate&duration&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     duration: { type: 'query', dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: ToolingUsageComponent },
//   },
// };

// const materialDemandState = {
//   name: 'app.report_material-demand',
//   url: '/report/material-demand?startDate&endDate&duration&scheduleStatus',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     duration: { type: 'query', dynamic: true },
//     scheduleStatus: { type: 'query', dynamic: true },
//   },
//   views: {
//     'content@app': { component: MaterialDemandComponent },
//   },
// };

// const orderSummaryState = {
//   name: 'app.report_order-summary',
//   url: '/report/order-summary?startDate&endDate&shifts&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     shifts: { type: 'query', array: true, dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: OrderSummaryComponent },
//   },
// };

// const orderSequenceState = {
//   name: 'app.report_order-sequence',
//   url: '/report/order-sequence?machines',
//   params: {
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: OrderSequenceComponent },
//   },
// };

// const qualityAuditState = {
//   name: 'app.report_quality-audit',
//   url: '/report/quality-audit?startDate&endDate&shifts&machines',
//   params: {
//     startDate: { type: 'query', dynamic: true },
//     endDate: { type: 'query', dynamic: true },
//     shifts: { type: 'query', array: true, dynamic: true },
//     machines: { type: 'query', array: true, dynamic: true },
//   },
//   views: {
//     'content@app': { component: QualityAuditComponent },
//   },
// };

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

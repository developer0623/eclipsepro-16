import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
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
import { DelaySummaryComponent } from './delay-summary/delay-summary.component';

const routes: Routes = [
  {
    path: 'production-summary',
    component: ProductionSummaryComponent
  },
  {
    path: 'production-events',
    component: ProductionEventsComponent,
  },
  {
    path: 'delay-summary',
    component: DelaySummaryComponent
  },
  {
    path: 'scrap-summary',
    component: ScrapSummaryComponent,
  },
  {
    path: 'coil-summary',
    component: CoilSummaryComponent
  },
  {
    path: 'coil-scrap',
    component: CoilScrapComponent,
  },
  {
    path: 'material-usage',
    component: MaterialUsageComponent,
  },
  {
    path: 'tooling-usage',
    component: ToolingUsageComponent,
  },
  {
    path: 'material-demand',
    component: MaterialDemandComponent,
  },
  {
    path: 'order-summary',
    component: OrderSummaryComponent,
  },
  {
    path: 'order-sequence',
    component: OrderSequenceComponent,
  },
  {
    path: 'quality-audit',
    component: QualityAuditComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}

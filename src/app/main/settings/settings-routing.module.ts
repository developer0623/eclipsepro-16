import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { SystemPreferencesComponent } from './system-preferences/system-preferences.component';
import { BundlingComponent } from './bundling/bundling.component';
import { LicensingComponent } from './licensing/licensing.component';
import { MetricConfigComponent } from './metric-config/metric-config.component';
import { LossCodeComponent } from './loss-code/loss-code.component';
import { WallboardComponent } from './wallboard/wallboard.component';
import { IntegrationComponent } from './integration/integration.component';
import { PerformanceStandardsComponent } from './performance-standards/performance-standards.component';
import { PrintingComponent } from './printing/printing.component';
import { PrintingPreviewComponent } from './printing-preview/printing-preview.component';
import { UsersComponent } from './users/users.component';
import { UserSettingsComponent } from './users/user-settings/user-settings.component';
import { StatusViewComponent } from './status/status-view/status-view.component';
import { UpdateComponent } from './update/update.component';
import { ExperimentsComponent } from './experiments/experiments.component';
import { AgentComponent } from './agent/agent.component';

const routes: Routes = [
  {
    path: 'system-preferences',
    component: SystemPreferencesComponent
  },
  {
    path: 'bundling',
    component: BundlingComponent,
  },
  {
    path: 'licensing',
    component: LicensingComponent
  },
  {
    path: 'metric-config',
    component: MetricConfigComponent,
  },
  {
    path: 'losscode',
    component: LossCodeComponent
  },
  {
    path: 'wallboard',
    component: WallboardComponent,
  },
  {
    path: 'integration',
    component: IntegrationComponent,
  },
  {
    path: 'performancestandards',
    component: PerformanceStandardsComponent,
  },
  {
    path: 'printing',
    component: PrintingComponent,
  },
  {
    path: 'printing-preview',
    component: PrintingPreviewComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/:userName',
    component: UserSettingsComponent,
  },
  {
    path: 'status',
    component: StatusViewComponent,
  },
  {
    path: 'update',
    component: UpdateComponent,
  },
  {
    path: 'experiments',
    component: ExperimentsComponent,
  },
  {
    path: 'agent',
    component: AgentComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}

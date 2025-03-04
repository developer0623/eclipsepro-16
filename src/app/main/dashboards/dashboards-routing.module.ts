import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboards2Component } from './dashboards/dashboards.component';
import { MachineDetailComponent } from './machine-detail/machine-detail.component';

const routes: Routes = [
  {
    path: '',
    component: Dashboards2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { GoodProductionComponent } from './good-production/good-production.component';
import { DowntimeComponent } from './downtime/downtime.component';
import { ScrapComponent } from './scrap/scrap.component';
import { PathfinderExplorerComponent } from './pathfinder-explorer/pathfinder-explorer.component';
import { PathfinderOperationsComponent } from './pathfinder-operations/pathfinder-operations.component';
const routes: Routes = [
  {
    path: 'good-production',
    component: GoodProductionComponent
  },
  {
    path: 'downtime',
    component: DowntimeComponent
  },
  {
    path: 'scrap',
    component: ScrapComponent
  },
  {
    path: 'pathfinder-operations',
    component: PathfinderOperationsComponent
  },
  {
    path: 'pathfinder-goodparts',
    component: PathfinderExplorerComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExplorerRoutingModule {}

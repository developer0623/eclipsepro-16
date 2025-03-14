import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathfinderComponent } from './pathfinder/pathfinder.component';
import { Xl200ListComponent } from './xl200/xl200-list/xl200-list.component';
import { Xl200DetailComponent } from './xl200/xl200-detail/xl200-detail.component';

const routes: Routes = [
  {
    path: 'pathfinder',
    component: PathfinderComponent
  },
  {
    path: 'xl200',
    component: Xl200ListComponent
  },
  {
    path: 'xl200/:id',
    component: Xl200DetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachinesRoutingModule {}

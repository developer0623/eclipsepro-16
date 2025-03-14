import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolingListComponent } from './tooling-list/tooling-list.component';
import { ToolingDetailComponent } from './tooling-detail/tooling-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ToolingListComponent
  },
  {
    path: ':id',
    component: ToolingDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolingRoutingModule {}

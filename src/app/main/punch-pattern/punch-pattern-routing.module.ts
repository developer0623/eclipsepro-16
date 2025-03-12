import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PunchPatternListComponent } from './punch-pattern-list/punch-pattern-list.component';
import { PunchPatternDetailComponent } from './punch-pattern-detail/punch-pattern-detail.component';
import { confirmExitGuard } from './punch-pattern-detail/confirm-exist.guard';

const routes: Routes = [
  {
    path: '',
    component: PunchPatternListComponent
  },
  {
    path: ':id',
    component: PunchPatternDetailComponent,
    canDeactivate: [confirmExitGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PunchPatternRoutingModule {}

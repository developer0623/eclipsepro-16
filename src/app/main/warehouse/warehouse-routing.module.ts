import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/users.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';

const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'app-settings',
    component: AppSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoilTypesComponent } from './coil-types/coil-types.component';
import { CoilTypeDetailComponent } from './coil-type-detail/coil-type-detail.component';
import { CoilsComponent } from './coils/coils.component';
import { CoilDetailComponent } from './coil-detail/coil-detail.component';

const routes: Routes = [
  {
    path: 'coil-types',
    component: CoilTypesComponent
  },
  {
    path: 'coil-types/:id',
    component: CoilTypeDetailComponent,
  },
  {
    path: 'coils',
    component: CoilsComponent
  },
  {
    path: 'coils/:id',
    component: CoilDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}

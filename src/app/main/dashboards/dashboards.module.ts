import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { Dashboards2Component } from './dashboards/dashboards.component';
import { ComponentsModule } from '../shared/components/components.module';
import { DirectivesModule } from '../shared/directives/directives.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { MachineDetailComponent } from './machine-detail/machine-detail.component';
import { MachineDetailComponentXl } from './machine-detail-xl/machine-detail-xl.component';
import { MachineDetailComponentDevice } from './machine-detail-device/machine-detail-device.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';

@NgModule({
  declarations: [
    Dashboards2Component,
    MachineDetailComponent,
    MachineDetailComponentXl,
    MachineDetailComponentDevice,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    ComponentsModule,
    DirectivesModule,
    FlexLayoutModule,
    DashboardsRoutingModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatIconModule,
    MatButtonModule,
    PipesModule,
    NgxTranslateModule,
    AgGridAngular,
  ],
})
export class DashboardsModule {}

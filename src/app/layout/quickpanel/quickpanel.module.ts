import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ScrollbarModule } from '../../../@fury/shared/scrollbar/scrollbar.module';
import { QuickpanelComponent } from './quickpanel.component';
import { AlertScheduleSlipComponent } from './alert-schedule-slip/alert-schedule-slip.component';
import { AlertWarehouseLateComponent } from './alert-warehouse-late/alert-warehouse-late.component';
import { AlertIntegrationErrorComponent } from './alert-integration-error/alert-integration-error.component';
import { AlertLicensingComponent } from './alert-licensing/alert-licensing.component';
import { AlertGeneralComponent } from './alert-general/alert-general.component';
import { PipesModule } from 'src/app/main/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ScrollbarModule,
    PipesModule
  ],
  declarations: [QuickpanelComponent, AlertScheduleSlipComponent, AlertWarehouseLateComponent, AlertIntegrationErrorComponent, AlertLicensingComponent, AlertGeneralComponent],
  exports: [QuickpanelComponent]
})
export class QuickpanelModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReportHeaderComponent } from './report-header/report-header.component';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { ReportDateColComponent } from './report-date-col/report-date-col.component';
import { GroupHeaderComponent } from './group-header/group-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReportsDirectivesModule } from '../directives/directives.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { CheckboxMenuComponent } from './checkbox-menu/checkbox-menu.component';
import { DelayCheckBoxMenuComponent } from './delay-check-box-menu/delay-check-box-menu.component';

@NgModule({
  declarations: [
    ReportHeaderComponent,
    CustomMenuComponent,
    ReportDateColComponent,
    GroupHeaderComponent,
    CheckboxMenuComponent,
    DelayCheckBoxMenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatMenuModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    ReportsDirectivesModule,
    DirectivesModule,
    PipesModule,
  ],
  exports: [
    ReportHeaderComponent,
    CustomMenuComponent,
    ReportDateColComponent,
    GroupHeaderComponent,
    CheckboxMenuComponent,
    DelayCheckBoxMenuComponent,
  ],
})
export class ComponentsModule {}

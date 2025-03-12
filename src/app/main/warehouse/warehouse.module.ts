import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { NgxTranslateModule } from '../../translate/translate.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComponentsModule } from '../shared/components/components.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { TasksComponent } from './tasks/tasks.component';
import { TaskItemComponent } from './tasks/components/task-item/task-item.component';
import { TaskActiveContentComponent } from './tasks/components/task-active-content/task-active-content.component';
import { TaskActiveFooterComponent } from './tasks/components/task-active-footer/task-active-footer.component';
import { TaskCompletedContentComponent } from './tasks/components/task-completed-content/task-completed-content.component';
import { TaskCurrentFooterComponent } from './tasks/components/task-current-footer/task-current-footer.component';
import { TaskHeaderComponent } from './tasks/components/task-header/task-header.component';
import { UsersComponent } from './users/users.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { AddLocationComponent } from './app-settings/add-location/add-location.component';
import { AddReasonComponent } from './app-settings/add-reason/add-reason.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';

@NgModule({
  declarations: [
    TasksComponent,
    TaskItemComponent,
    TaskActiveContentComponent,
    TaskActiveFooterComponent,
    TaskCompletedContentComponent,
    TaskHeaderComponent,
    TaskCurrentFooterComponent,
    UsersComponent,
    AppSettingsComponent,
    AddLocationComponent,
    AddReasonComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    NgxTranslateModule,
    MatSnackBarModule,
    ComponentsModule,
    PipesModule,
    WarehouseRoutingModule
  ],
})
export class WarehouseModule {}

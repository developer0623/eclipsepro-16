import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxTranslateModule } from '../../../translate/translate.module';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { InlineEditorModule } from '../../shared/inline-editor/inline-editor.module';
import { Xl200ListComponent } from './xl200-list/xl200-list.component';
import { Xl200DetailComponent } from './xl200-detail/xl200-detail.component';
import { Xl200LockoutItemComponent } from './xl200-lockout-item/xl200-lockout-item.component';
import { Xl200ToolsComponent } from './xl200-tools/xl200-tools.component';
import { Xl200SetupsComponent } from './xl200-setups/xl200-setups.component';
import { HistoryDialogComponent } from './history-dialog/history-dialog.component';

@NgModule({
  declarations: [
    Xl200ListComponent,
    Xl200DetailComponent,
    Xl200LockoutItemComponent,
    Xl200ToolsComponent,
    Xl200SetupsComponent,
    HistoryDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridAngular,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NgScrollbarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxTranslateModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    InlineEditorModule,
  ],
})
export class Xl200Module {}

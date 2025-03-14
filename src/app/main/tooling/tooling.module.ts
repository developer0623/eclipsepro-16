import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InlineEditorModule } from '../shared/inline-editor/inline-editor.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { ComponentsModule } from '../shared/components/components.module';
import { DirectivesModule } from '../shared/directives/directives.module';
import { NgxTranslateModule } from 'src/app/translate/translate.module';
import { ToolingListComponent } from './tooling-list/tooling-list.component';
import { ToolingDetailComponent } from './tooling-detail/tooling-detail.component';
import { AddToolingModalComponent } from './add-tooling-modal/add-tooling-modal.component';
import { AddMachineModalComponent } from './add-machine-modal/add-machine-modal.component';
import { ToolingRoutingModule } from './tooling-routing.module';

@NgModule({
  declarations: [
    ToolingListComponent,
    ToolingDetailComponent,
    AddToolingModalComponent,
    AddMachineModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSortModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    FlexLayoutModule,
    InlineEditorModule,
    ToolingRoutingModule,
    NgxTranslateModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
  ],
})
export class ToolingModule {}

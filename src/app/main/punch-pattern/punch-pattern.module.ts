import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxTranslateModule } from '../../translate/translate.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { ComponentsModule } from '../shared/components/components.module';
import { DirectivesModule } from '../shared/directives/directives.module';
import { InlineEditorModule } from '../shared/inline-editor/inline-editor.module';

import { PunchPatternListComponent } from './punch-pattern-list/punch-pattern-list.component';
import { PunchPatternDetailComponent } from './punch-pattern-detail/punch-pattern-detail.component';
import { PunchRowComponent } from './punch-row/punch-row.component';
import { AddPatternModalComponent } from './add-pattern-modal/add-pattern-modal.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PunchPatternRoutingModule } from './punch-pattern-routing.module';

// const listState = {
//   name: 'app.punch-patterns',
//   url: '/punch-patterns',
//   views: {
//     'content@app': { component: PunchPatternListComponent },
//   },
// };

// const detailState = {
//   name: 'app.punch-patterns.detail',
//   url: '/:id',
//   views: {
//     'content@app': { component: PunchPatternDetailComponent },
//   },
//   params: {
//     id: { dynamic: true },
//     name: { dynamic: false },
//   },
// };

@NgModule({
  declarations: [
    PunchPatternListComponent,
    PunchPatternDetailComponent,
    PunchRowComponent,
    AddPatternModalComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    NgScrollbarModule,
    FlexLayoutModule,
    PunchPatternRoutingModule,
    NgxTranslateModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    InlineEditorModule,
  ],
})
export class PunchPatternModule {}

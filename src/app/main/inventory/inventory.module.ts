import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxTranslateModule } from '../../translate/translate.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { DirectivesModule } from '../shared/directives/directives.module';
import { ComponentsModule } from '../shared/components/components.module';
import { CoilTypesComponent } from './coil-types/coil-types.component';
import { CoilTypeDetailComponent } from './coil-type-detail/coil-type-detail.component';
import { ConsumptionSummaryComponent } from './consumption-summary/consumption-summary.component';
import { MaterialEditDialogComponent } from './material-edit-dialog/material-edit-dialog.component';
import { CoilsComponent } from './coils/coils.component';
import { CoilDetailComponent } from './coil-detail/coil-detail.component';
import { CoilTagPrintDialogComponent } from './coil-tag-print-dialog/coil-tag-print-dialog.component';
import { InventoryRoutingModule } from './inventory-routing.module';

@NgModule({
  declarations: [
    CoilTypesComponent,
    CoilTypeDetailComponent,
    ConsumptionSummaryComponent,
    MaterialEditDialogComponent,
    CoilsComponent,
    CoilDetailComponent,
    CoilTagPrintDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxTranslateModule,
    FlexLayoutModule,
    NgScrollbarModule,
    AgGridAngular,
    InventoryRoutingModule,
    PipesModule,
    DirectivesModule,
    ComponentsModule,
  ],
})
export class InventoryModule {}

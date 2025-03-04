import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { EditInputComponent } from './edit-input/edit-input.component';
import { AutoSelectDirective } from './auto-select.directive';
import { EditSelectComponent } from './edit-select/edit-select.component';
import { EditAutocompleteComponent } from './edit-autocomplete/edit-autocomplete.component';
import { EditDateComponent } from './edit-date/edit-date.component';
import { EditInputNewComponent } from './edit-input-new/edit-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  declarations: [
    EditInputComponent,
    AutoSelectDirective,
    EditSelectComponent,
    EditAutocompleteComponent,
    EditDateComponent,
    EditInputNewComponent,
  ],
  exports: [
    EditInputComponent,
    EditSelectComponent,
    EditAutocompleteComponent,
    EditDateComponent,
    EditInputNewComponent,
  ],
})
export class InlineEditorModule {}

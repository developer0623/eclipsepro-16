import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-tooling-modal',
  templateUrl: './add-tooling-modal.component.html',
  styleUrls: ['./add-tooling-modal.component.scss'],
})
export class AddToolingModalComponent {
  toolingForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddToolingModalComponent>) {
    this.toolingForm = this.fb.group({
      toolingCode: ['', Validators.required],
    });
  }

  cancel() {
    this.dialogRef.close(); // Close the dialog without saving
  }

  save() {
    if (this.toolingForm.valid) {
      const toolingCode = this.toolingForm.value.toolingCode;
      this.dialogRef.close(toolingCode); // Close and pass the tooling code
    }
  }
}

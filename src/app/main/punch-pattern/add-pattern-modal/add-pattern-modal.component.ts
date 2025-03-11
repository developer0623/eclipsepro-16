import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-pattern-modal',
  templateUrl: './add-pattern-modal.component.html',
  styleUrls: ['./add-pattern-modal.component.scss'],
})
export class AddPatternModalComponent {
  patternName = '';

  constructor(public dialogRef: MatDialogRef<AddPatternModalComponent>) {}

  cancel() {
    this.dialogRef.close(false);
  }

  onSave() {
    if (this.patternName) {
      this.dialogRef.close(this.patternName);
    }
  }
}

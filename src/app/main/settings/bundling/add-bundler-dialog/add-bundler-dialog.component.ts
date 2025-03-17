import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-bundler-dialog',
  templateUrl: './add-bundler-dialog.component.html',
  styleUrls: ['./add-bundler-dialog.component.scss'],
})
export class AddBundlerDialogComponent {
  type = '';
  result = {
    material: '',
    customer: '',
    tooling: '',
  };
  constructor(
    public dialogRef: MatDialogRef<AddBundlerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string }
  ) {
    this.type = data.type;
  }

  add() {
    this.dialogRef.close({ ...this.result, type: this.type });
  }
}

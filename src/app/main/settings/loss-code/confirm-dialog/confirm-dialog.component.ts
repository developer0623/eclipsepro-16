import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-code-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class CodeConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<CodeConfirmDialogComponent>) {}

  onUpdate(): void {
    this.dialogRef.close('update');
  }

  onAddNew() {
    this.dialogRef.close('add');
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

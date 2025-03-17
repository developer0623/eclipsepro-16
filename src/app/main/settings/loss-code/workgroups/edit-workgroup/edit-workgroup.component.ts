import { Component, Inject } from '@angular/core';
import { IWorkgroup } from '../../types';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-workgroup',
  templateUrl: './edit-workgroup.component.html',
  styleUrls: ['./edit-workgroup.component.scss'],
})
export class EditWorkgroupComponent {
  workgroup: IWorkgroup;

  editBtnText: string = 'Save';

  constructor(
    public dialogRef: MatDialogRef<EditWorkgroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workgroup: IWorkgroup }
  ) {
    this.workgroup = data.workgroup;
  }

  onSave() {
    this.dialogRef.close(this.workgroup);
  }

  onCancel() {
    this.dialogRef.close();
  }
}

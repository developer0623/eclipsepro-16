import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Category {
  translateKey: string;
  value: string;
}

@Component({
  selector: 'app-add-code-dialog',
  templateUrl: './add-code-dialog.component.html',
  styleUrls: ['./add-code-dialog.component.scss'],
})
export class AddCodeDialogComponent {
  categories: Category[];
  respTypes = ['NotSpecified', 'Operational', 'Equipment', 'External'];
  avaCodes = [];
  result = {
    code: 0,
    description: '',
    exempt: false,
    group: '',
    responsibility: this.respTypes[0],
    workGroup: '',
    category: 'None',
  };
  isEdit = false;
  editBtnText = 'Add';
  groups = [];
  workGroups = [];
  constructor(
    public dialogRef: MatDialogRef<AddCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { categories: Category[]; avaCodes: number[]; groups; workGroups; code; isEdit }
  ) {
    this.categories = data.categories;
    this.avaCodes = data.avaCodes;
    this.result = data.code ? { ...data.code } : { ...this.result, code: data.avaCodes[0] };
    this.isEdit = data.isEdit;
    this.editBtnText = this.isEdit ? 'Edit' : 'Add';
    this.groups = data.groups;
    this.workGroups = data.workGroups;
  }

  add() {
    this.dialogRef.close({ ...this.result });
  }

  update() {
    this.dialogRef.close({ ...this.result });
  }

  onUpdate($event, keyVal) {
    this.result = { ...this.result, [keyVal]: $event.target.value };
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}

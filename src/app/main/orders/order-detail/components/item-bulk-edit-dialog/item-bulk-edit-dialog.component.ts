import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
declare let gtag;

@Component({
  selector: 'app-item-bulk-edit-dialog',
  templateUrl: './item-bulk-edit-dialog.component.html',
  styleUrls: ['./item-bulk-edit-dialog.component.scss'],
})
export class ItemBulkEditDialogComponent {
  fieldOptions = [
    { field: 'messageText', type: 'string' },
    { field: 'punchPattern', type: 'string', title: 'patternName' },
    { field: 'pieceMark', type: 'string' },
    { field: 'user1', type: 'string', title: 'orderUser1' },
    { field: 'user2', type: 'string', title: 'orderUser2' },
    { field: 'user3', type: 'string', title: 'orderUser3' },
    { field: 'user4', type: 'string', title: 'orderUser4' },
    { field: 'user5', type: 'string', title: 'orderUser5' },
    { field: 'bundleGroup', type: 'string' },
    { field: 'partLabelDef', type: 'string' },
    { field: 'BundleLabelDef', type: 'string' },
    { field: 'BundleLabelDef1', type: 'Date' },
    // todo: add part and bundle print format names
  ];
  bulkEditField = this.fieldOptions[0];
  value: '';
  errors: string[] = [];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ItemBulkEditDialogComponent>
  ) {
    let lsBulkEditField = localStorage.getItem('orders-detail.bulkEditField');
    if (lsBulkEditField) {
      let idx = this.fieldOptions.findIndex((o) => o.field === lsBulkEditField);
      if (idx >= 0) {
        this.bulkEditField = this.fieldOptions[idx];
      }
    }
  }

  onChangeEditField() {
    this.value = '';
  }

  cancel() {
    this.dialogRef.close(false);
  }

  save() {
    localStorage.setItem('orders-detail.bulkEditField', this.bulkEditField.field);
    let result = '';
    switch (this.bulkEditField.type) {
      case 'Date':
        result = moment(this.value).format('MM/DD/YYYY');
        break;
      default:
        result = this.value;
        break;
    }
    this.dialogRef.close({
      bulkEditResult: { field: this.bulkEditField.field, value: result },
    });
  }
}

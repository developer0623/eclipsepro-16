import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
declare let gtag;

@Component({
  selector: 'app-bulk-edit-dialog',
  templateUrl: './bulk-edit-dialog.component.html',
  styleUrls: ['./bulk-edit-dialog.component.scss'],
})
export class BulkEditDialogComponent {
  fieldOptions = [
    { field: 'requiredDate', type: 'Date' },
    { field: 'shipDate', type: 'Date' },
    { field: 'truckNumber', type: 'string' },
    { field: 'user1', type: 'string', title: 'orderUser1' },
    { field: 'user2', type: 'string', title: 'orderUser2' },
    { field: 'user3', type: 'string', title: 'orderUser3' },
    { field: 'user4', type: 'string', title: 'orderUser4' },
    { field: 'user5', type: 'string', title: 'orderUser5' },
    { field: 'stagingBay', type: 'string' },
    { field: 'loadingDock', type: 'string' },
    { field: 'operatorMessage', type: 'string' },
  ];
  bulkEditField = this.fieldOptions[0];
  value: '';
  errors: string[] = [];
  ordIds: number[];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<BulkEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ordIds: number[] }
  ) {
    this.ordIds = data.ordIds;
    // load last used field from local storage
    let lsBulkEditField = localStorage.getItem('orders-list.bulkEditField');
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
    localStorage.setItem('orders-list.bulkEditField', this.bulkEditField.field);
    let result = '';
    switch (this.bulkEditField.type) {
      case 'Date':
        result = moment(this.value).format('MM/DD/YYYY');
        break;
      default:
        result = this.value;
        break;
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http
      .patch<any>(
        `${Ams.Config.BASE_URL}/api/orderscommand/savechanges`,
        {
          ordIds: this.ordIds,
          patch: {
            operations: [
              {
                path: `/job/${this.bulkEditField.field}`,
                value: result,
                op: 'replace',
              },
            ],
          },
        },
        options
      )
      .subscribe({
        next: (data) => {
          console.log('3343434343434', data);
          gtag('event', 'orderList_bulkEdit', {
            event_category: 'orderList',
            event_label: 'bulkEdit',
            value: this.ordIds.length,
          });
          this.dialogRef.close(data);
        },
        error: (e) => {
          console.log('123444444', e);
          this.errors = e.error.errors;
        },
      });
  }
}

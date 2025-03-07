import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { Ams } from 'src/app/amsconfig';
declare let gtag;

@Component({
  selector: 'app-bulk-delete-dialog',
  templateUrl: './bulk-delete-dialog.component.html',
  styleUrls: ['./bulk-delete-dialog.component.scss'],
})
export class BulkDeleteDialogComponent {
  ordIds: number[];
  errors: string[] = [];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<BulkDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ordIds: number[] }
  ) {
    this.ordIds = data.ordIds;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  delete() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http
      .post<any>(
        `${Ams.Config.BASE_URL}/api/orderscommand/delete`,
        {
          ordIds: this.ordIds,
        },
        options
      )
      .subscribe({
        next: (data) => {
          console.log('3343434343434', data);
          gtag('event', 'orderList_bulkDelete', {
            event_category: 'orderList',
            event_label: 'bulkDelete',
            value: this.ordIds.length,
          });
          this.dialogRef.close(data);
        },
        error: (e) => {
          this.errors = e.error.errors;
        },
      });
  }
}

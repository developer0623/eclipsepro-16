import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { IJobItem, RebundleResult } from 'src/app/core/dto';
declare let gtag;

@Component({
  selector: 'app-combine-to-new-bundles-dialog',
  templateUrl: './combine-to-new-bundles-dialog.component.html',
  styleUrls: ['./combine-to-new-bundles-dialog.component.scss'],
})
export class CombineToNewBundlesDialogComponent {
  bundleGroupOptions = [
    { field: 'bundleGroup' },
    { field: 'pieceMark' },
    { field: 'itemUser1' },
    { field: 'itemUser2' },
    { field: 'itemUser3' },
    { field: 'itemUser4' },
    { field: 'itemUser5' },
    { field: 'none' },
  ];
  bundleGroupField: string = this.bundleGroupOptions[0].field;
  errors: string[] = [];
  ordId: number;
  items: IJobItem[];
  itemIds: number[];

  constructor(
    public dialogRef: MatDialogRef<CombineToNewBundlesDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      ordId: number;
      items: IJobItem[];
      itemIds: number[];
    }
  ) {
    this.ordId = data.ordId;
    this.itemIds = data.itemIds;
    this.items = data.items;
    let lsBundleGroupField = localStorage.getItem('order.bundleGroupField');
    if (lsBundleGroupField) {
      if (this.bundleGroupOptions.findIndex((o) => o.field === lsBundleGroupField) >= 0) {
        this.bundleGroupField = lsBundleGroupField;
      }
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
  save() {
    localStorage.setItem('order.bundleGroupField', this.bundleGroupField);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http
      .post<RebundleResult>(
        `${Ams.Config.BASE_URL}/api/ordercommand/rebundle/combineitems`,
        {
          ordId: this.ordId,
          items: this.items,
          itemIds: this.itemIds,
          targetBundle: -1, // means combine to new bundle
          bundleGroupField: this.bundleGroupField,
        },
        options
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          gtag('event', `orderDetail_rebundle_combineitems`, {
            event_category: 'orderDetail',
            event_label: 'rebundle/combineitems',
            value: this.itemIds.length,
          });
          this.dialogRef.close(data);
        },
        error: (e) => {
          this.errors = e.error.errors;
        },
      });
  }
}

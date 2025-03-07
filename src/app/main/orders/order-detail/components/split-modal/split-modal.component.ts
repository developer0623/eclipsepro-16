import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IJobItem, RebundleResult } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { setRebundleResultAction } from 'src/app/main/shared/services/store/order/actions';
declare let gtag;

@Component({
  selector: 'app-split-modal',
  templateUrl: './split-modal.component.html',
  styleUrls: ['./split-modal.component.scss'],
})
export class SplitModalComponent {
  ordId: number;
  items: IJobItem[];
  itemIds: number[];
  maxPieces: number;
  maxWeight: number;
  targetQty = 1;
  targetWeight = 10;
  targetItemCount = 2;
  moveQty = 1;
  errors: string[] = [];
  splitToNewBundles = false;
  splitItems = ['Max Pieces', 'Max Weight', 'Line Item Count', 'Move To New Item'];
  selectedSplitModel = this.splitItems[0];

  constructor(
    public dialogRef: MatDialogRef<SplitModalComponent>,
    private http: HttpClient,
    private store: Store,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      ordId: number;
      items: IJobItem[];
      itemIds: number[];
      maxPieces: number;
      maxWeight: number;
    }
  ) {
    this.splitToNewBundles = localStorage.getItem('order.splitToNewBundles') === 'true';
    this.selectedSplitModel = localStorage.getItem('order.splitModel') || this.splitItems[0];
    this.targetQty = data.maxPieces;
    this.targetWeight = data.maxWeight;
    this.ordId = data.ordId;
    this.itemIds = data.itemIds;
    this.items = data.items;
  }

  onChange(e) {
    localStorage.setItem('order.splitModel', this.selectedSplitModel);
  }

  cancel() {
    this.dialogRef.close(false);
  }
  save() {
    localStorage.setItem('order.splitToNewBundles', this.splitToNewBundles ? 'true' : 'false');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const tabToUrlMap = [
      'splititems/targetquantity',
      'splititems/targetweight',
      'splititems/targetitemcount',
      'splititems/onenewitem',
    ];
    const index = this.splitItems.findIndex((item) => item === this.selectedSplitModel);
    this.http
      .post<RebundleResult>(
        `${Ams.Config.BASE_URL}/api/ordercommand/rebundle/${tabToUrlMap[index]}`,
        {
          ordId: this.ordId,
          items: this.items,
          itemIds: this.itemIds,
          targetWeight: this.targetWeight,
          targetItemCount: this.targetItemCount,
          targetQty: this.targetQty,
          moveQty: this.moveQty,
          splitToNewBundles: this.splitToNewBundles,
        },
        options
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.store.dispatch(setRebundleResultAction({ rebundleResult: data }));
          gtag('event', `orderDetail_${tabToUrlMap[index].replace('/', '_')}`, {
            event_category: 'orderDetail',
            event_label: tabToUrlMap[index],
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

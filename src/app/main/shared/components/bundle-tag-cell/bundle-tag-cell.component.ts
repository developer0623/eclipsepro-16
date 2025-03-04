import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-bundle-tag-cell',
  templateUrl: './bundle-tag-cell.component.html',
  styleUrls: ['./bundle-tag-cell.component.scss'],
})
export class BundleTagCellComponent implements ICellRendererAngularComp {
  value = '';
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams) {
    this.value = params.value;
    return true;
  }

  printBundle() {
    this.http
      .post<string>(
        `${Ams.Config.BASE_URL}/_api/bundle/${this.value}/print`,
        {},
        { responseType: 'text' as 'json' }
      )
      .subscribe({
        next: (result: string) => {
          this._snackBar.open(result, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
          });
        },
        error: (e) => {
          this._snackBar.open('Print failed.\n' + e.error.error.message, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
          });
        },
      });
  }
}

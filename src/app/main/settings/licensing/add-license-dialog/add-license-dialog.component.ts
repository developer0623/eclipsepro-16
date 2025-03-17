import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-add-license-dialog',
  templateUrl: './add-license-dialog.component.html',
  styleUrls: ['./add-license-dialog.component.scss'],
})
export class AddLicenseDialogComponent {
  licenseText = '';
  licenseErrors = [];
  constructor(
    public dialogRef: MatDialogRef<AddLicenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string },
    private http: HttpClient
  ) {}

  cancel() {
    this.dialogRef.close(false);
  }

  add() {
    if (this.licenseText) {
      this.http.post(`${Ams.Config.BASE_URL}/api/license`, this.licenseText).subscribe({
        next: () => {
          this.dialogRef.close(false);
        },
        error: (result) => {
          // console.log('1111111', result);
          // this.licenseErrors = result.data;
        },
      });
    }
  }
}

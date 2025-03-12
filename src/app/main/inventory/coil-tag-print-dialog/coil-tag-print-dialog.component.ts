import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiErrorResult, ICoilDto, IPrintTemplate, IPrinterDetail } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-coil-tag-print-dialog',
  templateUrl: './coil-tag-print-dialog.component.html',
  styleUrls: ['./coil-tag-print-dialog.component.scss'],
})
export class CoilTagPrintDialogComponent {
  selectedCoilTag: string;
  selectedPrinter: string;
  errors: ApiErrorResult;
  coilTags: IPrintTemplate[] = [];
  printers: IPrinterDetail[] = [];
  coil: ICoilDto;
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<CoilTagPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      coilTags: IPrintTemplate[];
      printers: IPrinterDetail[];
      coil: ICoilDto;
    }
  ) {
    this.coilTags = data.coilTags;
    this.printers = data.printers || [];
    this.coil = data.coil;
    this.selectedPrinter = localStorage.getItem('lastUsedCoilTagPrinterName');
    this.selectedCoilTag = localStorage.getItem('lastUsedCoilTagName');
  }

  cancel() {
    this.dialogRef.close(false);
  }

  save() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post<string>(
        `${Ams.Config.BASE_URL}/_api/coil/${this.coil.coilId}/print`,
        {
          printerName: this.selectedPrinter,
          tagName: this.selectedCoilTag,
        },
        httpOptions
      )
      .subscribe({
        next: (data) => {
          localStorage.setItem('lastUsedCoilTagPrinterName', this.selectedPrinter);
          localStorage.setItem('lastUsedCoilTagName', this.selectedCoilTag);
          this.dialogRef.close(data);
        },
        error: (e) => {
          this.errors = e.error;
        },
      });
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialUsageGroup } from '../../../report-type';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
})
export class PrintDialogComponent {
  sizes = [
    { id: 0, size: '8.5 x 11' },
    { id: 1, size: '11 x 17' },
  ];
  selectedSize = 0;
  printStyles = [
    { id: 0, value: "Don't Include" },
    { id: 1, value: 'Side, On Next Page' },
    { id: 2, value: 'Stacked' },
  ];
  selectedStyle = 0;
  nextPage = 0;
  data: MaterialUsageGroup[] = [];
  duration = '';
  startDate: moment.Moment;
  endDate: moment.Moment;
  shift: string;
  factoryName: string;

  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public pData: {
      duration: string;
      startDate: moment.Moment;
      endDate: moment.Moment;
      shift: string;
      factoryName: string;
      data;
    }
  ) {
    this.data = pData.data;
    this.duration = pData.duration;
    this.startDate = pData.startDate;
    this.endDate = pData.endDate;
    this.shift = pData.shift;
    this.factoryName = pData.factoryName;
  }

  setPageSize() {
    let style = document.createElement('style');
    if (!this.selectedSize) {
      style.innerHTML = '@page {size: 8.5in 11in}';
    } else {
      style.innerHTML = '@page {size: 11in 17in}';
    }
    document.head.appendChild(style);
  }

  change() {
    this.nextPage = 0;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  print() {
    if (this.selectedStyle === 0 && !this.nextPage) {
      this.nextPage = 1;
    } else {
      this.setPageSize();
      let printContents = document.getElementById('main-print-body').innerHTML;
      let mainComp = document.getElementById('print-body');
      mainComp.innerHTML = printContents;
      window.print();
      mainComp.innerHTML = '';
    }
  }
}

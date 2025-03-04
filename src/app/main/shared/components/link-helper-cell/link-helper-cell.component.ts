import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface LinkHelperRendererParams extends ICellRendererParams {
  docType: string;
  hideType: boolean;
  docId: string;
  isPattern?: boolean;
  isOrder?: boolean;
}

@Component({
  selector: 'app-link-helper-cell',
  templateUrl: './link-helper-cell.component.html',
  styleUrls: ['./link-helper-cell.component.scss'],
})
export class LinkHelperCellComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  displayValue = '';
  isPattern = false;
  documentId = '';
  hideType = false;
  labelTxt = '';

  agInit(params: LinkHelperRendererParams): void {
    this.hideType = params.hideType;
    this.labelTxt = params.value;
    if (params.data && (params.data.eventTitle === 'log' || params.data.eventTitle === 'error')) {
      this.displayValue = params.data.eventMessage;
    } else if (params.data && params.data.eventTitle === 'setupsChange') {
      this.documentId = `setupsChange/${params.data.machineNumber}/${params.data.id}`;
      this.labelTxt = params.data.eventMessage;
    } else if (params.docType === 'PunchPattern') {
      this.documentId = params.data.patternId;
    } else if (params.docType === 'JobDetail') {
      this.documentId = `${params.docType}/${params.data.ordId}`;
    } else {
      this.documentId = `${params.docType}/${params.value}`;
    }
  }

  refresh(params: LinkHelperRendererParams) {
    // set value into cell again
    // this.cellValue = this.getValueToDisplay(params);
    return true;
  }
}

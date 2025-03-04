import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-integration-action-cell',
  templateUrl: './integration-action-cell.component.html',
  styleUrls: ['./integration-action-cell.component.scss'],
})
export class IntegrationActionCellComponent {
  //value = '';
  params: ICellRendererParams;
  complete = false;
  constructor(private http: HttpClient) {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.complete = params.data.complete;
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    this.complete = params.data.complete;
    return true;
  }

  triggerExport() {
    this.http
      .post(
        `${Ams.Config.BASE_URL}/_api/integration/retryExportAction?item=${this.params.data.documentID}`,
        {}
      )
      .subscribe(() => {});
  }

  cancelExport() {
    this.http
      .post(
        `${Ams.Config.BASE_URL}/_api/integration/cancelExportAction?id=${this.params.data.documentID}`,
        {}
      )
      .subscribe(() => {});
  }
}

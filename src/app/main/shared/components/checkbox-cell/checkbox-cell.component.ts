import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrls: ['./checkbox-cell.component.scss'],
})
export class CheckboxCellComponent implements ICellRendererAngularComp {
  isChecked = false;
  agInit(params: ICellRendererParams): void {
    this.isChecked = params.value;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }
}

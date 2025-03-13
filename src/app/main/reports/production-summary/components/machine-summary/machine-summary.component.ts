import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialUsageGroup } from '../../../report-type';
import { IProductionSummaryReportRecord } from 'src/app/core/dto';
import { MachineSummaryDialogComponent } from '../machine-summary-dialog/machine-summary-dialog.component';

@Component({
  selector: 'app-machine-summary',
  templateUrl: './machine-summary.component.html',
  styleUrls: ['./machine-summary.component.scss'],
})
export class MachineSummaryComponent {
  @Input() machine: string = '';
  @Input() data;
  constructor(public dialog: MatDialog) {}

  showPopover(ev, data, state) {
    const dialogRef = this.dialog.open(MachineSummaryDialogComponent, {
      maxWidth: '100vw',
      data: {
        data: data,
        state: state,
        machine: this.machine,
      },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}

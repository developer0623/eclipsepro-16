import { Component, Inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Ams } from 'src/app/amsconfig';
import { IMachineSetupHistoryItem, IMachineSetupParam } from 'src/app/core/dto';
import { SetUpUrl } from '../url-constant';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss'],
})
export class HistoryDialogComponent {
  @ViewChild(MatSort) sort: MatSort;
  machineId: string;
  setupId: string;
  setupParam: IMachineSetupParam;
  displayedColumns = ['date', 'setupValue'];
  dataSource: MatTableDataSource<IMachineSetupHistoryItem>;
  constructor(
    private http: HttpClient,
    private _liveAnnouncer: LiveAnnouncer,
    public dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { machineId; setupId; setupParam }
  ) {
    this.machineId = data.machineId;
    this.setupId = data.setupId;
    this.setupParam = data.setupParam;

    this.http
      .get<IMachineSetupHistoryItem[]>(
        Ams.Config.BASE_URL +
          `/_api/machine/${this.machineId}/${SetUpUrl}/.history/${this.setupParam.paramId}?setupId=${this.setupId}`
      )
      .subscribe((list) => {
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.sort = this.sort;
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}

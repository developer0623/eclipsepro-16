import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { AddCodeDialogComponent } from '../add-code-dialog/add-code-dialog.component';
import { CodeConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

export interface PeriodicElement {
  code: number;
  description: string;
  exempt: boolean;
  group: string;
  responsibility: string;
  workGroup: string;
  category: string;
}

@Component({
  selector: 'app-delay-code',
  templateUrl: './delay-code.component.html',
  styleUrls: ['./delay-code.component.scss'],
})
export class DelayCodeComponent {
  downtimeCodes = [];
  sortedCodes = [];
  downtimeCodeCategories = [];
  respTypes = ['NotSpecified', 'Operational', 'Equipment', 'External'];
  avaCodes = [];
  workGroups = [];
  groups = [];
  alerts: string[] = [];

  constructor(private _snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.http.get(Ams.Config.BASE_URL + '/api/settings/delay').subscribe((data: any) => {
      console.log('3333downtime', data);
      this.downtimeCodes = data.filter((item) => !item.historic);
      this.sortData({ active: 'code', direction: 'asc' });
      this.onGetAvacodes();
    });

    this.http.get(Ams.Config.BASE_URL + '/api/settings/delaycategories').subscribe((data: any) => {
      console.log('downtimeCodeCategories', data);
      this.downtimeCodeCategories = data;
    });
    this.http.get(Ams.Config.BASE_URL + '/api/settings/workgroups').subscribe((data: any) => {
      console.log('workgroups', data);
      this.workGroups = data;
    });
    this.http.get(Ams.Config.BASE_URL + '/api/settings/delay/groups').subscribe((data: any) => {
      console.log('groups', data);
      this.groups = data;
    });
    this.updateAlerts();
  }

  private updateAlerts() {
    this.http
      .get(Ams.Config.BASE_URL + '/api/settings/delay/alerts')
      .subscribe((data: string[]) => {
        this.alerts = data;
      });
  }

  updateDowntimeCode(code, index, codeKey, val) {
    if (val === code[codeKey]) return;
    const oldCode = { ...code };
    code[codeKey] = val;

    const newCode = {
      ...code,
      updatehistory: true,
    };
    this.http.put(Ams.Config.BASE_URL + '/api/settings/delay', newCode).subscribe({
      next: (data) => {
        console.log('downtimeCodeCategories put', data);
        this.onGetAvacodes();
      },
      error: (error) => {
        console.log('1111111', error);
        this.sortedCodes[index] = oldCode;
        this.onShowError(error);
      },
    });
  }

  deleteCode(id, index) {
    this.http.delete(`${Ams.Config.BASE_URL}/api/settings/delay?id=${id}`).subscribe({
      next: () => {
        this.sortedCodes = this.sortedCodes.filter((item) => item.id !== id);
        this.onGetAvacodes();
      },
      error: (error) => {
        console.log('1111111', error);
        this.onShowError(error);
      },
    });
  }

  addCode() {
    const dialogRef = this.dialog.open(AddCodeDialogComponent, {
      width: '400px',
      data: {
        categories: this.downtimeCodeCategories,
        avaCodes: this.avaCodes,
        groups: this.groups,
        workGroups: this.workGroups,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.http.put(Ams.Config.BASE_URL + '/api/settings/delay/new', result).subscribe({
          next: (data) => {
            console.log('downtimeCode new', data);
            this.sortedCodes = [...this.sortedCodes, data];
            this.onGetAvacodes();
          },
          error: (error) => {
            console.log('1111111', error);
            this.onShowError(error);
          },
        });
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  editCode(dc, i) {
    if (dc.loggedProduction > 0) {
      const dialogRef = this.dialog.open(CodeConfirmDialogComponent, {
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'update') {
          this.onUpdateCode(dc, i);
        } else if (result === 'add') {
          this.addCode();
        } else {
          console.log('Bundler rule delete action canceled');
        }
      });
    } else {
      this.onUpdateCode(dc, i);
    }
  }

  onUpdateCode(dc, i) {
    const dialogRef = this.dialog.open(AddCodeDialogComponent, {
      width: '400px',
      data: {
        categories: this.downtimeCodeCategories,
        avaCodes: this.avaCodes,
        groups: this.groups,
        workGroups: this.workGroups,
        code: dc,
        isEdit: true,
      },
      autoFocus: false,
    });

    const url =
      dc.loggedProduction > 0
        ? `${Ams.Config.BASE_URL}/api/settings/delay?rewriteHistory=true`
        : `${Ams.Config.BASE_URL}/api/settings/delay`;

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.http.put(url, result).subscribe({
          next: (data) => {
            console.log('downtimeCode new', data);
            this.sortedCodes[i] = data;
            this.onGetAvacodes();
          },
          error: (error) => {
            console.log('1111111', error);
            this.onShowError(error);
          },
        });
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  onGetAvacodes() {
    const codes = this.sortedCodes.map((item) => item.code);
    this.avaCodes = [];
    for (let i = 1; i < 100; i++) {
      if (codes.indexOf(i) < 0) {
        this.avaCodes.push(i);
      }
    }
  }

  sortData(sort: Sort) {
    const data = this.downtimeCodes.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedCodes = data;
      return;
    }

    this.sortedCodes = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  onShowError(error) {
    const errorTxt = error.error
      ? error.error.errors.reduce((x, y) => x + ' ' + y)
      : 'Failed. Please try again.';
    this._snackBar.open(errorTxt, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

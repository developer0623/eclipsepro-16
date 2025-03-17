import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { MatDialog } from '@angular/material/dialog';
import { AddCodeDialogComponent } from '../add-code-dialog/add-code-dialog.component';
import { CodeConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-scrap-code',
  templateUrl: './scrap-code.component.html',
  styleUrls: ['./scrap-code.component.scss'],
})
export class ScrapCodeComponent {
  scrapCodes = [];
  sortedCodes = [];
  scrapCodesCategories = [];
  respTypes = ['NotSpecified', 'Operational', 'Equipment', 'External'];
  avaCodes = [];
  workGroups = [];
  groups = [];
  alerts: string[] = [];
  currentSort: Sort = { active: 'code', direction: 'asc' };

  constructor(private _snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog) {
    this.http.get(Ams.Config.BASE_URL + '/api/settings/scrap').subscribe((data: any) => {
      this.scrapCodes = data.filter((item) => !item.historic);
      this.sortData(this.currentSort);
      this.onGetAvacodes();
    });

    this.http.get(Ams.Config.BASE_URL + '/api/settings/scrapcategories').subscribe((data: any) => {
      this.scrapCodesCategories = data;
    });
    this.http.get(Ams.Config.BASE_URL + '/api/settings/workgroups').subscribe((data: any) => {
      this.workGroups = data;
    });
    this.http.get(Ams.Config.BASE_URL + '/api/settings/scrap/groups').subscribe((data: any) => {
      this.groups = data;
    });
    this.updateAlerts();
  }

  private updateAlerts() {
    this.http
      .get(Ams.Config.BASE_URL + '/api/settings/scrap/alerts')
      .subscribe((data: string[]) => {
        this.alerts = data;
      });
  }

  updateScrapCode(code, index, codeKey, val) {
    if (val === code[codeKey]) return;
    const oldCode = { ...code };
    code[codeKey] = val;

    const newCode = {
      ...code,
      updatehistory: true,
    };
    this.http.put(Ams.Config.BASE_URL + '/api/settings/scrap', newCode).subscribe({
      next: (data) => {
        this.sortData(this.currentSort);
        this.onGetAvacodes();
      },
      error: (error) => {
        this.scrapCodes[index] = oldCode;
        this.onShowError(error);
      },
    });
  }

  deleteCode(id, index) {
    this.http.delete(`${Ams.Config.BASE_URL}/api/settings/scrap?id=${id}`).subscribe({
      next: () => {
        this.scrapCodes = this.scrapCodes.filter((item) => item.id !== id);
        this.sortData(this.currentSort);
        this.onGetAvacodes();
      },
      error: (error) => {
        this.onShowError(error);
      },
    });
  }

  addCode() {
    const dialogRef = this.dialog.open(AddCodeDialogComponent, {
      width: '400px',
      data: {
        categories: this.scrapCodesCategories,
        avaCodes: this.avaCodes,
        groups: this.groups,
        workGroups: this.workGroups,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.http.put(Ams.Config.BASE_URL + '/api/settings/scrap/new', result).subscribe({
          next: (data) => {
            this.scrapCodes = [...this.scrapCodes, data];
            this.sortData(this.currentSort);
            this.onGetAvacodes();
          },
          error: (error) => {
            this.onShowError(error);
          },
        });
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
        categories: this.scrapCodesCategories,
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
        ? `${Ams.Config.BASE_URL}/api/settings/scrap?rewriteHistory=true`
        : `${Ams.Config.BASE_URL}/api/settings/scrap`;

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.http.put(url, result).subscribe({
          next: (data) => {
            this.sortedCodes[i] = data;
            this.onGetAvacodes();
          },
          error: (error) => {
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
    this.currentSort = sort;

    const data = this.scrapCodes.slice();
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

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { orderBy } from 'lodash';
import { Ams } from 'src/app/amsconfig';
import { IPerformanceData, IfpmPlan } from 'src/app/core/dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PerformanceDataService {
  data: IPerformanceData[];
  status: Array<boolean> = [];
  previousIndex: number;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  refreshData() {
    // This really shouldn't be a (long lived) service. But since it is,
    // this method is easier than the proper refactoring.
    let machineSortBy =
      localStorage.getItem('machineSort') === 'machine.description'
        ? 'description'
        : 'machineNumber';
    this.http
      .get<IPerformanceData[]>(Ams.Config.BASE_URL + '/_api/machinePerformanceStandards')
      .subscribe((data) => {
        this.data = orderBy(data, machineSortBy).map((item) => ({
          ...item,
          toolings: orderBy(item.toolings, 'toolingCode'),
        }));
        if (this.status.length === 0) {
          this.status = new Array(data.length).fill(false);
        }
      });
  }

  changeStatus(index: number) {
    if (index === this.previousIndex) {
      this.status[index] = false;
      this.previousIndex = null;
    } else if (index !== this.previousIndex && this.previousIndex !== null) {
      this.status[index] = true;
      this.status[this.previousIndex] = false;
      this.previousIndex = index;
    } else {
      this.status[index] = true;

      this.previousIndex = index;
    }
  }

  getStatus(index: number) {
    return this.status[index];
  }

  getCount(index: number) {
    let count = { unChecked: 0, total: this.data[index].toolings.length };
    this.data[index].toolings.map((tool) => {
      if (!tool.overrideMachine) {
        count.unChecked++;
      }
    });
    return count;
  }

  getParent(index: number) {
    return this.data[index].default;
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  updateValue(data: {
    machineNumber: number;
    toolingId: number;
    field: string;
    value: string | boolean | number | IfpmPlan[];
  }) {
    // todo: limit roles: [`tooling-editor`, `administrator`]

    this.http.post(Ams.Config.BASE_URL + '/_api/machinePerformanceStandards', data).subscribe({
      next: (_) => this.toast(`Change accepted.`),
      error: (ex: any) => {
        const msg =
          ex.status === 400
            ? ex.error.errors.join('\n')
            : `Most likely your Agent service is not running. [${ex.statusText}]`;

        return this.toast(`Error: Performance change was not saved. ${msg}`);
      },
    });
  }
}

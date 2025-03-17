import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { IWorkgroup } from '../types';
import { MatDialog } from '@angular/material/dialog';
import { EditWorkgroupComponent } from './edit-workgroup/edit-workgroup.component';
import { ApiErrorResult } from 'src/app/core/dto';

@Component({
  selector: 'app-workgroups',
  templateUrl: './workgroups.component.html',
  styleUrls: ['./workgroups.component.scss'],
})
export class WorkgroupsComponent {
  workgroups: IWorkgroup[] = [];

  constructor(private _snackBar: MatSnackBar, private http: HttpClient, private dialog: MatDialog) {
    this.http
      .get<IWorkgroup[]>(Ams.Config.BASE_URL + '/api/settings/workgroups')
      .subscribe((data: any) => {
        this.workgroups = data;
      });
  }

  private doErrorsToast(error: ApiErrorResult) {
    this._snackBar.open(
      error.errors.reduce((x, y) => x + ' ' + y),
      '',
      {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      }
    );
  }

  editWorkgroup(workgroup) {
    const newCode = { workgroup: { ...workgroup } };
    console.log(newCode);

    this.dialog
      .open(EditWorkgroupComponent, { width: '400px', data: newCode, autoFocus: false })
      .afterClosed()
      .subscribe((updatedWorkgroup) => {
        if (updatedWorkgroup) {
          console.log('Saving', updatedWorkgroup);

          this.http
            .put<IWorkgroup>(Ams.Config.BASE_URL + '/api/settings/workgroups', updatedWorkgroup)
            .subscribe({
              next: (updated) => {
                this.workgroups = this.workgroups.map((w) => (w.id !== updated.id ? w : updated));
              },
              error: (error) => {
                this.doErrorsToast(error.error);
              },
            });
        }
      });
  }

  newWorkgroup() {
    var newWorkgroup = { description: 'New Workgroup', code: 'AA' };

    this.dialog
      .open(EditWorkgroupComponent, {
        width: '400px',
        data: { workgroup: newWorkgroup },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((updatedWorkgroup) => {
        if (updatedWorkgroup) {
          console.log('Saving', updatedWorkgroup);

          this.http
            .put<IWorkgroup>(Ams.Config.BASE_URL + '/api/settings/workgroups/new', updatedWorkgroup)
            .subscribe({
              next: (updated) => {
                this.workgroups.push(updated);
              },
              error: (error) => {
                this.doErrorsToast(error.error);
              },
            });
        }
      });
  }

  deleteWorkgroup(workgroup) {
    this.http
      .delete(Ams.Config.BASE_URL + '/api/settings/workgroups?id=' + workgroup.id)
      .subscribe({
        next: () => {
          this.workgroups = this.workgroups.filter((x) => x.id !== workgroup.id);
        },
      });
  }
}

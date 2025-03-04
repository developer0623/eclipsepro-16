import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import rg4js from 'raygun4js';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IPathfinderMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { UserHasRoles } from '../../services/store/user/selector';
import { ClientDataStore } from '../../services/clientData.store';
import { putAction } from '../../services/clientData.actions';
import { selectFolders } from '../../services/store/user/selector';

@Component({
  selector: 'app-folders-grid',
  templateUrl: './folders-grid.component.html',
  styleUrls: ['./folders-grid.component.scss'],
})
export class FoldersGridComponent implements OnDestroy {
  pathfinders: IPathfinderMachine[] = [];
  oldPathfinders: IPathfinderMachine[] = [];
  userHasAdminRole = false;
  subscriptions_: Subscription[] = [];
  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private store: Store) {
    this.subscriptions_ = [
      this.store.select(selectFolders).subscribe((folders) => {
        console.log(folders);
        this.pathfinders = _.cloneDeep(folders);
        this.oldPathfinders = _.cloneDeep(folders);
      }),

      this.store
        .select(UserHasRoles(['administrator', 'machine-manager'], false))
        .subscribe((userHasAdminRole) => {
          this.userHasAdminRole = userHasAdminRole;
        }),
    ];
  }

  acceptFolder(folder: IPathfinderMachine) {
    if (!this.userHasAdminRole) {
      this.toast('You do not have permission to change this setting');
      return;
    }
    this.http
      .post<IPathfinderMachine[]>(`${Ams.Config.BASE_URL}/_api/folders/${folder.id}/accept`, {})
      .subscribe({
        next: (response) => {
          this.store.dispatch(putAction({ collection: 'Folders', payload: response }));
        },
        error: (e) => {
          this.errorHandler(e);
        },
      });
  }
  saveFolderNameChange(folder: IPathfinderMachine, newname: string, index: number) {
    if (!this.userHasAdminRole) {
      this.toast('You do not have permission to change this setting');
      return;
    }

    this.http
      .patch<IPathfinderMachine[]>(`${Ams.Config.BASE_URL}/_api/folders/${folder.id}`, {
        name: newname,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(putAction({ collection: 'Folders', payload: response }));
        },
        error: (e) => {
          this.errorHandler(e);
          this.pathfinders[index] = { ...this.oldPathfinders[index] };
        },
      });
  }

  errorHandler(e) {
    let errorTxt = '';
    if (e.status === 400) {
      errorTxt = e.error.errors.reduce((x, y) => x + ' ' + y);
    } else {
      errorTxt = 'Unable to save. Contact AMS Support';
      rg4js('folders-error', e);
    }

    this.toast(errorTxt);
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}

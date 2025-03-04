import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import rg4js from 'raygun4js';
import { IPathfinderMachine, IUser } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { UserHasRoles, selectUserListModel } from '../../services/store/user/selector';
import { ClientDataStore } from '../../services/clientData.store';
import { putAction } from '../../services/clientData.actions';

@Component({
  selector: 'app-pathfinder-users-grid',
  templateUrl: './pathfinder-users-grid.component.html',
  styleUrls: ['./pathfinder-users-grid.component.scss'],
})
export class PathfinderUsersGridComponent implements OnDestroy {
  users: IUser[] = [];
  pathfinders: IPathfinderMachine[] = [];
  pathfinderUserRolesMasterList: string[] = [];
  subscriptions_: Subscription[] = [];
  userHasAdminRole = false;

  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private store: Store
  ) {
    this.subscriptions_ = [
      this.clientDataStore.SelectUsers().subscribe(),
      this.clientDataStore.SelectAll('Folders').subscribe(),

      this.store.select(selectUserListModel).subscribe((model) => {
        this.users = model.users.filter((u) => u.roles.indexOf('pfpc') > -1);
        this.pathfinderUserRolesMasterList = model.PathfinderUserRolesMasterList;
        this.pathfinders = model.pathfinders;
      }),

      this.store
        .select(UserHasRoles(['administrator', 'machine-manager'], false))
        .subscribe((userHasAdminRole) => {
          this.userHasAdminRole = userHasAdminRole;
        }),
    ];
  }

  clickedUserRole(machine: IPathfinderMachine, user: IUser, role: string) {
    if (!this.userHasAdminRole) {
      this.toast('You do not have permission to change this setting');
      return;
    }
    this.http
      .post<IUser>(
        `${Ams.Config.BASE_URL}/_api/folders/${machine.id}/pfpcrole?role=${role}&user=${user.userName}`,
        {}
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(putAction({ collection: 'Users', payload: response }));
        },
        error: (e) => {
          this.errorHandler(e);
        },
      });
  }
  saveUserPin(user: IUser, pin: string) {
    if (!this.userHasAdminRole) {
      this.toast('You do not have permission to change this setting');
      return;
    }
    this.http
      .post<IUser>(`${Ams.Config.BASE_URL}/_api/users/${user.userName}/setpin?pin=${pin}`, {})
      .subscribe({
        next: (response) => {
          this.store.dispatch(putAction({ collection: 'Users', payload: response }));
        },
        error: (e) => {
          this.errorHandler(e);
        },
      });
  }

  errorHandler(e) {
    let errorTxt = '';
    if (e.status === 400) {
      errorTxt = e.error.errors.reduce((x, y) => x + ' ' + y);
    } else {
      errorTxt = 'Unable to save. Contact AMS Support';
      rg4js('pathfinder-users-error', e);
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

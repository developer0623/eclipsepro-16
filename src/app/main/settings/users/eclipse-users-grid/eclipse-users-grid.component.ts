import { Component, Inject } from '@angular/core';
import { IUser, ISystemPreferences } from 'src/app/core/dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserListModel } from 'src/app/main/shared/services/store/user/selector';

import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { ClientDataStore } from 'src/app/main/shared/services/clientData.store';
import { putAction } from 'src/app/main/shared/services/clientData.actions';

@Component({
  selector: 'eclipse-users-grid',
  templateUrl: './eclipse-users-grid.component.html',
  styleUrls: ['./eclipse-users-grid.component.scss'],
})
export class EclipseUsersGridComponent {
  loading = false;
  users: IUser[] = [];
  systemPreferences: ISystemPreferences;
  userIsAdmin: boolean;
  isEditing: boolean = false;
  subscriptions_: Subscription[] = [];

  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private store: Store
  ) {
    this.subscriptions_.push(clientDataStore.SelectUsers().subscribe());
    this.subscriptions_.push(
      this.store.select(selectUserListModel).subscribe((model) => {
        if (!this.isEditing) {
          this.users = model.users;
        }
        this.systemPreferences = model.systemPreferences;
        this.userIsAdmin = model.userIsAdmin;
      })
    );
  }
  onUserMenuOpen() {
    this.isEditing = true;
  }
  onUserMenuClose() {
    this.isEditing = false;
  }

  onUserUpdateSuccess(data) {
    this.store.dispatch(putAction({ collection: 'Users', payload: data }));
  }

  onUserUpdateError(e) {
    this._snackBar.open(e.error.errors.join(' '), '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  toggleRole(user: IUser, role: { roleName: string; enabled: boolean }) {
    if (role.enabled) {
      this.http
        .post<IUser>(
          `${Ams.Config.BASE_URL}/_api/users/${user.userName}/removerole?role=${role.roleName}`,
          {
            role: role.roleName,
          }
        )
        .subscribe({
          next: (data) => this.onUserUpdateSuccess(data),
          error: (error) => this.onUserUpdateError(error),
        });
    } else {
      this.http
        .post<IUser>(
          `${Ams.Config.BASE_URL}/_api/users/${user.userName}/addrole?role=${role.roleName}`,
          {
            role: role.roleName,
          }
        )
        .subscribe({
          next: (data) => this.onUserUpdateSuccess(data),
          error: (error) => this.onUserUpdateError(error),
        });
    }
  }
  onOpenResetModal(user: IUser) {
    const dialogRef = this.dialog.open(ResetPasswordModalComponent, {
      data: { user },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.isSuccess) {
        this._snackBar.open('Password reset successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions_.forEach((s) => s.unsubscribe());
  }
  setAllowGuestUser() {
    this.http
      .post(`${Ams.Config.BASE_URL}/api/systemPreferences`, {
        allowGuestUser: this.systemPreferences.allowGuestUser,
      })
      .subscribe();
  }
}

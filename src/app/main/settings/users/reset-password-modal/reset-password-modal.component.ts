import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss'],
})
export class ResetPasswordModalComponent {
  user = { password: '', passwordConfirm: '' };
  errors: string[] = [];
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ResetPasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user }
  ) {}
  reset() {
    this.errors = [];
    this.http
      .post<any>(`${Ams.Config.BASE_URL}/_api/users/${this.data.user.userName}/setpassword`, {
        username: this.data.user.userName,
        password: this.user.password,
        passwordConfirm: this.user.passwordConfirm,
      })
      .subscribe({
        next: () => this.dialogRef.close({ isSuccess: true }),
        error: (error) => (this.errors = error.error.errors),
      });
  }
  cancel() {
    this.dialogRef.close();
  }
  trackByIndex(index, err) {
    return index;
  }
}

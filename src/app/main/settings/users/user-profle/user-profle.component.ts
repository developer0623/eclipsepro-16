import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ams } from 'src/app/amsconfig';
import { IUser } from 'src/app/core/dto';
import { ClientDataStore } from 'src/app/main/shared/services/clientData.store';
import { selectUsers } from 'src/app/main/shared/services/store/user/selector';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profle.component.html',
  styleUrls: ['./user-profle.component.scss'],
})
export class UserProfleComponent {
  @Input() username: string;
  user: IUser = { firstName: '', lastName: '', email: '' } as IUser;
  subscriptions_: Subscription[] = [];

  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private store: Store
  ) {
    this.subscriptions_.push(
      this.clientDataStore.SelectUsers().subscribe(),
      this.store
        .select(selectUsers)
        .pipe(map((users) => users.find((u) => u.userName === this.username)))
        .subscribe((user) => {
          this.user = user;
        })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
  onSaveUserField(field: string, value: string) {
    this.http
      .patch(Ams.Config.BASE_URL + `/_api/users/${this.user.userName}?${field}=${value}`, {})
      .subscribe((res) => console.log(res));
  }
}

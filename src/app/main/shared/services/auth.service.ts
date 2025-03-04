import { Injectable } from '@angular/core';
import rg4js from 'raygun4js';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { IUserSession } from 'src/app/core/dto';
import { userAuthedSuccessfully } from './store/userSession/actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private store: Store) {}

  getSession() {
    this.http
      .get(`${Ams.Config.BASE_URL}/_api/user/session`)
      .subscribe((userSession: IUserSession) => {
        this.store.dispatch(userAuthedSuccessfully({ payload: userSession }));
        rg4js('setUser', {
          identifier: `${userSession.userName}@${userSession.serverId}`,
          isAnonymous: userSession.userName === 'guest',
          //email:
          //firstName: 'Firstname',
          //fullName: 'Firstname Lastname'
          //uuid:
        });

        return userSession;
      });
  }

  logout() {
    window.location.href = `${Ams.Config.BASE_URL}/auth/logout`;
  }
}

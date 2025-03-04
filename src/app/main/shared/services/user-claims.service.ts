import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IAppState } from './store/store.dto';
import { IUserSession } from 'src/app/core/dto';

const selectUserSession = (state: IAppState) => state.data.UserSession;

@Injectable({
  providedIn: 'root',
})
export class UserClaimsService {
  constructor(private store: Store) {}

  hasClaim(claims: string): Observable<boolean> {
    return this.store.select(selectUserSession).pipe(
      map((userSession) => {
        if (!userSession) {
          return false;
        }
        return claims.split(' ').some((claim) => userSession.claims.includes(claim));
      })
    );
  }
}

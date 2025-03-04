import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SAVEREBUNDLERESULT, saveRebundleSuccessfulAction } from './actions';
import { Store } from '@ngrx/store';
import { IAppState } from '../store.dto';
import { Ams } from 'src/app/amsconfig';
import { RebundleResult } from 'src/app/core/dto';

@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private store: Store<IAppState>
  ) {}

  processBundleSaveRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVEREBUNDLERESULT),
      mergeMap((action: { ordId: number; rebundleResult: RebundleResult }) =>
        this.http
          .post(
            `${Ams.Config.BASE_URL}/api/order/${action.ordId}/applyrebundle`,
            action.rebundleResult
          )
          .pipe(
            map(() => saveRebundleSuccessfulAction()), // Dispatch success action
            tap(() => {
              console.log('Rebundling changes saved');
              this.snackBar.open('Rebundling changes saved', 'Close', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
            }),
            catchError((error) => {
              console.error('Save rebundling error', error);
              this.snackBar.open(
                `Unable to save rebundling changes: ${
                  error.error?.errors?.join() || 'Unknown error'
                }`,
                'Close',
                {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                }
              );
              return of(); // Return an empty observable to prevent breaking the stream
            })
          )
      )
    )
  );
}

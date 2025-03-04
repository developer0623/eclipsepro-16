import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { INIT_EXPLORER_DATA, SET_EXPLORER_DATA_CURRENT_RANGE } from './actions';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable()
export class ExplorerEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);

  // Effect to load explorer data
  loadExplorerData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(INIT_EXPLORER_DATA, SET_EXPLORER_DATA_CURRENT_RANGE),
        tap((action: any) => {
          this.apiService.fetchExploreData({
            skip: 0,
            take: 1000,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
          });
        })
      ),
    { dispatch: false }
  );

  loadAvailableRange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(INIT_EXPLORER_DATA),
        tap((action: any) => {
          this.apiService.fetchExploreAvailableRange();
        })
      ),
    { dispatch: false }
  );
}

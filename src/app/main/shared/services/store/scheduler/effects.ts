import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import {
  map,
  exhaustMap,
  catchError,
  withLatestFrom,
  switchMap,
  merge,
  mergeMap,
  tap,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import {
  LOAD_SCHEDULER_COLUMNS,
  INIT_ASSIGNED_COLUMNS,
  INIT_AVAILABLE_COLUMNS,
  TOGGLE_AVAILABLE_COLUMN,
  REORDER_AVAILABLE_COLUMN,
  RESET_AVAILABLE_COLUMNS,
  CHANGE_WIDTH_AVAILABLE_COLUMN,
  TOGGLE_SCHEDULED_COLUMN,
  REORDER_SCHEDULED_COLUMN,
  RESET_SCHEDULED_COLUMNS,
  CHANGE_WIDTH_SCHEDULED_COLUMN,
  SCHEDULE_JOB_ACTION,
  UNSCHEDULE_JOB_ACTION,
  unscheduleJobAction,
} from './actions';

import { selectAvailableJobColumns, selectScheduledJobColumns } from './selectors';
import { putAction } from '../../clientData.actions';

import { ApiService } from '../../api.service';

declare let gtag;

@Injectable()
export class SchedulerEffects {
  constructor(private actions$: Actions, private store: Store, private apiService: ApiService) {}

  loadAvaColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_SCHEDULER_COLUMNS),
      exhaustMap(() =>
        this.apiService.fetchColumns('AvailableJobColumns', { skip: 0, take: 1000 }).pipe(
          map((columns) => ({ type: INIT_AVAILABLE_COLUMNS, columns })),
          catchError(() => EMPTY)
        )
      )
    );
  });

  loadSchColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_SCHEDULER_COLUMNS),
      exhaustMap(() =>
        this.apiService.fetchColumns('ScheduledJobColumns', { skip: 0, take: 1000 }).pipe(
          map((columns) => ({ type: INIT_ASSIGNED_COLUMNS, columns })),
          catchError(() => EMPTY)
        )
      )
    );
  });

  postAvailableColumnSelectionToTheServer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TOGGLE_AVAILABLE_COLUMN,
          REORDER_AVAILABLE_COLUMN,
          RESET_AVAILABLE_COLUMNS,
          CHANGE_WIDTH_AVAILABLE_COLUMN
        ),
        withLatestFrom(this.store.pipe(select(selectAvailableJobColumns))),
        switchMap(([, columns]) =>
          this.apiService.updateColumns('AvailableJobColumns', columns).pipe(
            map((columns) => EMPTY),
            catchError(() => EMPTY)
          )
        )
      ),
    { dispatch: false }
  );

  postScheduledColumnSelectionToTheServer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TOGGLE_SCHEDULED_COLUMN,
          REORDER_SCHEDULED_COLUMN,
          RESET_SCHEDULED_COLUMNS,
          CHANGE_WIDTH_SCHEDULED_COLUMN
        ),
        withLatestFrom(this.store.pipe(select(selectScheduledJobColumns))),
        switchMap(([, columns]) =>
          this.apiService.updateColumns('ScheduledJobColumns', columns).pipe(
            map((columns) => EMPTY),
            catchError(() => EMPTY)
          )
        )
      ),
    { dispatch: false }
  );

  scheduleJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SCHEDULE_JOB_ACTION),
        tap((action: { payload: any }) => {
          gtag('event', 'scheduler_scheduleJob', {
            event_catetory: 'scheduler',
            event_label: action.payload.isOnMachine ? 'toMachine' : 'toSchedule',
            value: action.payload.jobIds.length,
          });
          this.apiService.updateScheduleJobs(action.payload).pipe(
            tap((schedules) => {
              schedules.forEach((s) =>
                this.store.dispatch(putAction({ collection: 'MachineSchedule', payload: s }))
              );
              // this.toast.show('Schedule change accepted');
            }),
            catchError((ex) => {
              const msg =
                ex.status === 400
                  ? ex.data.errors.join('\n')
                  : `Most likely your Agent service is not running. [${ex.statusText}]`;

              // this.toast.show(`Error: Schedule change was not saved. ${msg}`);
              return of(); // Prevent the effect from stopping
            })
          );
        })
      ),
    { dispatch: false }
  );

  unScheduleJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UNSCHEDULE_JOB_ACTION),
        mergeMap((action: { payload: any }) => {
          // Google Analytics tracking
          gtag('event', 'scheduler_unScheduleJob', {
            event_category: 'scheduler',
            value: action.payload.scheduledJobIds.length,
          });

          return this.apiService.removeScheduleJobs(action.payload).pipe(
            map((schedules) =>
              schedules.map((s) => putAction({ collection: 'MachineSchedule', payload: s }))
            ),
            tap((actions) => {
              actions.forEach((a) => this.store.dispatch(a));
            }),
            catchError((error) => {
              const msg =
                error.status === 400
                  ? error.error.errors.join('\n')
                  : `Most likely your Agent service is not running. [${error.statusText}]`;
              console.error(`Error: Schedule change was not saved. ${msg}`);
              return of(); // Ensure observable completes
            })
          );
        })
      ),
    { dispatch: false } // Ensures no implicit action dispatch
  );
}

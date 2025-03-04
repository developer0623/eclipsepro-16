import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { ADD_SUBSCRIPTION, DEL_SUBSCRIPTION } from './store/subscriptions/actions';
import { selectSubscriptions } from './store/subscriptions/selectors';
import { RESET, chopAction } from './clientData.actions';
import { SubscriptionService } from '../services/subscription.service';
import { Fx } from 'src/app/core/dto';
import { ApiService } from './api.service';

@Injectable()
export class ClientDataEffects {
  constructor(
    private actions$: Actions,
    private subscriptionService: SubscriptionService,
    private store: Store,
    private apiService: ApiService
  ) {}

  addServerSubscription$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ADD_SUBSCRIPTION),
        tap((action: { payload: Fx.Subscription }) => {
          this.subscriptionService.addSubscription(action.payload);
        })
      ),
    { dispatch: false }
  );

  resetStore$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RESET),
        tap(() => {
          console.log('resetstore');
        })
      ),
    { dispatch: false }
  );

  initiallyLoadSubscription$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ADD_SUBSCRIPTION),
        withLatestFrom(this.store.select(selectSubscriptions)),
        map(
          ([newsubAction, currentSubs]: [
            newsubAction: { payload: Fx.Subscription },
            currentSubs: Fx.Subscription[]
          ]) => ({
            newsub: newsubAction.payload,
            currentSubs,
          })
        ),
        filter(
          ({ newsub, currentSubs }) =>
            !currentSubs.some(
              (s) =>
                s.collection === newsub.collection &&
                s.filterDef.type === Fx.ALL &&
                s.id !== newsub.id
            )
        ),
        tap(({ newsub }) => {
          const apiName = this.apiService.collectionApiMap[newsub.collection];
          if (!apiName) {
            console.error(`No initializer url for collection '${newsub.collection}'`);
            return;
          }
          this.apiService.preLoad<any>(newsub.collection, newsub.filterDef);
        })
      ),
    { dispatch: false }
  );

  deleteServerSubscription$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DEL_SUBSCRIPTION),
        tap((action: { payload: Fx.Subscription }) => {
          this.subscriptionService.deleteSubscription(action.payload);
        })
      ),
    { dispatch: false }
  );

  chopStoreCollection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DEL_SUBSCRIPTION), // Listen for DEL_SUBSCRIPTION action
        withLatestFrom(
          this.store.select(selectSubscriptions) // Select subscriptions from state
        ),
        map(([action, currentSubs]: [{ payload: Fx.Subscription }, Fx.Subscription[]]) => {
          const deletedSub = action.payload;

          const chopSubs = currentSubs
            .filter((s) => s.collection === deletedSub.collection)
            .filter((s) => s.id !== deletedSub.id);

          return this.store.dispatch(
            chopAction({ collection: deletedSub.collection, payload: chopSubs })
          );
        })
      ),
    { dispatch: false }
  );
}

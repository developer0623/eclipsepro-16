import { createAction, props } from '@ngrx/store';
import { Fx } from 'src/app/core/dto';

export const ADD_SUBSCRIPTION = '[ADD_SUBSCRIPTION]';
export const DEL_SUBSCRIPTION = '[DEL_SUBSCRIPTION]';

export const addSubscriptionAction = createAction(
  ADD_SUBSCRIPTION,
  props<{ payload: Fx.Subscription }>()
);

export const delSubscriptionAction = createAction(
  DEL_SUBSCRIPTION,
  props<{ payload: Fx.Subscription }>()
);

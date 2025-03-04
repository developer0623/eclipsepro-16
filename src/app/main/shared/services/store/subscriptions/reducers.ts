import { createReducer, on } from '@ngrx/store';
import { addSubscriptionAction, delSubscriptionAction } from './actions';
import { Fx } from 'src/app/core/dto';

const initialSubs: Fx.Subscription[] = [];

export const subscribtionsReducer = createReducer(
  initialSubs,

  on(addSubscriptionAction, (state, { payload }) => [...state, payload]),

  on(delSubscriptionAction, (state, { payload }) => state.filter((s) => s.id !== payload.id))
);

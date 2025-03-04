import { createReducer, on } from '@ngrx/store';
import { logoutAction, userAuthedSuccessfully } from './actions';
import { IUserSession } from 'src/app/core/dto';

const initialSeesions: IUserSession | null = null;

export const userSessionReducer = createReducer(
  initialSeesions,

  on(userAuthedSuccessfully, (state, { payload }) => ({
    ...payload,
  })),

  on(logoutAction, (state) => null)
);

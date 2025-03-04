import { createAction, props } from '@ngrx/store';
import { IUserSession } from 'src/app/core/dto';

export const USER_AUTHED_SUCCESSFULLY = '[USER_AUTHED_SUCCESSFULLY]';
export const LOGOUT = '[LOGOUT]';

export const logoutAction = createAction(LOGOUT);

export const userAuthedSuccessfully = createAction(
  USER_AUTHED_SUCCESSFULLY,
  props<{ payload: IUserSession }>()
);

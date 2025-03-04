import { createAction, props } from '@ngrx/store';
import { Fx } from 'src/app/core/dto';

export const PUT = '[PUT]';
export const DEL = '[DEL]';
export const INITIALIZE = '[INITIALIZE]';
export const CHOP = '[CHOP]';

export const RESET = '[RESET]';
export const FRESH_PRODUCTION_SUMMARY = '[FRESH_PRODUCTION_SUMMARY]';
export const USER_AUTHED_SUCCESSFULLY = '[USER_AUTHED_SUCCESSFULLY]';
export const UI_UPDATE_AVAILABLE = '[UI_UPDATE_AVAILABLE]';
export const USER_AUTHED_TRIED = '[USER_AUTHED_TRIED]';
export const LOGOUT = '[LOGOUT]';

export const putAction = createAction(PUT, props<{ collection: string; payload: any }>());

export const delAction = createAction(DEL, props<{ collection: string; id: string }>());

export const initializeAction = createAction(
  INITIALIZE,
  props<{ collection: string; payload: any | any[] }>()
);

export const chopAction = createAction(
  CHOP,
  props<{ collection: string; payload: Fx.Subscription[] }>()
);

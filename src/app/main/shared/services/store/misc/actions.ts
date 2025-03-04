import { createAction, props } from '@ngrx/store';
import { ISystemInfo } from 'src/app/core/dto';

export const SIGNALR_CONNECTED = '[SIGNALR_CONNECTED]';
export const SIGNALR_RECONNECTED = '[SIGNALR_RECONNECTED]';
export const SIGNALR_DISCONNECTED = '[SIGNALR_DISCONNECTED]';
export const SYSTEMINFO_INIT = '[SYSTEMINFO_INIT]';

export const signalrConnectedAction = createAction(SIGNALR_CONNECTED, props<{ payload: string }>());

export const signalrReconnectedAction = createAction(
  SIGNALR_RECONNECTED,
  props<{ payload: string }>()
);

export const signalrDisconnectedAction = createAction(SIGNALR_DISCONNECTED);

export const initSystemInfoAction = createAction(
  SYSTEMINFO_INIT,
  props<{ payload: ISystemInfo }>()
);

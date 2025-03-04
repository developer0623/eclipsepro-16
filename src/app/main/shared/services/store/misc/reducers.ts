import { createReducer, on } from '@ngrx/store';
import {
  signalrConnectedAction,
  signalrDisconnectedAction,
  signalrReconnectedAction,
  initSystemInfoAction,
} from './actions';
import { ISystemInfo } from 'src/app/core/dto';

const initialSystemInfo: ISystemInfo = {
  serverId: '',
  version: '',
  serverStartTime: null,
  isSignalRConnected: false,
  latestReleaseVersion: null,
  signalRConnectionId: '',
};

export const systemInfoReducer = createReducer(
  initialSystemInfo,

  on(signalrConnectedAction, (state, { payload }) => ({
    ...state,
    isSignalRConnected: true,
    signalRConnectionId: payload,
  })),

  on(signalrReconnectedAction, (state, { payload }) => ({
    ...state,
    isSignalRConnected: true,
    signalRConnectionId: payload,
  })),

  on(signalrDisconnectedAction, (state) => ({
    ...state,
    isSignalRConnected: false,
  })),

  on(initSystemInfoAction, (state, { payload }) => ({ ...state, ...payload }))
);

import { createAction, props } from '@ngrx/store';
import {
  IDeviceExplorerDataRecord,
  IDateRange,
  ICurrentDateRange,
} from '../productionexplorer/models';

export const ADD_DEVICE_EXPLORER_DATA = 'ADD_DEVICE_EXPLORER_DATA';
export const INIT_DEVICE_EXPLORER_DATA = 'INIT_DEVICE_EXPLORER_DATA';
export const SET_DEVICE_EXPLORER_AVAILABLE_DATE_RANGE = 'SET_DEVICE_EXPLORER_AVAILABLE_DATE_RANGE';
export const SET_DEVICE_EXPLORER_DATA_CURRENT_RANGE = 'SET_DEVICE_EXPLORER_DATA_CURRENT_RANGE';

export const addDeviceExplorerDataAction = createAction(
  ADD_DEVICE_EXPLORER_DATA,
  props<{ payload: IDeviceExplorerDataRecord[] }>()
);

export const setDeviceExplorerAvailableDateRangeAction = createAction(
  SET_DEVICE_EXPLORER_AVAILABLE_DATE_RANGE,
  props<{ payload: IDateRange }>()
);

export const initDeviceExplorerDataAction = createAction(
  INIT_DEVICE_EXPLORER_DATA,
  props<{ payload: ICurrentDateRange }>()
);

export const setDeviceExplorerDataCurrentRangeAction = createAction(
  SET_DEVICE_EXPLORER_DATA_CURRENT_RANGE,
  props<{ payload: ICurrentDateRange }>()
);

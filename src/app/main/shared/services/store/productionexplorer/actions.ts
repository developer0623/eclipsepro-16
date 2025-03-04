import { createAction, props } from '@ngrx/store';
import { IExplorerDataRecord, IDateRange, ICurrentDateRange } from './models';

export const ADD_EXPLORER_DATA = 'ADD_EXPLORER_DATA';
export const INIT_EXPLORER_DATA = 'INIT_EXPLORER_DATA';
export const SET_EXPLORER_AVAILABLE_DATE_RANGE = 'SET_EXPLORER_AVAILABLE_DATE_RANGE';
export const SET_EXPLORER_DATA_CURRENT_RANGE = 'SET_EXPLORER_DATA_CURRENT_RANGE';

export const addExplorerDataAction = createAction(
  ADD_EXPLORER_DATA,
  props<{ payload: IExplorerDataRecord[] }>()
);

export const setExplorerAvailableDateRangeAction = createAction(
  SET_EXPLORER_AVAILABLE_DATE_RANGE,
  props<{ payload: IDateRange }>()
);

export const initExplorerDataAction = createAction(
  INIT_EXPLORER_DATA,
  props<{ payload: ICurrentDateRange }>()
);

export const setExplorerDataCurrentRangeAction = createAction(
  SET_EXPLORER_DATA_CURRENT_RANGE,
  props<{ payload: ICurrentDateRange }>()
);

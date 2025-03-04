import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { IAppState } from '../store.dto';
import { HealthSummaryType, IHealth } from 'src/app/core/dto';

export const selectMachine = (state: IAppState) => state.data.collections.Machine;
export const selectExpressCtrlState = (state: IAppState) => state.data.collections.ExpressCtrlState;
export const selectExpressCommState = (state: IAppState) => state.data.collections.ExpressCommState;

export const selectExpressAll = createSelector(
  selectExpressCtrlState,
  selectExpressCommState,
  selectMachine,
  (ctrlStates, commState, machines) => ({ ctrlStates, commState, machines })
);

export const selectHealths = (state: IAppState) => state.data.collections.Health;

export const selectHealthSummary = createSelector(
  selectHealths,
  (healths: IHealth[]): HealthSummaryType[] =>
    Object.entries(
      healths.reduce((acc, h) => {
        acc[h.status] = (acc[h.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([status, count]) => ({ collection: status, count }))
);

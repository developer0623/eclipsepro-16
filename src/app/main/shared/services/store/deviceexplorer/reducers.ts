import { createReducer, on } from '@ngrx/store';
import { addDeviceExplorerDataAction, setDeviceExplorerAvailableDateRangeAction } from './actions';
import { IDeviceExplorerDataModel } from '../productionexplorer/models';

const initial: IDeviceExplorerDataModel = {
  explorerData: [],
  range: {
    // 30 days ago. This ugliness per https://stackoverflow.com/a/31665235/947
    minDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    maxDate: new Date(),
  },
};

export const deviceExplorerDataReducer = createReducer(
  initial,

  on(addDeviceExplorerDataAction, (state, { payload }) => {
    const by = (selector) => (e1, e2) => selector(e1) > selector(e2) ? -1 : 1;

    const concated = payload.concat(state.explorerData);

    let distincted = [];
    // Distinct by id
    const map = new Map();
    for (const item of concated) {
      if (!map.has(item.id)) {
        map.set(item.id, null);
        distincted.push(item);
      }
    }

    return {
      ...state,
      explorerData: distincted.sort(by((x) => x.date)),
    };
  }),

  on(setDeviceExplorerAvailableDateRangeAction, (state, { payload }) => ({
    ...state,
    range: payload,
  }))
);

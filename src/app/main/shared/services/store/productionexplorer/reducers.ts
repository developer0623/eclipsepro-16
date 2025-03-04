import { createReducer, on } from '@ngrx/store';
import { addExplorerDataAction, setExplorerAvailableDateRangeAction } from './actions';
import { IExplorerDataModel } from './models';

const initial: IExplorerDataModel = {
  explorerData: [],
  range: {
    // 30 days ago. This ugliness per https://stackoverflow.com/a/31665235/947
    minDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    maxDate: new Date(),
  },
};

export const productionExplorerDataReducer = createReducer(
  initial,

  on(addExplorerDataAction, (state, { payload }) => {
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

  on(setExplorerAvailableDateRangeAction, (state, { payload }) => ({ ...state, range: payload }))
);

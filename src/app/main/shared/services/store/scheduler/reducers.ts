import { createReducer, on, props } from '@ngrx/store';
import * as moment from 'moment';
import * as _ from 'lodash';

import {
  IAvailableJobColumn,
  IAvailableJob,
  ScheduledJobGridItem,
  IScheduledJobColumn,
  ScheduledJobColumnFieldName,
  RangeValue,
} from 'src/app/core/dto';

import { AvailableJobGridItem } from './selectors';

import * as schedulerActions from './actions';

const isDateString: (string: any) => boolean = (str) => !isNaN(Date.parse(str));

export const jobColor = 'rgb(186, 205, 113)';
export const materialColor = 'rgb(249, 181, 112)';
export const toolingColor = 'rgb(236, 212, 129)';

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const appendSummarizer = (jobs: AvailableJobGridItem[], column: IAvailableJobColumn) => {
  const set = jobs
    .map((job) => job[column.fieldName].toString())
    // TODO: Use [...new Set(...)] when we go to ES6 target
    .filter(onlyUnique);

  if (set.length === 1) return set[0];

  return set.reduce((acc, val) => acc + ', ' + val).substr(0, 15) + `... (${set.length} items)`;
};

export const appendSummarizer2 = (
  jobs: ScheduledJobGridItem[],
  column: { fieldName: ScheduledJobColumnFieldName }
) => {
  const set = jobs
    .map((job) => job[column.fieldName].toString())
    // TODO: Use [...new Set(...)] when we go to ES6 target
    .filter(onlyUnique);

  if (set.length === 1) return set[0];

  return set.reduce((acc, val) => acc + ', ' + val).substr(0, 15) + `... (${set.length} items)`;
};

const countSummarizer2 = (
  jobs: ScheduledJobGridItem[],
  column: { fieldName: ScheduledJobColumnFieldName },
  suffix = 'item'
) => {
  const set = jobs
    .map((job) => job[column.fieldName].toString())
    // TODO: Use [...new Set(...)] when we go to ES6 target
    .filter(onlyUnique);

  return `${set.length} ${suffix}` + (set.length > 1 ? 's' : '');
};
const rangeSummarizer = (filter?: (str: string) => boolean) => {
  const summarizer = (jobs: AvailableJobGridItem[], column: IAvailableJobColumn) => {
    if (jobs.length === 1) return jobs[0][column.fieldName].toString();

    const sortedCopy = jobs
      .map((x) => x[column.fieldName].toString())
      .filter((x) => filter === undefined || filter(x));

    sortedCopy.sort();

    if (sortedCopy.length > 1) return `${sortedCopy[0]} - ${sortedCopy[sortedCopy.length - 1]}`;
    else if (sortedCopy.length === 1) return `${sortedCopy[0]}`;
    else return '<none>';
  };

  return summarizer;
};
const rangeSummarizer2 = (filter?: (str: string) => boolean) => {
  function summarizer(
    jobs: ScheduledJobGridItem[],
    column: { fieldName: ScheduledJobColumnFieldName }
  ): string | RangeValue {
    if (jobs.length === 1) return jobs[0][column.fieldName].toString();

    const sortedCopy = jobs
      .map((x) => x[column.fieldName].toString())
      .filter((x) => filter === undefined || filter(x));

    const by = (selector) => (e1, e2) => selector(e1) > selector(e2) ? 1 : -1;
    sortedCopy.sort(by((x) => x[column.fieldName]));

    if (sortedCopy.length > 1)
      return {
        start: sortedCopy[0],
        end: sortedCopy[sortedCopy.length - 1],
      };
    else if (sortedCopy.length === 1) return `${sortedCopy[0]}`;
    else return '<none>';
  }

  return summarizer;
};

const sumSummarizer = (jobs: AvailableJobGridItem[], column: IAvailableJobColumn) => {
  return jobs
    .map((j) => Number(j[column.fieldName]))
    .reduce((sum, n) => sum + n, 0)
    .toString();
};
const sumSummarizer2 = (
  jobs: ScheduledJobGridItem[],
  column: { fieldName: ScheduledJobColumnFieldName }
) =>
  jobs
    .map((j) => Number(j[column.fieldName]))
    .reduce((sum, n) => sum + n, 0)
    .toString();
const timespanSummarizer2 = (
  jobs: ScheduledJobGridItem[],
  column: { fieldName: ScheduledJobColumnFieldName }
) =>
  jobs
    .map((j) => moment.duration(j[column.fieldName]))
    .reduce((acc, cur) => acc.add(cur))
    .toISOString();

export const initialAvailableColumnState: IAvailableJobColumn[] = [
  {
    fieldName: 'toolingCode',
    displayName: 'tooling',
    name: 'Tooling',
    isChecked: true,
    color: toolingColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'materialCode',
    displayName: 'material',
    name: 'Material',
    isChecked: true,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'requiredDateDisplay',
    displayName: 'requiredBy',
    name: 'Required By',
    isChecked: true,
    color: jobColor,
    units: '',
    summarizer: rangeSummarizer(isDateString),
  },
  {
    fieldName: 'orderCode',
    displayName: 'order',
    name: 'Order',
    isChecked: true,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'customerName',
    displayName: 'customer',
    name: 'Customer',
    isChecked: true,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'totalFt',
    displayName: 'length',
    name: 'Length',
    isChecked: true,
    color: jobColor,
    units: 'ft',
    summarizer: sumSummarizer,
  },
  {
    fieldName: 'truckNumber',
    displayName: 'truck',
    name: 'Truck',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'stagingBay',
    displayName: 'stagingBay',
    name: 'Staging Bay',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'loadingDock',
    displayName: 'loadingDock',
    name: 'Loading Dock',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'materialColor',
    displayName: 'color',
    name: 'Color',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'materialGauge',
    displayName: 'gauge',
    name: 'Gauge',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: rangeSummarizer(),
  },
  {
    fieldName: 'materialWidthIn',
    displayName: 'width',
    name: 'Width',
    isChecked: false,
    color: materialColor,
    units: 'in',
    summarizer: rangeSummarizer(),
  },
  {
    fieldName: 'materialDescription',
    displayName: 'materialDescription',
    name: 'Material Description',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'toolingDescription',
    displayName: 'toolingDescription',
    name: 'Tooling Description',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'longestLengthIn',
    displayName: 'longestPart',
    name: 'Longest Part',
    isChecked: false,
    color: jobColor,
    units: 'in',
    summarizer: rangeSummarizer(),
  },
  {
    fieldName: 'salesOrder',
    displayName: 'so',
    name: 'SO',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'user1',
    displayName: 'orderUser1',
    name: 'User1',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  }, //
  {
    fieldName: 'user2',
    displayName: 'orderUser2',
    name: 'User2',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'user3',
    displayName: 'orderUser3',
    name: 'User3',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'user4',
    displayName: 'orderUser4',
    name: 'User4',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'user5',
    displayName: 'orderUser5',
    name: 'User5',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'workOrder',
    displayName: 'Work Order',
    name: 'Work Order',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer,
  },
  {
    fieldName: 'importDateDisplay',
    displayName: 'imported',
    name: 'Imported',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: rangeSummarizer(isDateString),
  },
  {
    fieldName: 'shipDateDisplay',
    displayName: 'shipDate',
    name: 'Ship Date',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: rangeSummarizer(isDateString),
  },
];

export const initialScheduledJobColumnState: IScheduledJobColumn[] = [
  {
    fieldName: 'toolingCode',
    displayName: 'tooling',
    name: 'Tooling',
    isChecked: true,
    color: toolingColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'materialCode',
    displayName: 'material',
    name: 'Material',
    isChecked: true,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'requiredDateDisplay',
    displayName: 'requiredBy',
    name: 'Required By',
    isChecked: true,
    color: jobColor,
    units: '',
    summarizer: rangeSummarizer2(isDateString),
  },
  {
    fieldName: 'orderCode',
    displayName: 'order',
    name: 'Order',
    isChecked: true,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'customerName',
    displayName: 'customer',
    name: 'Customer',
    isChecked: true,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'totalFt',
    displayName: 'total',
    name: 'Length',
    isChecked: false,
    color: jobColor,
    units: 'ft',
    summarizer: sumSummarizer2,
  },
  {
    fieldName: 'remainingFt',
    displayName: 'remaining',
    name: 'RemainingLength',
    isChecked: true,
    color: jobColor,
    units: 'ft',
    summarizer: sumSummarizer2,
  },
  {
    fieldName: 'truckNumber',
    displayName: 'truck',
    name: 'Truck',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'stagingBay',
    displayName: 'stagingBay',
    name: 'Staging Bay',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'loadingDock',
    displayName: 'loadingDock',
    name: 'Loading Dock',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'materialColor',
    displayName: 'color',
    name: 'Color',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'materialGauge',
    displayName: 'gauge',
    name: 'Gauge',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'materialWidthIn',
    displayName: 'width',
    name: 'Width',
    isChecked: false,
    color: materialColor,
    units: 'in',
    summarizer: rangeSummarizer2(),
  },
  {
    fieldName: 'materialDescription',
    displayName: 'materialDescription',
    name: 'Material Description',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'toolingDescription',
    displayName: 'toolingDescription',
    name: 'Tooling Description',
    isChecked: false,
    color: materialColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'longestLengthIn',
    displayName: 'longestPart',
    name: 'Longest Part',
    isChecked: false,
    color: jobColor,
    units: 'in',
    summarizer: rangeSummarizer2(),
  },
  {
    fieldName: 'salesOrder',
    displayName: 'so',
    name: 'SO',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'user1',
    displayName: 'orderUser1',
    name: 'User1',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  }, //
  {
    fieldName: 'user2',
    displayName: 'orderUser2',
    name: 'User2',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'user3',
    displayName: 'orderUser3',
    name: 'User3',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'user4',
    displayName: 'orderUser4',
    name: 'User4',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'user5',
    displayName: 'orderUser5',
    name: 'User5',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'workOrder',
    displayName: 'Work Order',
    name: 'Work Order',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: appendSummarizer2,
  },
  {
    fieldName: 'importDateDisplay',
    displayName: 'imported',
    name: 'Imported',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: rangeSummarizer2(isDateString),
  },
  {
    fieldName: 'shipDateDisplay',
    displayName: 'shipDate',
    name: 'Ship Date',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: rangeSummarizer2(isDateString),
  },
  {
    fieldName: 'sequence',
    displayName: 'sequence',
    name: 'Sequence',
    isChecked: false,
    color: jobColor,
    units: '',
    summarizer: rangeSummarizer2(),
  },
  {
    fieldName: 'completePct',
    displayName: 'complete',
    name: 'CompletePct',
    isChecked: false,
    color: jobColor,
    units: '%',
    summarizer: appendSummarizer2, // todo: it would be nice to show the actual complete percentage of the group, but that could be quite difficult.
  },
];

export const availableColumnsReducer = createReducer(
  initialAvailableColumnState,

  on(schedulerActions.initAvaColumnsAction, (state, { columns }) => {
    if (columns.length > 0) {
      return initialAvailableColumnState
        .map((col, i) => {
          const pos = columns.findIndex((u) => u.fieldName === col.fieldName);
          return {
            ...col,
            // The server value can dictate checked state...
            isChecked: pos > -1 ? columns[pos].isChecked : col.isChecked,
            // ...and column order.
            position: pos > -1 ? pos : i + initialAvailableColumnState.length,
            width: pos > -1 ? columns[pos].width : -1, // todo: what is a good default?
          };
        })
        .sort((a, b) => (a.position > b.position ? 1 : -1));
    } else {
      return [...initialAvailableColumnState];
    }
  }),
  on(schedulerActions.toggleAvailableJobColumnAction, (state, { fieldName }) =>
    state.map((column) => {
      if (column.fieldName === fieldName) {
        return { ...column, isChecked: !column.isChecked };
      }
      return column;
    })
  ),
  on(schedulerActions.reorderAvailableColumnAction, (state, { fieldName, position }) => {
    const from = state.findIndex((x) => x.fieldName === fieldName);
    if (from > -1) {
      const to = position;

      // Move from one position to another, shifting everything
      // as necessary.
      const copy = [...state];
      copy.splice(to, 0, copy.splice(from, 1)[0]);

      return copy;
    }
    return state;
  }),

  on(schedulerActions.resetAvailableJobColumnsAction, (state) => [...initialAvailableColumnState]),
  on(schedulerActions.changeWidthAvailableJobColumnAction, (state, { fieldName, width }) =>
    state.map((column) => {
      if (column.fieldName === fieldName) {
        return { ...column, width };
      }
      return column;
    })
  )
);

export const assignedColumnsReducer = createReducer(
  initialScheduledJobColumnState,
  on(schedulerActions.initAssColumnsAction, (state, { columns }) => {
    if (columns.length > 0) {
      return initialScheduledJobColumnState
        .map((col, i) => {
          const pos = columns.findIndex((u) => u.fieldName === col.fieldName);
          return {
            ...col,
            // The server value can dictate checked state...
            isChecked: pos > -1 ? columns[pos].isChecked : col.isChecked,
            // ...and column order.
            position: pos > -1 ? pos : i + initialScheduledJobColumnState.length,
            width: pos > -1 ? columns[pos].width : -1, // todo: what is a good default?
          };
        })
        .sort((a, b) => (a.position > b.position ? 1 : -1));
    } else {
      return [...initialScheduledJobColumnState];
    }
  }),
  on(schedulerActions.toggleScheduledJobColumnAction, (state, { fieldName }) =>
    state.map((column) => {
      if (column.fieldName === fieldName) {
        return { ...column, isChecked: !column.isChecked };
      }
      return column;
    })
  ),
  on(schedulerActions.reorderScheduledColumnAction, (state, { fieldName, position }) => {
    const from = state.findIndex((x) => x.fieldName === fieldName);
    if (from > -1) {
      const to = position;

      // Move from one position to another, shifting everything
      // as necessary.
      const copy = [...state];
      copy.splice(to, 0, copy.splice(from, 1)[0]);

      return copy;
    }
    return state;
  }),

  on(schedulerActions.resetScheduledJobColumnsAction, (state) => [
    ...initialScheduledJobColumnState,
  ]),
  on(schedulerActions.changeWidthScheduledJobColumnAction, (state, { fieldName, width }) =>
    state.map((column) => {
      if (column.fieldName === fieldName) {
        return { ...column, width };
      }
      return column;
    })
  )
);

export type SchedulingSpeed = { pending: number[]; asOf: Date; isPending: boolean };

export const schedulingSpeedReducer = createReducer(
  { pending: [] as number[], asOf: new Date(), isPending: false },
  on(schedulerActions.scheduleJobAction, (state, { payload }) => {
    if (state.pending.length === 0)
      return {
        ...state,
        pending: payload.jobIds,
        asOf: new Date(),
        isPending: true,
      };
    else
      return {
        ...state,
        pending: [...state.pending, ...payload.jobIds],
        isPending: true,
      };
  })
  // I have to review more
  // case PUT: {
  //   if (action.collection === 'Schedule') {
  //     const dones = action.payload.sequence.map((x) => x.ordId) as number[];
  //     const pending = state.pending.filter((ordId) => !dones.includes(ordId));
  //     return { ...state, pending, isPending: pending.length > 0 };
  //   }
  // }
);

export const availableJobsLocalModificationsReducer = createReducer(
  [],
  on(schedulerActions.scheduleJobAction, (state, { payload }) => {
    return state.filter(
      (avj) => !(_.includes(payload.jobIds, avj.ordId) && avj.machineNumber === payload.machineId)
    );
  }),
  on(schedulerActions.unscheduleJobAction, (state, { payload }) => {
    let newJobs = payload.scheduledJobIds.map((id) => {
      return {
        id: `${payload.machineId}-${id}`,
        expectedRuntime: 0,
        warningDueDate: false,
        machineId: payload.machineId,
        jobId: id,
      };
    });
    return _([...state, ...newJobs])
      .sortBy((j) => j.id)
      .value();
  })
);

export const selectedJobsReducer = createReducer(
  [] as number[],
  on(schedulerActions.setJobSelectionAction, (state, { payload }) => {
    const without_payload = state.filter((x) => !payload.jobIds.includes(x));
    if (payload.selected) {
      return without_payload.concat(payload.jobIds);
    } else {
      return without_payload;
    }
  })
);

export const summarizedJobsReducer = createReducer(
  [] as number[],
  on(schedulerActions.setJobSummarizedAction, (state, { payload }) => {
    const without_payload = state.filter((x) => !payload.jobIds.includes(x));
    if (payload.selected) {
      return without_payload.concat(payload.jobIds);
    } else {
      return without_payload;
    }
  })
);

export type IFlights = {
  flightNumber: number;
  jobIds: number[];
};

export type JobsInFlightState = { flights: IFlights[]; fliers: number[] };

const initialJobsFlight: JobsInFlightState = { flights: [], fliers: [] };
export const jobsInFlightReducer = createReducer(
  initialJobsFlight,
  on(schedulerActions.setJobsInFlightAction, (state, { flightNumber, jobId }) => {
    let newIds = [];
    if (Array.isArray(jobId)) newIds = [...jobId];
    else newIds = [jobId];

    return {
      flights: [...state.flights, { flightNumber, jobIds: newIds }],
      fliers: [...state.fliers, ...newIds],
    };
  }),
  on(schedulerActions.landJobsInFlightAction, (state, { flightNumber }) => {
    const flights = state.flights.filter((x) => x.flightNumber !== flightNumber);
    return {
      flights: [...flights],
      fliers: flights.flatMap((x) => x.jobIds),
    };
  })
);

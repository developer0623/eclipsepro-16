import { createAction, props } from '@ngrx/store';
import { IAvailableJobColumn, IScheduledJobColumn } from 'src/app/core/dto';

export const LOAD_SCHEDULER_COLUMNS = '[LOAD_SCHEDULER_COLUMNS]';
export const INIT_ASSIGNED_COLUMNS = '[INIT_ASSIGNED_COLUMNS]';
export const INIT_AVAILABLE_COLUMNS = '[INIT_AVAILABLE_COLUMNS]';

export const TOGGLE_AVAILABLE_COLUMN = '[TOGGLE_AVAILABLE_COLUMN]';
export const REORDER_AVAILABLE_COLUMN = '[REORDER_AVAILABLE_COLUMN]';
export const REORDER_SCHEDULED_COLUMN = '[REORDER_SCHEDULED_COLUMN]';
export const RESET_AVAILABLE_COLUMNS = '[RESET_AVAILABLE_COLUMNS]';
export const RESET_SCHEDULED_COLUMNS = '[RESET_SCHEDULED_COLUMNS]';
export const TOGGLE_SCHEDULED_COLUMN = '[TOGGLE_SCHEDULED_COLUMN]';
export const SCHEDULE_JOB_ACTION = '[SCHEDULE_JOB_ACTION]';
export const UNSCHEDULE_JOB_ACTION = '[UNSCHEDULE_JOB_ACTION]';
export const SET_JOB_SELECTION = '[SET_JOB_SELECTION]';
export const SET_JOB_SUMMARIZED = '[SET_JOB_SUMMARIZED]';
export const PATCH_JOBS = '[PATCH_JOBS]';
export const SET_JOBS_IN_FLIGHT = '[SET_JOBS_IN_FLIGHT]';
export const LAND_JOBS_IN_FLIGHT = '[LAND_JOBS_IN_FLIGHT]';
export const CHANGE_WIDTH_SCHEDULED_COLUMN = '[CHANGE_WIDTH_SCHEDULED_COLUMN]';
export const CHANGE_WIDTH_AVAILABLE_COLUMN = '[CHANGE_WIDTH_AVAILABLE_COLUMN]';

export const loadSchdulerColumnsAction = createAction(LOAD_SCHEDULER_COLUMNS);

export const initAssColumnsAction = createAction(
  INIT_ASSIGNED_COLUMNS,
  props<{
    columns: IScheduledJobColumn[];
  }>()
);

export const initAvaColumnsAction = createAction(
  INIT_AVAILABLE_COLUMNS,
  props<{
    columns: IAvailableJobColumn[];
  }>()
);

export const patchJobsAction = createAction(
  PATCH_JOBS,
  props<{
    ordIds: number | number[];
    collection: string;
    patch: any /** TODO: require the members here to exist on T */;
  }>()
);

export const toggleAvailableJobColumnAction = createAction(
  TOGGLE_AVAILABLE_COLUMN,
  props<{
    fieldName: string;
  }>()
);

export const reorderAvailableColumnAction = createAction(
  REORDER_AVAILABLE_COLUMN,
  props<{
    fieldName: string;
    position: number;
  }>()
);

export const resetAvailableJobColumnsAction = createAction(RESET_AVAILABLE_COLUMNS);

export const changeWidthAvailableJobColumnAction = createAction(
  CHANGE_WIDTH_AVAILABLE_COLUMN,
  props<{
    fieldName: string;
    width: number;
  }>()
);

export const toggleScheduledJobColumnAction = createAction(
  TOGGLE_SCHEDULED_COLUMN,
  props<{
    fieldName: string;
  }>()
);

export const changeWidthScheduledJobColumnAction = createAction(
  CHANGE_WIDTH_SCHEDULED_COLUMN,
  props<{
    fieldName: string;
    width: number;
  }>()
);

export const reorderScheduledColumnAction = createAction(
  REORDER_SCHEDULED_COLUMN,
  props<{
    fieldName: string;
    position: number;
  }>()
);

export const resetScheduledJobColumnsAction = createAction(RESET_SCHEDULED_COLUMNS);

export const scheduleJobAction = createAction(
  SCHEDULE_JOB_ACTION,
  props<{
    payload: {
      jobIds: number[];
      machineId: number;
      requestedSequenceNumber?: number;
      isOnMachine: boolean;
      preceedingJobId?: number;
    };
  }>()
);

export const unscheduleJobAction = createAction(
  UNSCHEDULE_JOB_ACTION,
  props<{
    payload: { scheduledJobIds: number[]; machineId: number };
  }>()
);

export const setJobSelectionAction = createAction(
  SET_JOB_SELECTION,
  props<{
    payload: { jobIds: number[]; selected: boolean };
  }>()
);

export const setJobSummarizedAction = createAction(
  SET_JOB_SUMMARIZED,
  props<{
    payload: { jobIds: number[]; selected: boolean };
  }>()
);

export const setJobsInFlightAction = createAction(
  SET_JOBS_IN_FLIGHT,
  props<{
    flightNumber: number;
    jobId: number | number[];
  }>()
);

export const landJobsInFlightAction = createAction(
  LAND_JOBS_IN_FLIGHT,
  props<{
    flightNumber: number;
  }>()
);

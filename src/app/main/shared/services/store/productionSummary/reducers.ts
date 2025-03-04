import { createReducer, on } from '@ngrx/store';
import { IProductionSummaryReportRecord } from 'src/app/core/dto';
import { freshProductionSummaryAction } from './actions';

const initial: IProductionSummaryReportRecord[] = [];

export const productionSummaryReducer = createReducer(
  initial,

  on(freshProductionSummaryAction, (state, { payload }) => payload)
);

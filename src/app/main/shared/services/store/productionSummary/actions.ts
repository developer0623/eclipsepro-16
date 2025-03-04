import { createAction, props } from '@ngrx/store';
import { IProductionSummaryReportRecord } from 'src/app/core/dto';

export const FRESH_PRODUCTION_SUMMARY = '[FRESH_PRODUCTION_SUMMARY]';

export const freshProductionSummaryAction = createAction(
  FRESH_PRODUCTION_SUMMARY,
  props<{ payload: IProductionSummaryReportRecord[] }>()
);

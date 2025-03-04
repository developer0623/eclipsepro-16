import { createAction, props } from '@ngrx/store';
import { RebundleResult } from 'src/app/core/dto';

export const INITSINGLEORDER = '[INITSINGLEORDER]';
export const SETREBUNDLERESULT = '[SETREBUNDLERESULT]';
export const SAVEREBUNDLERESULT = '[SAVEREBUNDLERESULT]';
export const SAVEREBUNDLESUCCESSFUL = '[SAVEREBUNDLESUCCESSFUL]';
export const CANCELBUNDLERESULT = '[CANCELBUNDLERESULT]';

export const initSingleOrderAction = createAction(INITSINGLEORDER, props<{ ordId: number }>());

export const setRebundleResultAction = createAction(
  SETREBUNDLERESULT,
  props<{ rebundleResult: RebundleResult }>()
);

export const saveRebundleResultAction = createAction(
  SAVEREBUNDLERESULT,
  props<{ ordId: number; rebundleResult: RebundleResult }>()
);

export const cancelBundleResultAction = createAction(CANCELBUNDLERESULT);

export const saveRebundleSuccessfulAction = createAction(SAVEREBUNDLESUCCESSFUL);

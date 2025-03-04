import { createReducer, on } from '@ngrx/store';
import {
  initSingleOrderAction,
  setRebundleResultAction,
  saveRebundleResultAction,
  cancelBundleResultAction,
  saveRebundleSuccessfulAction,
} from './actions';
import { ISingleOrderState } from 'src/app/core/dto';

const initialState: ISingleOrderState = {
  ordId: null,
  clearRebundleOnNextPut: false,
  rebundleResult: null,
};

export const singleOrderReducer = createReducer(
  initialState,

  // Initialize Single Order
  on(initSingleOrderAction, (state, { ordId }) => ({
    ...state,
    ordId,
    clearRebundleOnNextPut: false,
    rebundleResult: null,
  })),

  // Set Rebundle Result
  on(setRebundleResultAction, (state, { rebundleResult }) => ({
    ...state,
    rebundleResult,
  })),

  // Save Rebundle Successful
  on(saveRebundleSuccessfulAction, (state) => ({
    ...state,
    clearRebundleOnNextPut: true,
  })),

  // Cancel Bundle Result
  on(cancelBundleResultAction, (state) => ({
    ...state,
    rebundleResult: null,
  }))

  // // Handle [PUT] action
  // on(PutAction, (state) => ({
  //   ...state,
  //   rebundleResult: state.clearRebundleOnNextPut ? null : state.rebundleResult,
  //   clearRebundleOnNextPut: false,
  // }))
);

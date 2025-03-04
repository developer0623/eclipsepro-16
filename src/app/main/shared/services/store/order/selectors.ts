import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { IAppState } from '../store.dto';
import { IJobItem, RebundleResult, IConsumptionHistory, IBundleResult } from 'src/app/core/dto';

export interface IBundleModel {
  /** The number assigned to this bundle, within the job. Like an identity,
   * but in the scope of this order only.
   */
  bundleNo: number;
  /** Total weight of this bundle. */
  weightLbs: number;
  /** Total piece count of this bundle. */
  pieces: number;
  /** Max weight allowed in this bundle, per the bundle rules in effect. */
  maxWeightLbs: number;
  /** Max pieces allowed in this bundle, per the bundle rules in effect. */
  maxPieces: number;
  /** Length of the shortest piece in this bundle. */
  bundleMinLengthIn: number;
  /** Length of the longest piece in this bundle. */
  bundleMaxLengthIn: number;
  /** Length of the longest piece in this order. */
  orderMaxLengthIn: number;
  /** The shortest piece in this bundle can only be this much shorter (by percent) than the longest piece in the bundle, per the bundle rules in effect. */
  minPercentOfMaxLength: number;
  /** Avoids a compiler error because I was being lazy at the time. */
  checked: boolean;
  totalLengthIn: number;
  doneLengthIn: number;
}

export type BundleRules = {
  id: number;
  maxPieceCount: number;
  maxWeightLbs: number;
  minPctOfMaxLength: number;
  itemSort: 'LongToShort' | 'ShortToLong';
};

export function ComputeBundlesModel(rules: BundleRules, job_items: IJobItem[]): IBundleModel[] {
  return _(job_items)
    .groupBy((i) => i.bundle)
    .map((bundle_items, bundle) => {
      const _bundle_items = _(bundle_items);
      return {
        bundleNo: Number(bundle),
        weightLbs: _bundle_items.map((x) => x.weightLbs).sum(),
        pieces: _bundle_items.map((x) => x.quantity).sum(),

        maxWeightLbs: rules.maxWeightLbs,
        maxPieces: rules.maxPieceCount,
        bundleMinLengthIn: _bundle_items
          .map((x) => x.lengthIn)
          .filter((x) => x > 0) // zero is used on message only lines and is not produced.
          .min(),
        bundleMaxLengthIn: _bundle_items.map((x) => x.lengthIn).max(),
        orderMaxLengthIn: _(job_items)
          .map((x) => x.lengthIn)
          .max(),
        minPercentOfMaxLength: rules.minPctOfMaxLength,
        checked: false,
        totalLengthIn: _bundle_items.map((x) => x.quantity * x.lengthIn).sum(),
        doneLengthIn: _bundle_items.map((x) => x.quantityDone * x.lengthIn).sum(),
      };
    })
    .value();
}

// Throw this in the bundlesModel array if you want to see all the alertng features.
export const badBundle: IBundleModel = {
  bundleNo: 1,
  weightLbs: 2562,
  pieces: 1999,
  maxWeightLbs: 1500,
  maxPieces: 2000,
  bundleMinLengthIn: 46,
  bundleMaxLengthIn: 100,
  orderMaxLengthIn: 150,
  minPercentOfMaxLength: 0.5,
  checked: false,
  totalLengthIn: 0,
  doneLengthIn: 0,
};

export function applyRebundleResult(bundles: RebundleResult, items: IJobItem[]) {
  const rebundledItems = bundles.rebundledItems.map((b, idx) => ({
    // use the original item as the prototype for this new item
    ...items.find((i) => i.itemId === b.prototypeItemId),
    ...b,
    weightLbs: ((b.quantity * b.lengthIn) / 12) * bundles.lbsPerFt,
    itemId: b.itemId, //-(idx + 1),
    prototypeItemId: b.prototypeItemId,
  }));

  return rebundledItems;
}

export const selectJobDetail = (state: IAppState) => state.data.collections.JobDetail;
export const selectMachine = (state: IAppState) => state.data.collections.Machine;
export const selectBundleRules = (state: IAppState) => state.data.collections.BundleRules;
export const selectSingleOrder = (state: IAppState) => state.data.SingleOrder;

export const selectSingleOrderById = (ordId: number) =>
  createSelector(
    selectJobDetail,
    selectMachine,
    selectBundleRules,
    selectSingleOrder,
    (jobDetail, machines, bundleRules, singleOrder) => {
      const jobData = jobDetail.find((x) => x.ordId === ordId);

      if (!jobData) {
        return null;
      }

      // Modify scheduleState if scheduled
      const schState = { ...jobData.job.scheduleState };
      if (schState.state === 'Scheduled') {
        schState['machine'] = machines.find((m) => m.machineNumber === schState.machineNumber);
      }

      const orderBundleRules = bundleRules.find((r) => r.id === ordId);
      const hasUnsavedBundleChanges = singleOrder?.rebundleResult ? true : false;

      const items = hasUnsavedBundleChanges
        ? applyRebundleResult(singleOrder.rebundleResult, jobData.items)
        : jobData.items.map((i) => ({ ...i, prototypeItemId: i.itemId }));

      return {
        ...jobData,
        job: {
          ...jobData.job,
          requiredDate: jobData.job.requiredDate ? new Date(jobData.job.requiredDate) : null,
          scheduleState: schState,
        },
        items,
        completePerc: (jobData.job.completeFt / jobData.job.totalFt) * 100,
        bundlesModel: orderBundleRules ? ComputeBundlesModel(orderBundleRules, items) : [],
        hasUnsavedBundleChanges,
        rebundleResult: singleOrder?.rebundleResult,
        allowRebundling: 'SEQD UNSCHED'.includes(jobData.job.legacyStatus.toUpperCase()),
      };
    }
  );

export const selectConsumptionHistory = (state: IAppState) =>
  state.data.collections.ConsumptionHistory;
export const selectBundleResult = (state: IAppState) => state.data.collections.BundleResult;

// Selector: Get Consumption Summary for a Specific Order
export const selectConsumptionSummaryForOrder = (ordId: number) =>
  createSelector(selectConsumptionHistory, selectMachine, (history, machines) =>
    history
      .filter((x: IConsumptionHistory) => x.ordId === ordId)
      .map((x) => ({
        ...x,
        machine: machines.find((m) => m.machineNumber === x.machineNumber) || null, // Avoids undefined
      }))
  );

// Selector: Get Produced Bundles for a Specific Order
export const selectProducedBundlesForOrder = (ordId: number) =>
  createSelector(
    selectBundleResult,
    (bundles) =>
      [...bundles] // Clone array to avoid mutating state
        .filter((x: IBundleResult) => x.ordId === ordId)
        .sort((a, b) => b.id.localeCompare(a.id)) // Sort in descending order by ID
  );

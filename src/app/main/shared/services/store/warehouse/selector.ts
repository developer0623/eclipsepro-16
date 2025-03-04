import * as _ from 'lodash';
import { createSelector } from '@ngrx/store';
import { IAppState } from '../store.dto';
import { ITask, IReasonCode } from 'src/app/core/dto';

export const selectMaterialTasks = (state: IAppState) => state.data.collections.MaterialTask;
export const selectLocations = (state: IAppState) => state.data.collections.Location;
export const selectReasonCodes = (state: IAppState) => state.data.collections.ReasonCode;

export const selectTaskSelector = createSelector(
  selectMaterialTasks,
  selectLocations,
  selectReasonCodes,
  (materialTasks, locations, reasonCodes) =>
    materialTasks.map((t) => {
      // Find the source and destination location names
      const sourceLoc = locations.find((l) => l.id === t.sourceLocationId) || { name: '<unknown>' };
      const destLoc = locations.find((l) => l.id === t.destinationLocationId) || {
        name: '<unknown>',
      };

      // Update override code name if available
      if (t.overrideCode) {
        const overrideCodeReason = reasonCodes.find(
          (r) => r.codeSet === t.overrideCode.codeSet && r.id === t.overrideCode.reason
        );
        if (overrideCodeReason) {
          t.overrideCode.name = overrideCodeReason.reason;
        }
      }

      // Return a new object with the task data, including location names
      return {
        ...t,
        sourceLocation: sourceLoc.name,
        desinationLocation: destLoc.name,
      };
    })
);

export const TaskToMagicStateNumberMap = (task: ITask) => {
  // logic pulled from tasks.html
  switch (task.taskState) {
    case 'Ready':
      return 0;
    case 'Complete':
      return 2;
    default:
      return 1;
  }
};

export const GroupByCodeSet = (codes: IReasonCode[]) => {
  const reasonGroups = _(codes)
    .groupBy((c) => c.codeSet)
    .value();

  return reasonGroups;
};

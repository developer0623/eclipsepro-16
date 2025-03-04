import { createSelector } from '@ngrx/store';

import { IAppState } from '../store.dto';

// Totally cheating, but machine location names are on the ext, and I don't want to
// solve that problem today.
export const machineLocation = (machineNumber: number) =>
  'Location/MACH' + machineNumber.toString().padStart(2, '0');

const selectAndonViews = (state: IAppState) => state.data.collections.AndonViews;
const selectMetricDefinitions = (state: IAppState) => state.data.collections.MetricDefinition;
const selectMachineScheduleSummary = (state: IAppState) =>
  state.data.collections.MachineScheduleSummary;
const selectMachineState = (state: IAppState) => state.data.collections.MachineState;
const selectMachines = (state: IAppState) => state.data.collections.Machine;
const selectJobDetails = (state: IAppState) => state.data.collections.JobDetail;
const selectMachineStatistics = (state: IAppState) => state.data.collections.MachineStatistics;
const selectMaterialTasks = (state: IAppState) => state.data.collections.MaterialTask;

export const selectAndOnDataForMachine = (machineNumber: number) =>
  createSelector(
    selectAndonViews,
    selectMetricDefinitions,
    selectMachineScheduleSummary,
    selectMachineState,
    selectMachines,
    selectJobDetails,
    selectMachineStatistics,
    selectMaterialTasks,
    (
      views,
      metricDefinitions,
      machineSchedules,
      machineStates,
      machines,
      jobDetails,
      machineStatistics,
      materialTasks
    ) => {
      const scheduleSummary = machineSchedules.find((x) => x.machineNumber === machineNumber);
      const machineLoc = machineLocation(machineNumber);
      const machineState = machineStates.find((x) => x.machineNumber === machineNumber);
      const currentJob = jobDetails.find((x) => x.ordId === scheduleSummary?.currentOrderId);

      return {
        machineNumber,
        views,
        metricDefinitions,
        machine: machines.find((x) => x.machineNumber === machineNumber),
        scheduleSummary,
        machineState,
        shiftStats: machineStatistics.find((x) => x.machineNumber === machineNumber),
        currentJob: currentJob?.job,
        currentItem: currentJob?.items.find((i) => i.itemId === machineState?.currentItmId),
        task:
          materialTasks
            .filter((t) => t.destinationLocationId === machineLoc)
            .sort((ta, tb) => (ta.requiredDate < tb.requiredDate ? -1 : 1))[0] || {},
      };
    }
  );

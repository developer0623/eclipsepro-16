import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, tap, BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { ClientDataStore } from './clientData.store';
import {
  IMachine,
  IDashboardMachine,
  IMetricDefinition,
  IDashboardDevice,
  IMachineMetrics,
  IDeviceState,
  IDeviceMetricConfigWithDef,
  IScheduleEstimate,
} from 'src/app/core/dto';

@Injectable({
  providedIn: 'root',
})
export class MachineDataService {
  private _dashboardMachine$ = new BehaviorSubject<IDashboardMachine[]>([]);
  dashboardMachines$: Observable<IDashboardMachine[]> = this._dashboardMachine$.asObservable();

  /** @deprecated use dashboardMachines$ instead */
  machines: Map<number, IMachine> = new Map();

  /** @deprecated use dashboardMachines$ instead */
  machinesArray: IMachine[] = [];

  unlicensedMachines: IMachine[] = [];
  metricDefinitions: Map<number, IMetricDefinition> = new Map();

  private _dashboardDevice$ = new ReplaySubject<IDashboardDevice[]>(1);
  dashboardDevices$: Observable<IDashboardDevice[]> = this._dashboardDevice$.asObservable();
  constructor(private clientDataStore: ClientDataStore) {
    combineLatest([
      this.clientDataStore.SelectMachines(),
      this.clientDataStore.SelectMachineMetricSettings(),
      this.clientDataStore.SelectMetricDefinitions(),
      this.clientDataStore.SelectMachineStates(),
      combineLatest([
        this.clientDataStore.SelectMachineStatistics(),
        this.clientDataStore.SelectMachineStatisticsHistory(),
        this.clientDataStore.SelectMachineScheduleSummary(),
        this.clientDataStore.SelectMachineSchedule(),
        this.clientDataStore.SelectUnlicensedMachines(),
      ]),
    ]).subscribe(
      ([
        machines,
        metrics,
        metricDefinitions,
        state,
        [statistics, statisticsHistory, scheduleSummaries, schedules, unlicensedMachines],
      ]) => {
        machines.forEach((y) => {
          this.machines[y.machineNumber] = y;
        });
        this.machinesArray = machines;

        this.unlicensedMachines = unlicensedMachines;

        schedules.forEach((y) => {
          // this is not ideal.
          this.notifyUpdatedScheduleEstimate(y.machineNumber);
        });
        metricDefinitions.forEach((y) => (this.metricDefinitions[y.metricId] = y));
        let mergedMetrics: IMachineMetrics[] = metrics.map((m) => {
          return {
            machineNumber: m.machineNumber,
            settings: m.settings.map((s) => {
              return {
                ...s,
                def: this.metricDefinitions[s.metricId],
              };
            }),
          };
        });
        // Publish updated machine data
        this._dashboardMachine$.next(
          machines.map((m) => ({
            machineNumber: m.machineNumber,
            machine: m,
            state: state.find((x) => x.machineNumber === m.machineNumber),
            stats: statistics.find((x) => x.machineNumber === m.machineNumber),
            statsHistory: statisticsHistory.find((x) => x.machineNumber === m.machineNumber),
            scheduleSummary: scheduleSummaries.find((x) => x.machineNumber === m.machineNumber),
            scheduleEstimate: this.formatEstimateData(
              schedules.find((x) => x.machineNumber === m.machineNumber)
            ),
            metricSettings: metrics.find((x) => x.machineNumber === m.machineNumber),
            metrics: mergedMetrics.find((x) => x.machineNumber === m.machineNumber),
          }))
        );
      }
    );

    combineLatest([
      clientDataStore.SelectDevices(),
      clientDataStore.SelectDeviceMetrics(),
      clientDataStore.SelectDeviceStates(),
      clientDataStore.SelectDeviceCurrentShiftStatistics(),
    ]).subscribe(([devices, metrics, states, allShiftStats]) => {
      const updatedDevices = devices.map((d) => {
        const state = states
          .map(this.toRunStateIndicatorModel)
          .find((s) => s.deviceId === d.deviceId);

        const metricFromState = state
          ? [
              {
                name: 'Operator',
                value: state.operator,
                tooltip: 'User currently logged into the device',
                ordinal: 99,
                colSpan: 2,
              },
              {
                name: 'Current Part',
                value: state.currentPartId,
                tooltip: 'Current part',
                ordinal: 0,
                colSpan: 2,
              },
            ]
          : [];

        const shiftStats = allShiftStats.find((x) => x.deviceId === d.deviceId);

        const metricsFromShiftStatistics = shiftStats
          ? [
              {
                name: 'Parts',
                value: shiftStats.totalParts,
                tooltip: 'Count of parts produced on this shift',
                ordinal: 1,
              },
              {
                name: 'Ops/hour<br/>(total)',
                value: shiftStats.avgOpsPerHrTotal.toFixed(1),
                tooltip: 'Average operations per hour',
                ordinal: 10,
              },
              {
                name: 'Ops/hour<br/>(running)',
                value: shiftStats.avgOpsPerHrRunning.toFixed(1),
                tooltip: 'Average operations per hour, while running',
                ordinal: 11,
              },
              {
                name: 'Operations',
                value: shiftStats.totalOperations,
                tooltip: 'Count of operations in this shift',
                ordinal: 12,
              },
            ]
          : [];

        const metricsFromMetricsRecord = metrics ? [] : [];

        const metricModels = [
          ...metricFromState,
          ...metricsFromShiftStatistics,
          ...metricsFromMetricsRecord,
        ];

        const metricConfigs: IDeviceMetricConfigWithDef[] = [
          {
            metricId: 'totalParts',
            showInMini: true,
            showInLarge: true,
            def: {
              displayTitle: 'totalParts',
              collection: 'stats',
              primaryDataKey: 'totalParts',
              primaryUnits: '',
              primaryToolTip: '',
              secondaryDataKey: '',
              secondaryUnits: '',
              secondaryToolTip: '',
              showCharts: false,
            },
          },
          {
            metricId: 'totalOperations',
            showInMini: true,
            showInLarge: true,
            def: {
              displayTitle: 'totalOperations',
              collection: 'stats',
              primaryDataKey: 'totalOperations',
              primaryUnits: '',
              primaryToolTip: '',
              secondaryDataKey: '',
              secondaryUnits: '',
              secondaryToolTip: '',
              showCharts: false,
            },
          },
          {
            metricId: 'avgOpsPerHrTotal',
            showInMini: true,
            showInLarge: true,
            def: {
              displayTitle: 'avgOpsPerHrTotal',
              collection: 'stats',
              primaryDataKey: 'avgOpsPerHrTotal',
              primaryUnits: '',
              primaryToolTip: '',
              secondaryDataKey: '',
              secondaryUnits: '',
              secondaryToolTip: '',
              showCharts: false,
            },
          },
          {
            metricId: 'avgOpsPerHrRunning',
            showInMini: true,
            showInLarge: true,
            def: {
              displayTitle: 'avgOpsPerHrRunning',
              collection: 'stats',
              primaryDataKey: 'avgOpsPerHrRunning',
              primaryUnits: '',
              primaryToolTip: '',
              secondaryDataKey: '',
              secondaryUnits: '',
              secondaryToolTip: '',
              showCharts: false,
            },
          },
          {
            metricId: 'runMinutes',
            showInMini: true,
            showInLarge: true,
            def: {
              displayTitle: 'runMinutes',
              collection: 'stats',
              primaryDataKey: 'runMinutes',
              primaryUnits: '',
              primaryToolTip: '',
              secondaryDataKey: '',
              secondaryUnits: '',
              secondaryToolTip: '',
              showCharts: false,
            },
          },
        ];

        return {
          ...d,
          state: state,
          shiftStats: shiftStats,
          metricConfigs: metricConfigs,
          metrics: metrics.find((m) => m.deviceId === d.deviceId),
          metricModels,
        };
      });

      this._dashboardDevice$.next(updatedDevices);
    });
  }

  toRunStateIndicatorModel = (state: IDeviceState) => ({
    ...state,
    lastRunStateChange: new Date(state.asOf),
    isNoPower: state.machinePower !== true,
    isOffline: state.isTimingOut,
    runState: state.runState === 'Running' ? 'R' : state.runState === 'NotRunning' ? 'H' : 'O',
  });

  formatEstimateData(data: IScheduleEstimate): IScheduleEstimate | undefined {
    if (!data) {
      return;
    }

    const estimate = _.cloneDeep(data);

    // Sort schedule blocks by start date
    estimate.scheduleBlocks.sort(
      (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );

    // Filter out unscheduled blocks
    const unscheduledTimes = estimate.scheduleBlocks.filter(
      (block) => block.activityType === 'Unscheduled'
    );

    // Process each block to determine overlap
    estimate.scheduleBlocks = estimate.scheduleBlocks.map((block) => {
      if (block.activityType === 'Unscheduled') {
        const overlapStart = unscheduledTimes.filter(
          (x) =>
            new Date(x.startDateTime).getTime() <= new Date(block.startDateTime).getTime() &&
            new Date(x.endDateTime).getTime() >= new Date(block.startDateTime).getTime() &&
            x.id !== block.id
        );

        const overlapEnd = unscheduledTimes.filter(
          (x) =>
            new Date(x.startDateTime).getTime() <= new Date(block.endDateTime).getTime() &&
            new Date(x.endDateTime).getTime() >= new Date(block.endDateTime).getTime() &&
            x.id !== block.id
        );

        // Set visibility of left and right lines based on overlaps
        return {
          ...block,
          showLeftLine: overlapStart.length === 0,
          showRightLine: overlapEnd.length === 0,
        };
      }

      return block;
    });

    return estimate;
  }

  //very temporary. Find a better way.
  notifyUpdatedScheduleEstimate(machineNumber) {
    // this.rootScope.$broadcast('updatedScheduleEstimate', machineNumber);
  }
}

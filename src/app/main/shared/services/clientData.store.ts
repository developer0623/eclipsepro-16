import { Injectable } from '@angular/core';
import { Store, combineReducers } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, finalize, combineLatestWith } from 'rxjs/operators';
import {
  Fx,
  IReasonCode,
  ILocation,
  ITask,
  ISystemPreferences,
  ISystemInfo,
  IBundlingRulesDocument,
  IMachine,
  IMetricDefinition,
  IMachineStateDto,
  IRollformingStatistics,
  IStatisticsHistory,
  IMachineMetricSettings,
  IScheduleSummary,
  IScheduleEstimate,
  ICoilDto,
  IMaterialDto,
  IJobSummaryDto,
  IJobDetailDto,
  IScheduledDowntimeDto,
  IAvailableJob,
  ISchedule,
  IAlert,
  IHealth,
  IPendingActionsToAgent,
  ISyncState,
  IAndonSequenceConfig,
  IAndonView,
  IConsumptionHistory,
  ITaskFacet,
  IUserTaskFilters,
  IAvailableJobColumn,
  IBundleResult,
  IOrderImportEvent,
  ICoilImportEvent,
  IOrderImportConfig,
  ICoilImportConfig,
  IExportConfig,
  IExportEvent,
  IMaterialImportConfig,
  IMaterialImportEvent,
  IScheduleSyncConfig,
  IScheduleSyncEvent,
  IDevice,
  IDeviceState,
  IDeviceMetrics,
  IDeviceShiftStatistics,
  IWebhookConfig,
  IWebhookEvent,
  IPrintTemplate,
  IMachinePrintConfig,
  IInstalledPrinters,
  ILicense,
  IWallboardDevice,
  IUser,
  ILanguage,
  IProductionSummaryReportRecord,
  IPathfinderMachine,
  ToolingHeader,
  IProductionEvent,
  ToolingDef,
  ExpressCommState,
  ExpressCtrlState,
  IRecentBundleResult,
  IPunchPattern,
  WarehouseViewModel,
  IExternalConnection,
  IMaterialColor,
  IMaterialType,
} from 'src/app/core/dto';

import { collectionReducer } from './clientData.reducers';
import { systemInfoReducer } from './store/misc/reducers';
import { subscribtionsReducer } from './store/subscriptions/reducers';
import { userSessionReducer } from './store/userSession/reducers';
import { productionExplorerDataReducer } from './store/productionexplorer/reducers';
import { deviceExplorerDataReducer } from './store/deviceexplorer/reducers';
import {
  availableColumnsReducer,
  assignedColumnsReducer,
  jobsInFlightReducer,
} from './store/scheduler/reducers';
import {
  schedulingSpeedReducer,
  selectedJobsReducer,
  summarizedJobsReducer,
} from './store/scheduler/reducers';
import { singleOrderReducer } from './store/order/reducers';
import { productionSummaryReducer } from './store/productionSummary/reducers';
import { addSubscriptionAction, delSubscriptionAction } from './store/subscriptions/actions';
import { IAppState } from './store/store.dto';

export const rootReducer = combineReducers({
  collections: collectionReducer,
  SystemInfo: systemInfoReducer,
  Subscriptions: subscribtionsReducer,
  AvailableJobColumns: availableColumnsReducer,
  ScheduledJobColumns: assignedColumnsReducer,
  ProductionSummaryReport: productionSummaryReducer,
  UserSession: userSessionReducer,
  ExplorerData: productionExplorerDataReducer,
  DeviceExplorerData: deviceExplorerDataReducer,
  // DebugCollectionMetrics: DebugCollectionMetricsReducer,
  // DebugActionMetrics: DebugActionMetricsReducer,
  SchedulingSpeed: schedulingSpeedReducer,
  SingleOrder: singleOrderReducer,
  SelectedJobs: selectedJobsReducer,
  SummarizedJobs: summarizedJobsReducer,
  JobsInFlight: jobsInFlightReducer,
});

@Injectable({ providedIn: 'root' })
export class ClientDataStore {
  constructor(private store: Store<IAppState>) {}

  private SelectAndSubscribe<T>(collection: string, filterDef: Fx.FilterDef): Observable<T> {
    const subscription = new Fx.Subscription(collection, filterDef);
    this.store.dispatch(addSubscriptionAction({ payload: subscription }));

    return this.Select<T>(collection).pipe(
      finalize(() => this.store.dispatch(delSubscriptionAction({ payload: subscription })))
    );
  }

  /** Note that the `filterDef` is _not_ applied to the returned observable. */
  public SelectAll<T>(collection: string): Observable<T> {
    return this.SelectAndSubscribe<T>(collection, new Fx.All());
  }

  /** Note that the `filterDef` is _not_ applied to the returned observable. */
  private SelectIn<T>(collection: string, filterDef: Fx.In): Observable<T> {
    return this.SelectAndSubscribe<T>(collection, filterDef);
  }

  private Select<T>(collection: string): Observable<T> {
    return this.store
      .select((state: IAppState) => state.data.collections[collection])
      .pipe(map((data) => data as T));
  }

  public SelectMachines() {
    return this.SelectAll<IMachine[]>('Machine');
  }
  public SelectUnlicensedMachines() {
    return this.SelectAll<IMachine[]>('UnlicensedMachine');
  }
  public SelectReasonCodes() {
    return this.SelectAll<IReasonCode[]>('ReasonCode');
  }
  public SelectTasks() {
    return this.SelectAll<ITask[]>('MaterialTask');
  }
  public SelectTasksIn(filter: {
    property: 'sourceLocationId' | 'destinationLocationId';
    values: (string | number)[];
  }) {
    return this.SelectIn<ITask[]>('MaterialTask', new Fx.In(filter.property, filter.values));
  }
  public SelectLocations() {
    return this.SelectAll<ILocation[]>('Location');
  }
  public SelectSystemPreferences() {
    return this.SelectAll<ISystemPreferences>('SystemPreferences');
  }
  public SelectMetricDefinitions() {
    return this.SelectAll<IMetricDefinition[]>('MetricDefinition');
  }
  public SelectMachineStates() {
    return this.SelectAll<IMachineStateDto[]>('MachineState');
  }
  public SelectMachineStatistics() {
    return this.SelectAll<IRollformingStatistics[]>('MachineStatistics');
  }
  public SelectMachineStatisticsHistory() {
    return this.SelectAll<IStatisticsHistory[]>('MachineStatisticsHistory');
  }
  public SelectMachineMetricSettings() {
    return this.SelectAll<IMachineMetricSettings[]>('MachineMetricSettings');
  }
  public SelectMachineScheduleSummary() {
    return this.SelectAll<IScheduleSummary[]>('MachineScheduleSummary');
  }
  public SelectMachineScheduleSummaryIn(filter: { property: string; values: (string | number)[] }) {
    return this.SelectIn<IScheduleSummary[]>(
      'MachineScheduleSummary',
      new Fx.In(filter.property, filter.values)
    );
  }
  public SelectMachineSchedule() {
    return this.SelectAll<IScheduleEstimate[]>('MachineSchedule');
  }
  public SelectCoils() {
    return this.SelectAll<ICoilDto[]>('Coil');
  }
  public SelectCoilsIn(filter: { property: string; values: string[] }) {
    return this.SelectIn<ICoilDto[]>('Coil', new Fx.In(filter.property, filter.values));
  }
  public SelectMaterialColors() {
    return this.SelectAll<IMaterialColor[]>('MaterialColors');
  }
  public SelectMaterialTypes() {
    return this.SelectAll<IMaterialType[]>('MaterialTypes');
  }
  public SelectCoilTypes() {
    return this.SelectAll<IMaterialDto[]>('CoilTypes');
  }
  public SelectJobSummaries() {
    return this.SelectAll<IJobSummaryDto[]>('JobSummary');
  }
  public SelectJobSummariesIn(filter: { property: 'ordId'; values: (string | number)[] }) {
    return this.SelectIn<IJobSummaryDto[]>('JobSummary', new Fx.In(filter.property, filter.values));
  }
  SelectJobSummariesAllRecent(daysOld: number) {
    return this.SelectAndSubscribe<IJobSummaryDto[]>('JobSummary', new Fx.AllRecent(daysOld));
  }
  public SelectJobDetailIn(filter: { property: 'ordId'; values: (string | number)[] }) {
    return this.SelectIn<IJobDetailDto[]>('JobDetail', new Fx.In(filter.property, filter.values));
  }
  public SelectScheduledDowntimeDefinition() {
    return this.SelectAll<IScheduledDowntimeDto[]>('ScheduledDowntimeDefinition');
  }
  public SelectAvailableJobs() {
    return this.SelectAll<IAvailableJob[]>('AvailableJob');
  }
  public SelectAvailableJobsIn(filter: { property: 'machineNumber'; values: (string | number)[] }) {
    return this.SelectIn<IAvailableJob[]>(
      'AvailableJob',
      new Fx.In(filter.property, filter.values)
    );
  }
  public SelectScheduledJobsIn(filter: { property: 'machineNumber'; values: (string | number)[] }) {
    return this.SelectIn<ISchedule[]>('Schedule', new Fx.In(filter.property, filter.values));
  }
  public SelectAlerts() {
    return this.SelectAll<IAlert[]>('Alerts');
  }
  public SelectHealth() {
    return this.SelectAll<IHealth[]>('Health');
  }
  public SelectSyncState() {
    return this.SelectAll<ISyncState[]>('SyncState');
  }
  public SelectPendingActionsToAgent() {
    return this.SelectAll<IPendingActionsToAgent[]>('PendingActionsToAgent');
  }
  public SelectAndonSequenceConfig() {
    return this.SelectAll<IAndonSequenceConfig[]>('AndonSequenceConfig');
  }
  public SelectAndonViews() {
    return this.SelectAll<IAndonView[]>('AndonViews');
  }
  public SelectConsumptionHistoryIn(filter: {
    property: 'orderCode' | 'materialCode' | 'toolingCode' | 'coilSerialNumber' | 'ordId';
    values: any[];
  }) {
    return this.SelectIn<IConsumptionHistory[]>(
      'ConsumptionHistory',
      new Fx.In(filter.property, filter.values)
    );
  }
  public SelectTaskFilters() {
    return this.SelectAll<ITaskFacet[]>('TaskFilters');
  }
  public SelectUsersTaskFilters() {
    return this.SelectAll<IUserTaskFilters[]>('UsersTaskFilters');
  }
  public SelectBundleResults() {
    return this.SelectAll<IBundleResult[]>('BundleResult');
  }
  public SelectBundleResultsIn(filter: { property: 'ordId'; values: (string | number)[] }) {
    return this.SelectIn<IBundleResult[]>(
      'BundleResult',
      new Fx.In(filter.property, filter.values)
    );
  }
  public SelectRecentBundles() {
    return this.SelectAll<IRecentBundleResult[]>('RecentBundles');
  }
  public SelectOrderImportEvents() {
    return this.SelectAll<IOrderImportEvent[]>('OrderImportEvents');
  }
  public SelectCoilImportEvents() {
    return this.SelectAll<ICoilImportEvent[]>('CoilImportEvents');
  }
  public SelectOrderImportConfigs() {
    return this.SelectAll<IOrderImportConfig[]>('OrderImportConfigs');
  }
  public SelectCoilImportConfigs() {
    return this.SelectAll<ICoilImportConfig[]>('CoilImportConfigs');
  }
  public SelectExportConfigs() {
    return this.SelectAll<IExportConfig[]>('ExportConfigs');
  }
  public SelectChannelItemStates() {
    return this.SelectAll<IExportEvent[]>('ChannelItemStates');
  }
  public SelectChannelItemStatesIn(filter: { property: string; values: string[] }) {
    return this.SelectIn<IExportEvent[]>(
      'ChannelItemStates',
      new Fx.In(filter.property, filter.values)
    );
  }
  public SelectMaterialImportConfigs() {
    return this.SelectAll<IMaterialImportConfig[]>('MaterialImportConfigs');
  }
  public SelectMaterialImportEvents() {
    return this.SelectAll<IMaterialImportEvent[]>('MaterialImportEvents');
  }
  public SelectScheduleSyncConfigs() {
    return this.SelectAll<IScheduleSyncConfig[]>('ScheduleSyncConfigs');
  }
  public SelectScheduleSyncEvents() {
    return this.SelectAll<IScheduleSyncEvent[]>('ScheduleSyncEvents');
  }
  public SelectCoilValidationConfigs() {
    return this.SelectAll<IExportConfig[]>('CoilValidationConfigs');
  }
  public SelectCoilValidationEvents() {
    return this.SelectAll<IExportEvent[]>('CoilValidationEvents');
  }
  public SelectWebhookConfigs() {
    return this.SelectAll<IWebhookConfig[]>('WebhookConfigs');
  }
  public SelectWebhookEvents() {
    return this.SelectAll<IWebhookEvent[]>('WebhookEvents');
  }
  public SelectExternalConnections() {
    return this.SelectAll<IExternalConnection[]>('ExternalConnections');
  }
  public SelectPrintTemplates() {
    return this.SelectAll<IPrintTemplate[]>('PrintTemplates');
  }
  public SelectMachinePrintConfigs() {
    return this.SelectAll<IMachinePrintConfig[]>('MachinePrintConfigs');
  }
  public SelectInstalledPrinters() {
    return this.SelectAll<IInstalledPrinters>('InstalledPrinters');
  }
  public SelectUpdateInfo() {
    return this.SelectAll<any>('UpdateInfo');
  }
  public SelectSystemAgent() {
    return this.SelectAll<any>('SystemAgent');
  }
  public SelectLicense() {
    return this.SelectAll<ILicense>('License');
  }

  public SelectBundlerRules() {
    return this.SelectAll<IBundlingRulesDocument>('BundlingRulesDocument');
  }

  public SelectDevices() {
    return this.SelectAll<IDevice[]>('Devices');
  }

  public SelectDeviceStates() {
    return this.SelectAll<IDeviceState[]>('DeviceState');
  }
  public SelectDeviceMetrics() {
    return this.SelectAll<IDeviceMetrics[]>('DeviceMetrics');
  }
  public SelectDeviceCurrentShiftStatistics() {
    return this.SelectAll<IDeviceShiftStatistics[]>('DeviceStatisticsByDay');
  }

  public SelectWallboardDevices() {
    return this.SelectAll<IWallboardDevice[]>('WallboardDevices');
  }

  public SelectWarehouseViewModel() {
    return this.SelectAll<WarehouseViewModel>('WarehouseViewModel');
  }

  public SelectCoilDtosIn(filter: { property: 'MaterialCode'; values: string[] }) {
    let coilsObs = this.SelectIn<ICoilDto[]>('Coil', new Fx.In(filter.property, filter.values));
    let locationObs = this.SelectLocations();

    return coilsObs.pipe(
      combineLatestWith(locationObs),
      map(([coils, locs]) => {
        return coils.map((c) => {
          let loc = locs.find((l) => l.id === c.locationId);
          return { ...c, location: loc };
        });
      })
    );
  }

  //This logic should be combined with the above. Maybe using the Fx.All filter
  public SelectCoilDtos() {
    let coilsObs = this.SelectAll<ICoilDto[]>('Coil');
    let locationObs = this.SelectLocations();

    return coilsObs.pipe(
      combineLatestWith(locationObs),
      map(([coils, locs]) =>
        coils.map((c) => ({
          ...c,
          location: locs.find((l) => l.id === c.locationId),
        }))
      )
    );
  }
  public SelectProductionSummaryReport() {
    return this.store
      .select((state: IAppState) => state.data.ProductionSummaryReport)
      .pipe(map((data) => data));
  }

  public SelectUsers() {
    return this.SelectAll<IUser[]>('Users');
  }

  public SelectTooling() {
    return this.SelectAll<ToolingHeader[]>('ToolingItems');
  }
  public SelectPunchPatterns() {
    return this.SelectAll<IPunchPattern[]>('PunchPatterns');
  }
  public SelectProductionEventsIn(filter: {
    property: 'machineNumber' | 'shiftCode' | 'eventTitle';
    values: number[];
  }) {
    return this.SelectIn<IProductionEvent>(
      'ProductionEvents',
      new Fx.In(filter.property, filter.values)
    );
  }
}

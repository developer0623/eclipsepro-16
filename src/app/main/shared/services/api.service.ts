import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ams } from 'src/app/amsconfig';
import { Fx, IScheduleEstimate } from 'src/app/core/dto';
import { initializeAction } from './clientData.actions';
import {
  addExplorerDataAction,
  setExplorerAvailableDateRangeAction,
} from './store/productionexplorer/actions';
import {
  addDeviceExplorerDataAction,
  setDeviceExplorerAvailableDateRangeAction,
} from './store/deviceexplorer/actions';
import {
  IDeviceExplorerDataRecord,
  IExplorerDataRecord,
  IDateRange,
} from './store/productionexplorer/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = `${Ams.Config.BASE_URL}/api/`;
  jobsUrl = `${Ams.Config.BASE_URL}/_api/`;
  reportsUrl = `${this.jobsUrl}reports/`;
  collectionApiMap = {
    ReasonCode: `${this.jobsUrl}warehouse/reasons`,
    Location: `${this.jobsUrl}warehouse/locations`,
    MaterialTask: `${this.jobsUrl}warehouse/tasks`,
    SystemPreferences: `${this.baseUrl}systemPreferences`,
    Machine: `${this.baseUrl}machine`,
    UnlicensedMachine: `${this.baseUrl}machine/.unlicensed`,
    License: `${this.baseUrl}license`,
    MetricDefinition: `${this.baseUrl}metricDefinitions`,
    MachineState: `${this.baseUrl}machine/state`,
    MachineStatistics: `${this.baseUrl}machine/statistics/shift/current`,
    MachineStatisticsHistory: `${this.baseUrl}machine/statistics/hist`,
    MachineMetricSettings: `${this.baseUrl}machine/metricsettings`,
    MachineScheduleSummary: `${this.baseUrl}machine/schedule/summary`,
    MachineSchedule: `${this.baseUrl}machineschedule`,
    Coil: `${this.baseUrl}coils`,
    CoilTypes: `${this.baseUrl}material`,
    JobSummary: `${this.baseUrl}jobSummaries`,
    JobDetail: `${this.baseUrl}jobDetails`,
    ScheduledDowntimeDefinition: `${this.baseUrl}scheduledDowntimeDefinitions`,
    AvailableJob: `${this.jobsUrl}availablejobs`,
    Schedule: `${this.jobsUrl}schedules`,
    Coiltypes: `${this.jobsUrl}coiltype`,
    ToolingItems: `${this.jobsUrl}tooling`,
    Alerts: `${this.baseUrl}alerts`,
    AndonSequenceConfig: `${this.baseUrl}andonSequences`,
    AndonViews: `${this.baseUrl}andonPanelList`,
    ConsumptionHistory: `${this.baseUrl}consumptionSummary`,
    TaskFilters: `${this.jobsUrl}warehouse/facets/tasks`,
    UsersTaskFilters: `${this.jobsUrl}warehouse/users/taskfilters`,
    AvailableJobColumns: `${this.jobsUrl}user/settings/availableJobColumns`,
    ScheduledJobColumns: `${this.jobsUrl}user/settings/scheduledJobColumns`,
    OrderImportEvents: `${this.jobsUrl}integration/orderImportEvents`,
    CoilImportEvents: `${this.jobsUrl}integration/coilImportEvents`,
    OrderImportConfigs: `${this.jobsUrl}integration/orderImportConfigs`,
    CoilImportConfigs: `${this.jobsUrl}integration/coilImportConfigs`,
    ExportConfigs: `${this.jobsUrl}integration/exportConfigs`,
    ChannelItemStates: `${this.jobsUrl}integration/exportEvents`,
    MaterialImportConfigs: `${this.jobsUrl}integration/materialImportConfigs`,
    MaterialImportEvents: `${this.jobsUrl}integration/materialImportEvents`,
    ScheduleSyncConfigs: `${this.jobsUrl}integration/scheduleSyncConfigs`,
    ScheduleSyncEvents: `${this.jobsUrl}integration/scheduleSyncEvents`,
    CoilValidationConfigs: `${this.jobsUrl}integration/coilValidationConfigs`,
    CoilValidationEvents: `${this.jobsUrl}integration/coilValidationEvents`,
    WebhookConfigs: `${this.jobsUrl}integration/webhookConfigs`,
    WebhookEvents: `${this.jobsUrl}integration/webhookEvents`,
    ExternalConnections: `${this.jobsUrl}integration/externalConnections`,
    SystemInfo: `${this.baseUrl}systemInfo`,
    UpdateInfo: `${this.baseUrl}checkUpdate`,
    SystemAgent: `${this.baseUrl}agentStatus`,
    Health: `${this.baseUrl}system/health`,
    SyncState: `${this.baseUrl}system/syncStates`,
    PendingActionsToAgent: `${this.baseUrl}system/pendingActionsToAgent`,
    BundlingRulesDocument: `${this.jobsUrl}integration/bundlerRules`,
    BundleResult: `${this.baseUrl}bundleResults`,
    RecentBundles: `${this.jobsUrl}bundle/recentBundles`,
    PrintTemplates: `${this.jobsUrl}printing/printTemplates`,
    MachinePrintConfigs: `${this.jobsUrl}printing/machinePrintConfigs`,
    InstalledPrinters: `${this.jobsUrl}printing/installedPrinters`,
    Devices: `${this.jobsUrl}device`,
    DeviceState: `${this.jobsUrl}device/state`,
    DeviceStatisticsByDay: `${this.jobsUrl}device/statistics`,
    DeviceMetrics: `${this.jobsUrl}device/metrics`,
    WallboardDevices: `${this.baseUrl}wallboards/registeredDevices`,
    Users: `${this.jobsUrl}users`,
    Folders: `${this.jobsUrl}folders`,
    ExpressCommState: `${this.baseUrl}express/commstate`,
    ExpressCtrlState: `${this.baseUrl}express/ctrlstate`,
    ProductionEvents: `${this.jobsUrl}productionEvents`,
    PunchPatterns: `${this.jobsUrl}punchpatterns`,
    WarehouseViewModel: `${this.baseUrl}wallboard/warehouse`,
    MaterialColors: `${this.baseUrl}materialcolors`,
    MaterialTypes: `${this.baseUrl}materialtypes`,
  };

  constructor(private http: HttpClient, private store: Store) {}

  fetchData<T>(collection: string, queryArgs: { skip: number; take: number; type?: string }) {
    let params = new HttpParams();
    Object.keys(queryArgs).forEach((key) => {
      if (queryArgs[key] !== undefined && queryArgs[key] !== null) {
        params = params.set(key, queryArgs[key].toString());
      }
    });

    this.http.get(this.collectionApiMap[collection], { params }).subscribe({
      next: (data: T | T[]) => {
        this.store.dispatch(initializeAction({ collection, payload: data }));
        if (Array.isArray(data)) {
          if (data.length >= queryArgs.take - 10) {
            this.fetchData(collection, {
              ...queryArgs,
              skip: queryArgs.skip + data.length,
              take: queryArgs.take,
            });
          }
        }
      },
      error: (error) => {
        console.error('API call failed:', error);
      },
    });
  }

  fetchColumns(collection: string, queryArgs: { skip: number; take: number; type?: string }) {
    let params = new HttpParams();
    Object.keys(queryArgs).forEach((key) => {
      if (queryArgs[key] !== undefined && queryArgs[key] !== null) {
        params = params.set(key, queryArgs[key].toString());
      }
    });

    return this.http.get(this.collectionApiMap[collection], { params });
  }

  preLoad<T>(collection: string, filterDef: Fx.FilterDef) {
    this.fetchData<T>(collection, Object.assign({ skip: 0, take: 1000 }, filterDef));
  }

  updateColumns<T>(collection: string, columns: T[]) {
    return this.http.post(this.collectionApiMap[collection], { data: columns });
  }

  updateScheduleJobs(data) {
    return this.http.post<IScheduleEstimate[]>(`${Ams.Config.BASE_URL}/_api/scheduleJob`, { data });
  }

  removeScheduleJobs(data) {
    return this.http.post<IScheduleEstimate[]>(`${Ams.Config.BASE_URL}/_api/removeScheduledJob`, {
      data,
    });
  }

  fetchExploreData(queryArgs: { skip: number; take: number; startDate: Date; endDate: Date }) {
    let params = new HttpParams();
    Object.keys(queryArgs).forEach((key) => {
      if (queryArgs[key] !== undefined && queryArgs[key] !== null) {
        params = params.set(key, queryArgs[key].toString());
      }
    });

    this.http.get(`${Ams.Config.BASE_URL}/api/productionexplorer`, { params }).subscribe({
      next: (data: IExplorerDataRecord[]) => {
        this.store.dispatch(addExplorerDataAction({ payload: data }));
        if (data.length >= queryArgs.take - 10) {
          this.fetchExploreData({
            ...queryArgs,
            skip: queryArgs.skip + data.length,
            take: queryArgs.take,
          });
        }
      },
      error: (error) => {
        console.error('API call failed:', error);
      },
    });
  }

  fetchExploreAvailableRange() {
    this.http.get(`${Ams.Config.BASE_URL}/api/productionexplorer/range`).subscribe({
      next: (data: IDateRange) => {
        this.store.dispatch(
          setExplorerAvailableDateRangeAction({
            payload: { maxDate: new Date(data.maxDate), minDate: new Date(data.minDate) },
          })
        );
      },
      error: (error) => {
        console.error('API call failed:', error);
      },
    });
  }

  fetchDeviceExploreData(queryArgs: {
    skip: number;
    take: number;
    startDate: Date;
    endDate: Date;
  }) {
    let params = new HttpParams();
    Object.keys(queryArgs).forEach((key) => {
      if (queryArgs[key] !== undefined && queryArgs[key] !== null) {
        params = params.set(key, queryArgs[key].toString());
      }
    });

    this.http.get(`${Ams.Config.BASE_URL}/api/productionexplorer/device`, { params }).subscribe({
      next: (data: IDeviceExplorerDataRecord[]) => {
        this.store.dispatch(addDeviceExplorerDataAction({ payload: data }));
        if (data.length >= queryArgs.take - 10) {
          this.fetchDeviceExploreData({
            ...queryArgs,
            skip: queryArgs.skip + data.length,
            take: queryArgs.take,
          });
        }
      },
      error: (error) => {
        console.error('API call failed:', error);
      },
    });
  }

  fetchDeviceExploreAvailableRange() {
    this.http.get(`${Ams.Config.BASE_URL}/api/productionexplorer/device/range`).subscribe({
      next: (data: IDateRange) => {
        this.store.dispatch(
          setDeviceExplorerAvailableDateRangeAction({
            payload: { maxDate: new Date(data.maxDate), minDate: new Date(data.minDate) },
          })
        );
      },
      error: (error) => {
        console.error('API call failed:', error);
      },
    });
  }
}

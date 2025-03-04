import { createReducer, on, props } from '@ngrx/store';

import * as clientDataActions from './clientData.actions';
import { patchJobsAction } from './store/scheduler/actions';
import {
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
  Fx,
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
  IUpdateInfo,
} from 'src/app/core/dto';
import { BundleRules } from './store/order/selectors';

let _putOne = <T extends { id: string | number }>(
  state: Array<T>,
  payload: T,
  collection: string
): Array<T> => {
  if (typeof payload !== 'object') {
    //we should fix the server but not crash if we get bad data.
    console.error('`payload` is not an object', payload);
    return state;
  }
  if (!('id' in payload)) {
    console.error(payload);
    throw "object in collection '" + collection + "' does not have 'id' property";
  }
  let tobj = state.find((t) => t.id === payload.id);
  if (tobj) {
    return state.map((t) => (t.id === payload.id ? payload : t));
  } else {
    return [...state, payload];
  }
};
let _delOne = <T extends { id: string | number }>(
  state: Array<T>,
  id: string,
  collection: string
) => {
  // Sometimes ids have the document type and sometimes they don't

  // todo: this doesn't belong here. Find a better place.
  // This collection is sourced from a raven artificial document. It seems that those get deleted and recreated (at least this one).
  // When that happens, the screen flashes.
  if (collection === 'MachineStatistics') {
    return state;
  }
  let idOnly = id.indexOf('/') > 0 ? id.substring(id.indexOf('/') + 1) : id;
  return state.filter((t) => t.id !== id && t.id !== idOnly);
};

const singletons = [
  'SystemPreferences',
  'UpdateInfo',
  'SystemAgent',
  'BundlingRulesDocument',
  'MetricDefinition',
  'Alerts',
  'AndonViews',
  'TaskFilters',
  'InstalledPrinters',
  'License',
  'ExpressCommState',
  'WarehouseViewModel',
  'MaterialColors',
  'MaterialTypes',
];

const appends = ['JobSummary', 'JobDetail', 'AvailableJob'];

export interface ICollections {
  ReasonCode: IReasonCode[];
  Location: ILocation[];
  MaterialTask: ITask[];
  SystemPreferences: ISystemPreferences;
  UpdateInfo: IUpdateInfo;
  SystemAgent?: any;
  BundlingRulesDocument: IBundlingRulesDocument;
  Machine: IMachine[];
  MetricDefinition: IMetricDefinition[];
  MachineState: IMachineStateDto[];
  MachineStatistics: IRollformingStatistics[];
  MachineStatisticsHistory: IStatisticsHistory[];
  MachineMetricSettings: IMachineMetricSettings[];
  MachineScheduleSummary: IScheduleSummary[];
  MachineSchedule: IScheduleEstimate[];
  Coil: ICoilDto[];
  CoilTypes: IMaterialDto[];
  JobSummary: IJobSummaryDto[];
  JobDetail: IJobDetailDto[];
  ScheduledDowntimeDefinition: IScheduledDowntimeDto[];
  AvailableJob: IAvailableJob[];
  Schedule: ISchedule[];
  Alerts: IAlert[];
  Health: IHealth[];
  PendingActionsToAgent: IPendingActionsToAgent[];
  SyncState: ISyncState[];
  AndonSequenceConfig: IAndonSequenceConfig[];
  AndonViews: IAndonView[];
  ConsumptionHistory: IConsumptionHistory[];
  TaskFilters: ITaskFacet[];
  UsersTaskFilters: IUserTaskFilters[];
  BundleResult: IBundleResult[];
  OrderImportEvents: IOrderImportEvent[];
  CoilImportEvents: ICoilImportEvent[];
  OrderImportConfigs: IOrderImportConfig[];
  CoilImportConfigs: ICoilImportConfig[];
  ExportConfigs: IExportConfig[];
  ChannelItemStates: IExportEvent[];
  MaterialImportConfigs: IMaterialImportConfig[];
  MaterialImportEvents: IMaterialImportEvent[];
  ScheduleSyncConfigs: IScheduleSyncConfig[];
  ScheduleSyncEvents: IScheduleSyncEvent[];
  Devices: IDevice[];
  DeviceState: IDeviceState[];
  DeviceMetrics: IDeviceMetrics[];
  DeviceStatisticsByDay: IDeviceShiftStatistics[];
  CoilValidationConfigs: IExportConfig[];
  CoilValidationEvents: IExportEvent[];
  WebhookConfigs: IWebhookConfig[];
  ExternalConnections: IExternalConnection[];
  WebhookEvents: IWebhookEvent[];
  RecentBundles: IRecentBundleResult[];
  PrintTemplates: IPrintTemplate[];
  MachinePrintConfigs: IMachinePrintConfig[];
  InstalledPrinters: IInstalledPrinters;
  UnlicensedMachine: IMachine[];
  License: ILicense;
  WallboardDevices: IWallboardDevice[];
  Users: IUser[];
  BundleRules: BundleRules[];
  Folders: IPathfinderMachine[];
  ToolingItems: ToolingHeader[];
  ToolingDefs: ToolingDef[];
  ExpressCommState: ExpressCommState;
  ExpressCtrlState: ExpressCtrlState[];
  ProductionEvents: IProductionEvent[];
  PunchPatterns: IPunchPattern[];
  WarehouseViewModel: WarehouseViewModel;
  MaterialColors: IMaterialColor[];
  MaterialTypes: IMaterialType[];
}

const initCollections: ICollections = {
  ReasonCode: [],
  Location: [],
  MaterialTask: [],
  SystemPreferences: {
    systemLanguage: 'en',
    allowPrereleaseVersions: false,
    inchesUnit: 'in',
    intranetUrl: null,
    redirectFromLocalhost: false,
    allowGuestUser: false,
    plantName: '',
    showMaterialShortageAlerts: false,
    enableMaterialTasks: false,
  },
  UpdateInfo: {} as IUpdateInfo,
  BundlingRulesDocument: {
    systemLevel: {
      maxWeightLbs: 0,
      maxPieceCount: 0,
      minPctOfMaxLength: 0,
      itemSort: null,
    },
    customerRules: {},
    toolingDefRules: {},
    materialToolingRules: [],
    customerToolingRules: [],
  },
  Machine: [],
  MetricDefinition: [],
  MachineState: [],
  MachineStatistics: [],
  MachineStatisticsHistory: [],
  MachineMetricSettings: [],
  MachineScheduleSummary: [],
  MachineSchedule: [],
  Coil: [],
  CoilTypes: [],
  JobSummary: [],
  JobDetail: [],
  ScheduledDowntimeDefinition: [],
  AvailableJob: [],
  Schedule: [],
  Alerts: [],
  Health: [],
  PendingActionsToAgent: [],
  SyncState: [],
  AndonSequenceConfig: [],
  AndonViews: [],
  ConsumptionHistory: [],
  TaskFilters: [],
  UsersTaskFilters: [],
  BundleResult: [],
  OrderImportEvents: [],
  CoilImportEvents: [],
  OrderImportConfigs: [],
  CoilImportConfigs: [],
  ExportConfigs: [],
  ChannelItemStates: [],
  MaterialImportConfigs: [],
  MaterialImportEvents: [],
  ScheduleSyncConfigs: [],
  ScheduleSyncEvents: [],
  Devices: [],
  DeviceState: [],
  DeviceMetrics: [],
  DeviceStatisticsByDay: [],
  CoilValidationConfigs: [],
  CoilValidationEvents: [],
  WebhookConfigs: [],
  ExternalConnections: [],
  WebhookEvents: [],
  RecentBundles: [],
  PrintTemplates: [],
  MachinePrintConfigs: [],
  InstalledPrinters: {
    printers: [],
  },
  UnlicensedMachine: [],
  License: {
    serverId: '',
    lastUpdate: '',
    updateCount: 0,
    modules: [],
    machines: [],
  },
  WallboardDevices: [],
  Users: [],
  BundleRules: [],
  Folders: [],
  ToolingItems: [],
  ToolingDefs: [],
  ExpressCommState: {
    id: 'ExpressCommState',
  },
  ExpressCtrlState: [],
  ProductionEvents: [],
  PunchPatterns: [],
  WarehouseViewModel: {
    id: 'WarehouseViewModel',
    activeTasks: [],
    completeTasks: [],
    readyTasks: [],
  },
  MaterialColors: [],
  MaterialTypes: [],
};

export const collectionReducer = createReducer(
  initCollections,
  on(
    clientDataActions.putAction,
    (state: ICollections, { collection, payload }: { collection: string; payload: any }) => {
      if (!singletons.includes(collection)) {
        return {
          ...state,
          [collection]: _putOne(state[collection], payload, collection),
        };
      }
      return {
        ...state,
        [collection]: payload,
      };
    }
  ),
  on(
    clientDataActions.delAction,
    (state: ICollections, { collection, id }: { collection: string; id: string }) => {
      if (!singletons.includes(collection)) {
        return {
          ...state,
          [collection]: _delOne(state[collection], id, collection),
        };
      }
      return { ...state };
    }
  ),
  on(
    clientDataActions.initializeAction,
    (state: ICollections, { collection, payload }: { collection: string; payload: any }) => {
      if (!singletons.includes(collection)) {
        return {
          ...state,
          [collection]: payload.reduce((state, obj) => {
            return _putOne(state, obj, collection);
          }, state[collection]),
        };
      }
      return {
        ...state,
        [collection]: payload,
      };
    }
  ),
  on(
    clientDataActions.chopAction,
    (
      state: ICollections,
      { collection, payload }: { collection: string; payload: Fx.Subscription[] }
    ) => {
      if (singletons.includes(collection)) {
        return state;
      }
      const chopFilter = payload
        .map((s) => Fx.toFilterExpr(s.filterDef))
        .reduce(
          (acc, filt) => (t) => acc(t) || filt(t),
          (_) => false
        );
      return {
        ...state,
        [collection]: state[collection].filter(chopFilter),
      };
    }
  ),
  on(patchJobsAction, (state: ICollections, { ordIds, collection, patch }) => {
    if (!appends.includes(collection)) {
      return state;
    }
    const newJobs = state[collection].map((x) => {
      if (Array.isArray(ordIds)) {
        if (ordIds.includes(x.ordId)) {
          return { ...x, ...patch };
        }
      } else if (ordIds === x.ordId) {
        return { ...x, ...patch };
      }

      return x;
    });
    return {
      ...state,
      [collection]: newJobs,
    };
  })
);

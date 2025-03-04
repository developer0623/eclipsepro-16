import { ICollections } from '../clientData.reducers';
import {
  ISystemInfo,
  Fx,
  IAvailableJobColumn,
  IScheduledJobColumn,
  IUserSession,
  ISingleOrderState,
  IProductionSummaryReportRecord,
} from 'src/app/core/dto';
import { IExplorerDataModel, IDeviceExplorerDataModel } from './productionexplorer/models';
import { SchedulingSpeed, JobsInFlightState } from './scheduler/reducers';

export interface IAppState {
  data: {
    collections: ICollections;
    SystemInfo: ISystemInfo;
    Subscriptions: Fx.Subscription[];
    AvailableJobColumns: IAvailableJobColumn[];
    ScheduledJobColumns: IScheduledJobColumn[];
    ProductionSummaryReport: IProductionSummaryReportRecord[];
    UserSession: IUserSession | null;
    ExplorerData: IExplorerDataModel;
    DeviceExplorerData: IDeviceExplorerDataModel;
    // DebugCollectionMetrics: DebugCollectionMetricsReducer,
    // DebugActionMetrics: DebugActionMetricsReducer,
    SingleOrder: ISingleOrderState | null;
    SchedulingSpeed: SchedulingSpeed;
    SelectedJobs: number[];
    SummarizedJobs: number[];
    JobsInFlight: JobsInFlightState;
  };
}

import { IAppState } from '../store.dto';
import { IDeviceExplorerDataModel } from '../productionexplorer/models';

export const selectDeviceExplorerData = (store: IAppState) => store.data.DeviceExplorerData;

export const mapDeviceData = (data: IDeviceExplorerDataModel) => {
  return {
    ...data,
    explorerData: data.explorerData,
  };
};

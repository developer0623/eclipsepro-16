import { IAppState } from '../store.dto';
import { IExplorerDataModel } from './models';

export const selectExplorerData = (store: IAppState) => store.data.ExplorerData;

export function updateLocalUnits(unitsService) {
  return (data: IExplorerDataModel) => {
    const localFtType = unitsService.getUserUnits('ft');
    const localInType = localFtType === 'ft' ? 'ft' : 'cm';
    return {
      ...data,
      explorerData: data.explorerData.map((record) => ({
        ...record,
        goodLocal: unitsService.convertUnits(record.goodFt, 'ft', 0, localFtType),
        scrapLengthLocal: unitsService.convertUnits(record.scrapLengthFt, 'ft', 0, localFtType),
        partLengthLocal: unitsService.convertUnits(record.partLengthIn, 'in', 1, localInType),
      })),
    };
  };
}

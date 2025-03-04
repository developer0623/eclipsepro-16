import { IAppState } from '../store.dto';

export const selectSystemInfo = (state: IAppState) => state.data.SystemInfo;
export const selectSystemPreferences = (state: IAppState) =>
  state.data.collections.SystemPreferences;

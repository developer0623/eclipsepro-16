import { createSelector } from '@ngrx/store';
import { IAppState } from '../store.dto';

export const selectLicense = (state: IAppState) => state.data.collections.License;

const by =
  <T>(selector: (item: T) => any) =>
  (a: T, b: T) =>
    selector(a) > selector(b) ? 1 : -1;

export const selectLicenseVM = createSelector(selectLicense, (license) => ({
  ...license,
  machines: [...license.machines].sort(by((m) => m.unitNum)), // Copy to avoid mutating state
  modules: [...license.modules].sort(by((m) => m.name)),
}));

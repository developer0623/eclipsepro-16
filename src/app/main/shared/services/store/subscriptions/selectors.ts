import { IAppState } from '../store.dto';

export const selectSubscriptions = (state: IAppState) => state.data.Subscriptions;

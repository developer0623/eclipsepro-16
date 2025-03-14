import { createSelector } from '@ngrx/store';
import { IAppState } from '../../shared/services/store/store.dto';

const selectToolingDefs = (state: IAppState) => state.data.collections.ToolingDefs;
export const selectSingleTooling = (toolingCode: string) =>
  createSelector(selectToolingDefs, (toolingDefs) => {
    if (!toolingDefs) return null;

    const td = toolingDefs.find((t) => t.toolingCode === toolingCode);
    if (!td) return null;

    return {
      ...td,
      machines: td.machines.map((m) => ({
        ...m,
        name: m.machineName, // Transforming machine data
      })),
    };
  });

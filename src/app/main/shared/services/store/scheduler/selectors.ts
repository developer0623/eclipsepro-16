import * as moment from 'moment';
import * as _ from 'lodash';
import { createSelector } from '@ngrx/store';
import { IAppState } from '../store.dto';
import {
  IScheduleItem,
  IScheduledJobColumn,
  IJobSummaryDto,
  IAvailableJob,
  RangeValue,
  ScheduledJobGridItem,
} from 'src/app/core/dto';
import {
  appendSummarizer2,
  toolingColor,
  materialColor,
  jobColor,
  JobsInFlightState,
} from './reducers';

export const selectMachines = (store: IAppState) => store.data.collections.Machine;
export const selectAvailableJobColumns = (store: IAppState) => store.data.AvailableJobColumns;
export const selectScheduledJobColumns = (store: IAppState) => store.data.ScheduledJobColumns;
export const selectScheduledJobs = (store: IAppState) => store.data.collections.Schedule;
export const selectAvailableJobs = (store: IAppState) => store.data.collections.AvailableJob;
export const selectAlerts = (store: IAppState) => store.data.collections.Alerts;

export const selectJobsInFlight = (store: IAppState) => store.data.JobsInFlight;
export const selectSchedulingSpeed = (store: IAppState) => store.data.SchedulingSpeed;
export const selectSelectedJobs = (store: IAppState) => store.data.SelectedJobs;
export const selectSummarizedJobs = (store: IAppState) => store.data.SummarizedJobs;

export const selectSchedule = (store: IAppState) => store.data.collections.Schedule;

type AssignedJobsGridDataType = ReturnType<ReturnType<typeof AssignedJobsGridData>>;

export const AssignedJobsGridData =
  (machineNumber: number) => (scheduledJobs, selectedJobs, jobsInFlight) => {
    const schedule = scheduledJobs.find((s) => s.machineNumber === machineNumber);

    const sJobs = !schedule ? [] : schedule.sequence;

    const gridData = sJobs
      // How do I make this automatically be of type (ISchedule & IJobSummaryDto)?
      .map((x) => ({
        ...x.job,
        ...x,
        completePct: x.job.completeFt / x.job.totalFt,
        isSelected: selectedJobs.includes(x.ordId),
        inFlight: jobsInFlight.fliers.includes(x.ordId),
        requiredDateDisplay: x.job.requiredDate
          ? moment(x.job.requiredDate).format('YYYY-MM-DD')
          : '<none>',
        importDateDisplay: x.job.importDate
          ? moment(x.job.importDate).format('YYYY-MM-DD')
          : '<none>',
        shipDateDisplay: x.job.shipDate ? moment(x.job.shipDate).format('YYYY-MM-DD') : '<none>',
      }))
      // Remove the extra job property that came from the server
      .map(({ job, ...rest }) => rest);

    const selected = gridData.filter((j) => j.isSelected);
    return {
      gridData: gridData,
      summary: {
        count: gridData.length,
        totalFt: gridData.reduce((acc, j) => j.totalFt + acc, 0),
        jobIds: gridData.map((j) => j.ordId),
        heldJobIds: gridData.filter((j) => j.hold).map((j) => j.ordId),
        notHeldJobIds: gridData.filter((j) => !j.hold).map((j) => j.ordId),
      },
      selectedSummary: {
        count: selected.length,
        totalFt: selected.reduce((acc, j) => j.totalFt + acc, 0),
        jobIds: selected.map((j) => j.ordId),
        heldJobIds: selected.filter((j) => j.hold).map((j) => j.ordId),
        notHeldJobIds: selected.filter((j) => !j.hold).map((j) => j.ordId),
      },
    };
  };

export type SJT = {
  key: string | RangeValue;
  keyColumn: { fieldName: string; color: string };
  jobs: (IScheduleItem & IJobSummaryDto & { isSelected: boolean })[];
  items: SJT[];
  jobIds: number[];
  id: string;
  isSelected: boolean;
  href: string;
  srefObj?: { sref: string; param: any };
  isSummaryRow: boolean;
  summary: any;
};

function groupWhile<T, TKey>(array: T[], keyselector: (t: T) => TKey) {
  const seed: { key: TKey; items: T[] }[] = [];
  return array.reduce((acc, cur) => {
    let key = keyselector(cur);

    if (acc.length > 0 && acc[acc.length - 1].key === key) {
      let end = acc[acc.length - 1];

      end.items.push(cur);

      acc.splice(acc.length - 1, 1, end);

      return acc;
    }
    return [...acc, { key, items: [cur] }];
  }, seed);
}
function buildSummaryItem(items: ScheduledJobGridItem[], columns: IScheduledJobColumn[]): SJT {
  let [keyColumn, ...remainingColumns] = columns;
  const key = keyColumn.summarizer(items, keyColumn);
  return {
    key: key,
    keyColumn: keyColumn,
    jobs: items,
    items: remainingColumns.length > 0 ? [buildSummaryItem(items, remainingColumns)] : [],
    jobIds: items.map((j) => j.ordId),
    id: key.toString() + columns.length + items.length, // lengths are just because I feel like I need some uniqueness on this id
    isSelected: items.every((j) => j.isSelected),
    href: '',
    isSummaryRow: true,
    summary: toSummaryModel(items),
  };
}

const toSummaryModel = (jobs: ScheduledJobGridItem[]) => ({
  count: jobs.length,
  totalFt: jobs.reduce((sum, j) => sum + j.totalFt, 0),
});

export type ScheduleJobsGridDataModel = ReturnType<typeof mapToScheduleJobsGridDataModel>;

const buildScheduledJobsTree = (
  jobs: ScheduledJobGridItem[],
  jobsTitles: IScheduledJobColumn[],
  $state,
  summarizedJobs
): SJT[] => {
  if (jobsTitles.length > 0) {
    let [keyColumn, ...remainingColumns] = jobsTitles;
    let groups = groupWhile(jobs, (j) => j[keyColumn.fieldName]);
    return groups.map((grp, i) => {
      const jobIds = grp.items.map((j) => j.ordId);
      const isSummaryRow = jobIds.every((jobid) => summarizedJobs.indexOf(jobid) !== -1);
      return {
        key: grp.key,
        keyColumn,
        jobs: grp.items,
        items: isSummaryRow
          ? [buildSummaryItem(grp.items, remainingColumns)]
          : buildScheduledJobsTree(grp.items, remainingColumns, $state, summarizedJobs),
        jobIds: jobIds,
        id: grp.key + ':' + i,
        isSelected: grp.items.every((j) => j.isSelected),
        href:
          keyColumn.fieldName === 'orderCode'
            ? $state.href('app.orders.detail', { id: grp.items[0].ordId })
            : keyColumn.fieldName === 'materialCode'
            ? $state.href('app.inventory.coil-types.coil-type', {
                id: grp.items[0].materialCode,
              })
            : '',
        srefObj:
          keyColumn.fieldName === 'orderCode'
            ? { sref: 'app.orders.detail', param: { id: grp.items[0].ordId } }
            : keyColumn.fieldName === 'materialCode'
            ? {
                sref: 'app.inventory.coil-types.coil-type',
                param: {
                  id: grp.items[0].materialCode,
                },
              }
            : undefined,
        isSummaryRow: isSummaryRow,
        summary: toSummaryModel(grp.items),
      };
    });
  } else return [];
};
export const mapToScheduleJobsGridDataModel = (
  jobs: AssignedJobsGridDataType,
  columns: IScheduledJobColumn[],
  $state,
  summarizedJobs: number[]
) => {
  let dateClosure: Date = null;
  let sortedJobs = _.orderBy(jobs.gridData, 'sequenceNum', 'asc')
    .map((job, i) => {
      return {
        ...job,
        mainIndex: i,
        pastDueDate: job.requiredDate && new Date(job.requiredDate) < new Date(Date.now()),
        iconColor: 'red-fg',
        warningText: 'Warning: Job is scheduled to be completed after due date!',
        pastDueText: 'Job is Late!',
      };
    })
    .map((j) => {
      const completionDate = moment(j.completionDate).toDate();
      return {
        ...j,
        dateChange:
          // We only want to test that the _date_ portion changed, not
          // the time. getDate is kinda cheating, but with this data
          // we know date changes will be consecutive days. getDate
          // ought to be adequate.
          completionDate?.getDate() === dateClosure?.getDate()
            ? undefined
            : (dateClosure = completionDate),
      };
    });

  function newColumn(init: {
    fieldName: keyof ScheduledJobGridItem;
    color: string;
  }): IScheduledJobColumn {
    return {
      ...init,
      name: init.fieldName,
      isChecked: false,
      displayName: init.fieldName,
      units: '',
      summarizer: (items, column) => '<< no summary >>',
    };
  }
  return {
    jobsTree: buildScheduledJobsTree(
      sortedJobs,
      [
        newColumn({
          fieldName: 'isOnMachine',
          color: toolingColor,
        }),
        {
          ...newColumn({
            fieldName: 'toolingCode',
            color: toolingColor,
          }),
          summarizer: appendSummarizer2,
        },
        {
          ...newColumn({
            fieldName: 'materialCode',
            color: materialColor,
          }),
          summarizer: appendSummarizer2,
        },
        newColumn({ fieldName: 'id', color: jobColor }), // using job id as the final column means there is exactly one job in the final items array
      ],
      $state,
      summarizedJobs
    ),
    jobsTreeWide: buildScheduledJobsTree(
      sortedJobs,
      [
        // We always need to start with `isOnMachine` and end with `id` (at least for now)
        newColumn({ fieldName: 'isOnMachine', color: toolingColor }),
        ...columns.filter((x) => x.isChecked),
        newColumn({ fieldName: 'id', color: jobColor }), // using job id as the final column means there is exactly one job in the final items array
      ],
      $state,
      summarizedJobs
    ),
    machineJobsCount: jobs.gridData.filter((j) => j.isOnMachine).length,
    machineJobsFt: jobs.gridData
      .filter((j) => j.isOnMachine)
      .reduce((acc, current) => acc + current.remainingFt, 0),
    summary: jobs.summary,
    selectedSummary: jobs.selectedSummary,
    dates: jobs.gridData.map((j) => j.completionDate),
  };
};

export type ScheduleJobsGridDataModelNew = ReturnType<typeof mapToScheduleJobsGridDataModel>;

export type JobSetSummary = {
  count: number;
  totalFt: number;
  jobIds: number[];
  heldJobIds: number[];
  notHeldJobIds: number[];
};

export type AvailableJobGridItem = IAvailableJob & {
  isSelected: boolean;
  totalFt: number;
  requiredDateDisplay: string;
  importDateDisplay: string;
  shipDateDisplay: string;
  inFlight: boolean;
  isSummarized?: boolean;
  patternNotDefined?: boolean;
};

export const AvailableJobsGridData =
  (machineId: number) =>
  (
    avaJobs: IAvailableJob[],
    selectedJobs: number[],
    jobsInFlight: JobsInFlightState,
    summarizedJobs: number[]
  ) => {
    const availableJobs = avaJobs.filter((sj) => sj.machineNumber === machineId);

    const mapFootageToDisplayPreference = (lengthFt: number) =>
      // TODO: Convert this value to the system preference for footage display.
      Math.round(lengthFt);

    const gridData: AvailableJobGridItem[] = availableJobs.map((x) => ({
      ...x,
      totalFt: mapFootageToDisplayPreference(x.totalFt),
      requiredDateDisplay: x.requiredDate ? moment(x.requiredDate).format('YYYY-MM-DD') : '<none>',
      importDateDisplay: x.importDate ? moment(x.importDate).format('YYYY-MM-DD') : '<none>',
      shipDateDisplay: x.shipDate ? moment(x.shipDate).format('YYYY-MM-DD') : '<none>',
      isSelected: selectedJobs.includes(x.ordId),
      inFlight: jobsInFlight.fliers.includes(x.ordId),
      isSummarized: summarizedJobs.includes(x.ordId),
      pendingAction: false,
    }));

    const selected = gridData.filter((j) => j.isSelected);
    return {
      gridData,
      totalJobsAvailable: availableJobs.length,
      summary: {
        count: gridData.length,
        totalFt: gridData.reduce((acc, j) => j.totalFt + acc, 0),
        jobIds: gridData.map((j) => j.ordId),
        heldJobIds: gridData.filter((j) => j.hold).map((j) => j.ordId),
        notHeldJobIds: gridData.filter((j) => !j.hold).map((j) => j.ordId),
      },
      selectedSummary: {
        count: selected.length,
        totalFt: selected.reduce((acc, j) => j.totalFt + acc, 0),
        jobIds: selected.map((j) => j.ordId),
        heldJobIds: selected.filter((j) => j.hold).map((j) => j.ordId),
        notHeldJobIds: selected.filter((j) => !j.hold).map((j) => j.ordId),
      },
    };
  };

export const selectDisableScheduler = createSelector(selectAlerts, (alerts) =>
  alerts.some((a) => a.alertType === 'AgentOffline' || a.alertType === 'AgentConfiguration')
);

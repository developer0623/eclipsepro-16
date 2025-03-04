import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { Observable, Subject, of } from 'rxjs';
import { scan, map, filter, combineLatestWith, mergeMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import {
  RangeValue,
  ISchedulerGroupSummary,
  IAvailableJobColumn,
  IAvailableJob,
  IScheduledJobColumn,
  IScheduleEstimate,
} from 'src/app/core/dto';
import {
  AvailableJobGridItem,
  AvailableJobsGridData,
  mapToScheduleJobsGridDataModel,
  AssignedJobsGridData,
  selectAvailableJobColumns,
  selectAvailableJobs,
  selectJobsInFlight,
  selectScheduledJobs,
  selectSelectedJobs,
  selectSummarizedJobs,
  selectScheduledJobColumns,
  selectSchedule,
} from './store/scheduler/selectors';
import { JobsInFlightState } from './store/scheduler/reducers';
import { loadSchdulerColumnsAction } from './store/scheduler/actions';
import { Ams } from 'src/app/amsconfig';
import { ClientDataStore } from './clientData.store';
import { IAppState } from './store/store.dto';

export type AvailableJobsTree = {
  key: string | RangeValue;
  jobs: AvailableJobGridItem[];
  items: AvailableJobsTree[];
  ids: number[];
  id: string;
  style: { width: number; background: string };
  background: string;
  units: string;
  href: string;
  srefObj?: { sref: string; param: any };
  warning: boolean;
  pastDue: Date;
  iconColor: string;
  warningText: string;
  pastDueText: string;
  isSelected: boolean;
  isSummaryRow: boolean;
  patternNotDefined?: boolean;
  summary: ISchedulerGroupSummary;
  fieldName?: string;
};

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private eventSubject = new Subject<boolean>();
  jobsUrl = `${Ams.Config.BASE_URL}/_api/`;
  $state: any;
  constructor(
    public clientDataStore: ClientDataStore,
    // public $state: StateService,
    private store: Store<IAppState>,
    private http: HttpClient
  ) {
    this.store.dispatch(loadSchdulerColumnsAction());
  }

  emitEvent(data: boolean) {
    this.eventSubject.next(data);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }

  isNumber(value) {
    const conv = +value;
    if (conv) {
      return true;
    } else {
      return false;
    }
  }

  private buildSummary(
    jobs: AvailableJobGridItem[],
    columns: IAvailableJobColumn[]
  ): AvailableJobsTree[] {
    const columnWidth = 100 / columns.length;
    // const width = Math.round(columnWidth * 100) / 100 + '%';

    const [keyColumn, ...remainingColumns] = columns;
    const key = keyColumn.summarizer(jobs, keyColumn);
    return [
      {
        key: key,
        jobs,
        items: remainingColumns.length > 0 ? this.buildSummary(jobs, remainingColumns) : [],
        ids: jobs.map((j) => j.ordId),
        id: key + ':',
        style: { width: keyColumn.width, background: keyColumn.color },
        background: keyColumn.color,
        units: keyColumn.units,
        href: '',
        warning: false,
        pastDue: null,
        iconColor: 'red-fg',
        warningText: '',
        pastDueText: '',
        isSelected: jobs.every((j) => j.isSelected),
        isSummaryRow: true,
        summary: this.toSummaryModel(jobs),
        // fieldName: keyColumn.fieldName,
      },
    ];
  }
  private toSummaryModel = (jobs: AvailableJobGridItem[]): ISchedulerGroupSummary => ({
    count: jobs.length,
    totalFt: jobs.reduce((sum, j) => sum + j.totalFt, 0),
  });

  componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ? Math.floor((255 * Math.min(100, num)) / 100) : Math.min(255, num);
  }

  rgbToHex(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result,
      r,
      g,
      b,
      hex = '';
    if ((result = rgbRegex.exec(rgb))) {
      r = this.componentFromStr(result[1], result[2]);
      g = this.componentFromStr(result[3], result[4]);
      b = this.componentFromStr(result[5], result[6]);

      hex = '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
  }

  private buildAvailableJobsTree(
    jobs: AvailableJobGridItem[],
    jobsTitles: IAvailableJobColumn[]
  ): AvailableJobsTree[] {
    const [keyColumn, ...remainingColumns] = jobsTitles;

    // Each node will be rendered as a two column grid. We only need to specify the width (%) of the first
    // column. The second column gets all the rest of the space. Inside that second column will be a nested
    // two column grid. So, from left to right these column width percentages get *bigger* because the nested
    // grid has less columns than it's parent grid.
    const columnWidth = 100 / jobsTitles.length;

    // Round to two decimal places. Only because the original implementation did so.
    // const width = Math.round(columnWidth * 100) / 100 + '%';

    return _(jobs)
      .groupBy((j) => j[keyColumn.fieldName])
      .toPairs()
      .map(([key, jobs]) => {
        const summarize = jobs.every((j) => j.isSummarized);
        let url = '';
        if (keyColumn.fieldName === 'orderCode') {
          url = `/orders/${jobs[0].ordId}`;
        } else if (keyColumn.fieldName === 'materialCode') {
          url = `/inventory/coil-types/${jobs[0].materialCode}`;
        }
        return {
          key,
          jobs,
          items:
            remainingColumns.length > 0
              ? summarize
                ? this.buildSummary(jobs, remainingColumns)
                : this.buildAvailableJobsTree(jobs, remainingColumns)
              : [],
          ids: jobs.map((j) => j.ordId),
          id: key + ':',
          style: { width: keyColumn.width, background: keyColumn.color },
          background: this.rgbToHex(keyColumn.color),
          units: keyColumn.units,
          //this might be better to come from the column definition
          href: url,
          // srefObj:
          //   keyColumn.fieldName === 'orderCode'
          //     ? { sref: 'app.orders.detail', param: { id: jobs[0].ordId } }
          //     : keyColumn.fieldName === 'materialCode'
          //     ? {
          //         sref: 'app.inventory.coil-types.coil-type',
          //         param: {
          //           id: jobs[0].materialCode,
          //         },
          //       }
          //     : undefined,
          warning: keyColumn.fieldName === 'requiredDateDisplay' && jobs[0].warningDueDate,
          pastDue: keyColumn.fieldName === 'requiredDateDisplay' && jobs[0].pastDueDate,
          iconColor: 'red-fg',
          warningText: 'Warning: Job is scheduled to be completed after due date!',
          pastDueText: 'Job is late!',
          isSelected: jobs.every((j) => j.isSelected),
          isSummaryRow: summarize,
          patternNotDefined: jobs[0].patternNotDefined,
          summary: this.toSummaryModel(jobs),
          fieldName: keyColumn.fieldName,
        };
      })
      .sortBy((n) => (this.isNumber(n.key) ? Number(n.key) : n.key))
      .value();
  }

  selectAvailableJobsOldTree(
    machineNumber: number,
    jobFilter$: Observable<string>
  ): Observable<any> {
    return this.store.pipe(
      select(selectAvailableJobColumns),
      combineLatestWith(
        this.store.pipe(select(selectAvailableJobs)),
        this.store.pipe(select(selectSelectedJobs)),
        this.store.pipe(select(selectJobsInFlight)),
        this.store.pipe(select(selectSummarizedJobs)),
        jobFilter$
      ),
      map(([avaColumns, avaJobs, selectedJobs, jobsInFlight, summarizedJobs, jobFilter]) => {
        const gridDataModel = AvailableJobsGridData(machineNumber)(
          avaJobs,
          selectedJobs,
          jobsInFlight,
          summarizedJobs
        );

        let checkedColumns = avaColumns.filter((x) => x.isChecked);
        let filteredJobs = gridDataModel.gridData.filter(
          (job) =>
            checkedColumns
              .map((col) => job[col.fieldName])
              .join()
              .toString()
              .toLowerCase()
              .indexOf(jobFilter.toLowerCase()) > -1
        );

        return {
          jobs: this.buildAvailableJobsTree(filteredJobs, checkedColumns),
          summary: gridDataModel.summary,
          selectedSummary: gridDataModel.selectedSummary,
        };
      })
    );
  }

  distinctArray(obs: Observable<number[]>): Observable<number[]> {
    let seed = { next: <number[]>[], buf: <number[]>[] };
    const reducer = (acc: { next: number[]; buf: number[] }, ids: number[]) => {
      let next = ids.filter((id) => !acc.buf.includes(id));
      return { next, buf: [...next, ...acc.buf] };
    };
    return obs.pipe(
      scan(reducer, seed),
      map((x) => x.next),
      filter((arr) => arr.length > 0)
    );
  }

  takeSubscriptionsForMachine(machineNumber: number) {
    // Subscribe to available and scheduled jobs for this machine...
    const scheduled$ = this.clientDataStore
      .SelectScheduledJobsIn({
        property: 'machineNumber',
        values: [machineNumber],
      })
      .pipe(
        mergeMap((arr) =>
          // map over the array of jobs, and for each job, map its sequence to ordId
          of(...arr.map((j) => j.sequence.map((k) => k.ordId)))
        )
      );

    const available$ = this.clientDataStore.SelectAvailableJobsIn({
      property: 'machineNumber',
      values: [machineNumber],
    });

    // Merge them together, unsubscribing from both at the same time
    return scheduled$.pipe(
      mergeMap(() => available$.pipe(map(() => []))), // emits empty array after available$ completes
      map(() => null) // map final result to null, as the original code does
    );
  }

  selectScheduleJobsOldTree(machineId: number): Observable<any> {
    return this.store.pipe(
      select(selectScheduledJobColumns),
      combineLatestWith(
        this.store.pipe(select(selectSchedule)),
        this.store.pipe(select(selectSelectedJobs)),
        this.store.pipe(select(selectJobsInFlight)),
        this.store.pipe(select(selectSummarizedJobs))
      ),
      map(([scheduledJobColumns, scheduledJobs, selectedJobs, jobsInFlight, summarizedJobs]) => {
        return mapToScheduleJobsGridDataModel(
          AssignedJobsGridData(machineId)(scheduledJobs, selectedJobs, jobsInFlight),
          scheduledJobColumns,
          this.$state,
          summarizedJobs
        );
      })
    );
  }
}

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router  } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map, switchMap } from 'rxjs/operators';
import { IMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { MaterialUsageReportModel, FilterState, DurationType } from '../report-type';
import { TransitionManageService } from '../../shared/services/transition.service';
import { initDate } from '../common';
import { AppService } from '../../shared/services/app.service';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-material-demand',
  templateUrl: './material-demand.component.html',
  styleUrls: ['./material-demand.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MaterialDemandComponent implements OnInit, OnDestroy {
  summaryList: MaterialUsageReportModel = { groups: [] } as MaterialUsageReportModel;

  endDate: moment.Moment = moment();
  startDate: moment.Moment = moment().add(-3, 'months');
  durations: DurationType[] = ['day', 'week', 'month'];
  selectedDuration = this.durations[2];
  scheduleStatusList = ['All', 'Scheduled', 'Unscheduled'];
  selectedScheduleStatus = this.scheduleStatusList[0];
  reportFilterChanges$ = new Subject<
    | { startDate: moment.Moment }
    | { endDate: moment.Moment }
    | { scheduleStatus: string }
    | { duration: DurationType }
    | { isBack: boolean }
  >();
  fileDownloadQueryString: string;
  subscriptions_: Subscription[] = [];
  sortKey = '';
  sortDir = '';
  sortedSummaryList: MaterialUsageReportModel = { groups: [] } as MaterialUsageReportModel;

  constructor(
    public clientDataStore: ClientDataStore,
    public appService: AppService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private transManageService: TransitionManageService
  ) {
    const initialState = this.onGetFilterState();
    const reportFilterReducer = function (
      state = initialState,
      action:
        | { startDate: moment.Moment }
        | { endDate: moment.Moment }
        | { scheduleStatus: string }
        | { duration: DurationType }
        | { isBack: boolean }
    ) {
      return { ...state, ...action };
    };

    const reportFilterSubject$ = new BehaviorSubject(initialState);
    this.reportFilterChanges$
      .pipe(scan(reportFilterReducer, initialState))
      .subscribe((state) => reportFilterSubject$.next(state));
    this.subscriptions_ = [];

    reportFilterSubject$
      .pipe(
        tap(() => appService.setLoading(true)),
        tap((query) => this.updateQueryString(query)),
        map((filters) => {
          const query = {
            ...filters,
            startDate: filters.startDate.format('YYYY-MM-DD'),
            endDate: filters.endDate.format('YYYY-MM-DD'),
          };

          return this.http.get(`${Ams.Config.BASE_URL}/_api/reports/materialdemand`, {
            params: query,
          });
        }),
        switchMap((source) => source)
      )
      .subscribe((summaryList: MaterialUsageReportModel) => {
        this.summaryList = summaryList;
        this.sortedSummaryList = summaryList;
        appService.setLoading(false);
      });
  }

  updateQueryString(query: FilterState) {
    const exportQuery = {
      ...query,
      startDate: query.startDate.format('YYYY-MM-DD'),
      endDate: query.endDate.format('YYYY-MM-DD'),
    };

    if (!query.isBack) {
      this.router.navigate([], {
        queryParams: exportQuery,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }

    let httpParams = new HttpParams({ fromObject: exportQuery });
    this.fileDownloadQueryString = httpParams.toString();
  }

  onChangeDuration(item) {
    this.selectedDuration = item;
    const result = initDate(this.startDate, this.endDate, this.selectedDuration);
    this.startDate = result.startDate;
    this.endDate = result.endDate;
    localStorage.setItem('report.materialDemand.Duration', item);
    this.reportFilterChanges$.next({
      duration: item,
      isBack: false,
    });
  }

  onChangeDate({ startDate, endDate }) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.reportFilterChanges$.next({
      startDate: this.startDate,
      endDate: this.endDate,
      isBack: false,
    });
  }

  onChangeStatus(item) {
    this.selectedScheduleStatus = item;
    this.reportFilterChanges$.next({
      scheduleStatus: item,
      isBack: false,
    });
  }

  onGetFilterState(): FilterState {
    const startDate = this.route.snapshot.paramMap.get('startDate');
    if (startDate) {
      const m = moment(startDate);
      if (m.isValid()) this.startDate = m;
    }
    const endDate = this.route.snapshot.paramMap.get('endDate');
    if (endDate) {
      const m = moment(endDate);
      if (m.isValid()) this.endDate = m;
    }

    let lsDuration = localStorage.getItem('report.materialUsage.Duration');
    const duration = this.route.snapshot.paramMap.get('duration');
    if (duration) {
      this.selectedDuration = duration as DurationType;
    } else if (!!lsDuration) {
      this.selectedDuration = lsDuration as DurationType;
    }

    const scheduleStatus = this.route.snapshot.paramMap.get('scheduleStatus');

    if (scheduleStatus) {
      this.selectedScheduleStatus = scheduleStatus;
    }

    return {
      startDate: this.startDate,
      endDate: this.endDate,
      duration: this.selectedDuration,
      scheduleStatus: this.selectedScheduleStatus,
    };
  }

  onSortBy(val) {
    if (val === this.sortKey) {
      if (this.sortDir === '') {
        this.sortDir = 'asc';
      } else if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else if (this.sortDir === 'desc') {
        this.sortDir = '';
      }
    } else {
      this.sortDir = 'asc';
      this.sortKey = val;
    }

    if (this.sortDir === '') {
      this.sortedSummaryList = this.summaryList;
    } else {
      const groups = _.orderBy(this.summaryList.groups, this.sortKey, this.sortDir as any);
      this.sortedSummaryList = { ...this.sortedSummaryList, groups };
    }
  }

  ngOnInit(): void {
    // this.transition$ = this.transManageService.transitionObs$.subscribe((transition) => {
    //   let transitionOptions: TransitionOptions = transition.options();
    //   if (transitionOptions.source === 'url') {
    //     const filterState = this.onGetFilterState(transition.params());
    //     this.reportFilterChanges$.next({ ...filterState, isBack: true });
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}

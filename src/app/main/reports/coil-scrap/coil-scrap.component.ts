import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router  } from '@angular/router';
import { IMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { CoilSummary, FilterState, DurationType } from '../report-type';
import { TransitionManageService } from '../../shared/services/transition.service';
import { initDate } from '../common';
import { AppService } from '../../shared/services/app.service';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-coil-scrap',
  templateUrl: './coil-scrap.component.html',
  styleUrls: ['./coil-scrap.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CoilScrapComponent implements OnInit, OnDestroy {
  summaryList: CoilSummary[] = [];
  filteredList: CoilSummary[] = [];
  machines: (IMachine & { isChecked: boolean })[] = [];
  endDate: moment.Moment = moment();
  startDate: moment.Moment = moment().add(-1, 'months');
  durations: DurationType[] = ['day', 'week', 'month'];
  selectedDuration = this.durations[0];
  reportFilterChanges$ = new Subject<
    | { startDate: moment.Moment }
    | { endDate: moment.Moment }
    | { machines: number[] }
    | { duration: DurationType }
    | { isBack: boolean }
  >();
  fileDownloadQueryString: string;
  subscriptions_: Subscription[] = [];
  maxCol = 0;

  constructor(
    public clientDataStore: ClientDataStore,
    public appService: AppService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    // private transManageService: TransitionManageService
  ) {
    const initialState = this.onGetFilterState();
    const reportFilterReducer = function (
      state = initialState,
      action:
        | { startDate: moment.Moment }
        | { endDate: moment.Moment }
        | { machines: number[] }
        | { duration: DurationType }
        | { isBack: boolean }
    ) {
      return { ...state, ...action };
    };

    const reportFilterSubject$ = new BehaviorSubject(initialState);
    this.reportFilterChanges$
      .pipe(scan(reportFilterReducer, initialState))
      .subscribe((state) => reportFilterSubject$.next(state));
    this.subscriptions_ = [
      this.clientDataStore
        .SelectMachines()
        .pipe(
          filter((ms) => ms && ms.length > 0), // Ensures non-empty array
          map((ms) => ms.slice().sort((a, b) => a.description.localeCompare(b.description))) // Sorts machines
        )
        .subscribe((machines) => {
          const qsMachines = initialState.machines;
          this.machines = machines.map((m) => ({
            ...m,
            isChecked: !qsMachines.length || qsMachines.includes(m.machineNumber),
          }));
          if (!qsMachines.length) {
            this.reportFilterChanges$.next({
              machines: this.machines.map((m) => m.machineNumber),
              isBack: false,
            });
          }
        }),
    ];

    reportFilterSubject$
      .pipe(
        filter((filter) => filter.machines.length > 0),
        tap(() => appService.setLoading(true)),
        tap((query) => this.updateQueryString(query)),
        map((filters) => {
          const query = {
            ...filters,
            startDate: filters.startDate.format('YYYY-MM-DD'),
            endDate: filters.endDate.format('YYYY-MM-DD'),
          };

          return this.http.get(`${Ams.Config.BASE_URL}/_api/reports/coilscrap`, {
            params: query,
          });
        }),
        switchMap((source) => source)
      )
      .subscribe((summaryList: CoilSummary[]) => {
        this.summaryList = summaryList;
        this.filteredList = summaryList;
        appService.setLoading(false);
      });
  }

  onGetPadding() {
    return this.filteredList.length > this.maxCol;
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
    localStorage.setItem('report.coilScrap.Duration', item);
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

  onChangeMachines(items) {
    this.machines = items;
    this.reportFilterChanges$.next({
      machines: this.machines.filter((x) => x.isChecked).map((m) => m.machineNumber),
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

    const machines = this.route.snapshot.paramMap.get('machines')

    const qsMachines: number[] = machines
      ? JSON.parse(machines).map((m) => Number(m))
      : [];

    return {
      startDate: this.startDate,
      endDate: this.endDate,
      duration: this.selectedDuration,
      machines: qsMachines || [],
    };
  }

  onGetFilterIndex(mainTxt, searchTxt) {
    if (!mainTxt) return false;
    const realTxt = mainTxt.toLowerCase();
    return realTxt.indexOf(searchTxt) > -1;
  }

  onFilter(searchTxt) {
    if (!searchTxt) {
      this.filteredList = this.summaryList;
    } else {
      const realSearchTxt = searchTxt.toLowerCase();
      this.filteredList = this.summaryList.filter((item) => {
        if (this.onGetFilterIndex(item.coil.coilId, realSearchTxt)) {
          return true;
        } else if (this.onGetFilterIndex(item.coil.materialCode, realSearchTxt)) {
          return true;
        } else if (this.onGetFilterIndex(item.coil.heatNumber, realSearchTxt)) {
          return true;
        } else if (this.onGetFilterIndex(item.coil.description, realSearchTxt)) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  ngOnInit(): void {
    // this.maxCol = Math.round((window.innerHeight - 240) / 50);
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

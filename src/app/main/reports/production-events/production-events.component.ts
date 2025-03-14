import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map } from 'rxjs/operators';
import { IMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { FilterState } from '../report-type';
import { TransitionManageService } from '../../shared/services/transition.service';
import { ProductionLogComponent } from '../../shared/components/production-log/production-log.component';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-production-events',
  templateUrl: './production-events.component.html',
  styleUrls: ['./production-events.component.scss'],
})
export class ProductionEventsComponent implements OnInit, OnDestroy {
  @ViewChild(ProductionLogComponent) productionLogComponent: ProductionLogComponent;
  machines: (IMachine & { isChecked: boolean })[] = [];
  endDate: moment.Moment = moment();
  startDate: moment.Moment = moment();
  shiftMenus = [
    { name: 1, isChecked: true },
    { name: 2, isChecked: true },
    { name: 3, isChecked: true },
  ];

  shifts: number[];

  reportFilterChanges$ = new Subject<
    | { startDate: moment.Moment }
    | { endDate: moment.Moment }
    | { machines: number[] }
    | { shifts: number[] }
    | { isBack: boolean }
  >();

  machineNums: number[] = [];

  subscriptions_: Subscription[] = [];

  constructor(
    public clientDataStore: ClientDataStore,
    public appService: AppService,
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
        | { machines: number[] }
        | { shifts: number[] }
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
        tap((query) => this.updateQueryString(query))
      )
      .subscribe(() => {
        this.machineNums = this.machines.filter((m) => m.isChecked).map((m) => m.machineNumber);
        appService.setLoading(false);
      });
  }

  updateQueryString(query: FilterState) {
    const exportQuery = {
      ...query,
      startDate: query.startDate.format('YYYY-MM-DD'),
      endDate: query.endDate.format('YYYY-MM-DD'),
    };
    if (query.shifts && query.shifts.length > 0) {
      this.shifts = query.shifts;
    }

    if (!query.isBack) {
      this.router.navigate([], {
        queryParams: exportQuery,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  onChangeShifts(items) {
    this.shiftMenus = items;
    this.reportFilterChanges$.next({
      shifts: this.shiftMenus.filter((x) => x.isChecked).map((x) => x.name),
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

  onFilter(searchTxt) {
    this.productionLogComponent.onFilter(searchTxt);
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

    const shifts = this.route.snapshot.paramMap.get('shifts')

    const qsShifts: number[] = shifts
      ? JSON.parse(shifts).map((m) => Number(m))
      : [];

    const machines = this.route.snapshot.paramMap.get('machines')

    const qsMachines: number[] = machines
      ? JSON.parse(machines).map((m) => Number(m))
      : [];

    return {
      startDate: this.startDate,
      endDate: this.endDate,
      shifts: qsShifts,
      machines: qsMachines,
    };
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

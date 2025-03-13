import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map, switchMap } from 'rxjs/operators';
import { IMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { OrderSummary, FilterState } from '../report-type';
import { TransitionManageService } from '../../shared/services/transition.service';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnDestroy, OnInit {
  summaryList: OrderSummary[] = [];
  filteredList: OrderSummary[] = [];
  mainRows = [];
  machines: (IMachine & { isChecked: boolean })[] = [];
  endDate: moment.Moment = moment();
  startDate: moment.Moment = moment().add(-10, 'days');
  reportFilterChanges$ = new Subject<
    | { startDate: moment.Moment }
    | { endDate: moment.Moment }
    | { machines: number[] }
    | { shifts: number[] }
    | { isBack: boolean }
  >();
  fileDownloadQueryString: string;
  shiftMenus = [
    { name: 1, isChecked: true },
    { name: 2, isChecked: true },
    { name: 3, isChecked: true },
  ];
  subscriptions_: Subscription[] = [];
  transition$;

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
        tap((query) => this.updateQueryString(query)),
        map((filters) => {
          const query = {
            ...filters,
            startDate: filters.startDate.format('YYYY-MM-DD'),
            endDate: filters.endDate.format('YYYY-MM-DD'),
          };

          return this.http.get(`${Ams.Config.BASE_URL}/_api/reports/orderSummary`, {
            params: query,
          });
        }),
        switchMap((source) => source)
      )
      .subscribe((summaryList: OrderSummary[]) => {
        this.summaryList = summaryList;
        this.filteredList = summaryList;
        this.customizeRow();
        appService.setLoading(false);
      });
  }

  customizeRow() {
    let mainRows = [];
    this.filteredList.forEach((order) => {
      let item1 = {
        type: 'order',
        orderCode: order.orderCode,
        materialCode: order.materialCode,
        toolingCode: order.toolingCode,
      };
      mainRows.push(item1);
      order.bundles.forEach((bundle) => {
        let item2 = {
          type: 'bundle',
          bundleIdentity: bundle.bundleIdentity,
        };
        mainRows.push(item2);
        bundle.prodRuns.forEach((prodRun) => {
          let item3 = {
            type: 'prodRun-group',
            ...prodRun,
            items: [],
          };
          mainRows.push(item3);
          prodRun.items.forEach((item, ii) => {
            if (ii === 0) {
              mainRows.push({ type: 'prodRun-title' });
            }
            let item4 = {
              type: 'prodRun-item',
              ...item,
            };
            mainRows.push(item4);
          });
          let item5 = {
            type: 'Total for Coil',
            goodFt: prodRun.goodFt,
            goodLbs: prodRun.goodLbs,
            scrapFt: prodRun.scrapFt,
            scrapLbs: prodRun.scrapLbs,
            reclaimedScrapFt: prodRun.reclaimedScrapFt,
          };
          mainRows.push(item5);
        });
        let item6 = {
          type: 'Total for Bundle',
          goodFt: bundle.goodFt,
          goodLbs: bundle.goodLbs,
          scrapFt: bundle.scrapFt,
          scrapLbs: bundle.scrapLbs,
          reclaimedScrapFt: bundle.reclaimedScrapFt,
        };
        mainRows.push(item6);
      });
      let item7 = {
        type: 'Total for Order',
        goodFt: order.goodFt,
        goodLbs: order.goodLbs,
        scrapFt: order.scrapFt,
        scrapLbs: order.scrapLbs,
        reclaimedScrapFt: order.reclaimedScrapFt,
      };
      mainRows.push(item7);
    });
    this.mainRows = [...mainRows];
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
      machines: qsMachines || [],
    };
  }

  onGetFilterIndex(mainTxt, searchTxt) {
    if (!mainTxt) return false;
    const realTxt = mainTxt.toLowerCase();
    return realTxt.indexOf(searchTxt) > -1;
  }

  onFilter(searchTxt: string) {
    if (!searchTxt) {
      this.filteredList = this.summaryList;
    } else {
      const realSearchTxt = searchTxt.toLowerCase();
      this.filteredList = this.summaryList.filter((item) => {
        if (this.onGetFilterIndex(item.orderCode, realSearchTxt)) {
          return true;
        }
        if (this.onGetFilterIndex(item.materialCode, realSearchTxt)) {
          return true;
        }
        if (this.onGetFilterIndex(item.toolingCode, realSearchTxt)) {
          return true;
        }
        if (item.bundles.some((o) => this.bundleFilter(o, realSearchTxt))) {
          return true;
        }
        return false;
      });
    }

    this.customizeRow();
  }

  bundleFilter(bundle, searchTxt) {
    if (this.onGetFilterIndex(bundle.bundleIdentity, searchTxt)) {
      return true;
    }
    if (bundle.prodRuns.some((r) => this.onGetFilterIndex(r.coilSerialNumber, searchTxt))) {
      return true;
    }
    return false;
  }

  trackByCode = (index: number, m: OrderSummary): string => {
    return m.orderCode;
  };

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
    this.transition$.unsubscribe();
  }
}

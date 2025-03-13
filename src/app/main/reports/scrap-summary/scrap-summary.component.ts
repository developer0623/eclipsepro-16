import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router  } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map, switchMap } from 'rxjs/operators';
import { CoilSummary, FilterState } from '../report-type';
import { IMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { TransitionManageService } from '../../shared/services/transition.service';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-scrap-summary',
  templateUrl: './scrap-summary.component.html',
  styleUrls: ['./scrap-summary.component.scss'],
})
export class ScrapSummaryComponent implements OnDestroy, OnInit {
  filteredList: { groups: CoilSummary[] } = { groups: [] };
  machines: (IMachine & { isChecked: boolean })[] = [];
  endDate: moment.Moment = moment();
  startDate: moment.Moment = moment().add(-1, 'months');
  reportFilterChanges$ = new Subject<
    | { startDate: moment.Moment }
    | { endDate: moment.Moment }
    | { group1: string }
    | { group2: string }
    | { machines: number[] }
    | { shifts: number[] }
    | { isBack: boolean }
  >();

  groupByList = [
    { name: 'All', selector: 'All' },
    { name: 'Machine', selector: 'Machine' },
    { name: 'Shift', selector: 'Shift' },
    { name: 'Operator', selector: 'Operator' },
    { name: 'Machine Group', selector: 'MachineGroup' },
    { name: 'Date', selector: 'Date' },
    { name: 'Material', selector: 'Material' },
    { name: 'Gauge', selector: 'Gauge' },
    { name: 'Gauge & Width', selector: 'GaugeWidth' },
    { name: 'Gauge, Width & Tooling', selector: 'GaugeWidthTooling' },
    { name: 'Tooling Code', selector: 'Tooling' },
  ];
  thenByList = [
    { name: 'All', selector: 'All' },
    { name: 'Shift', selector: 'Shift' },
    { name: 'Machine', selector: 'Machine' },
    { name: 'Shift & Machine', selector: 'ShiftMachine' },
  ];
  shiftMenus = [
    { name: 1, isChecked: true },
    { name: 2, isChecked: true },
    { name: 3, isChecked: true },
  ];
  selectedGroup = this.groupByList[0];
  selectedThen = this.thenByList[0];
  _filter;
  fileDownloadQueryString: string;
  subscriptions_: Subscription[] = [];
  transition$;
  constructor(
    public clientDataStore: ClientDataStore,
    public appService: AppService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private transManageService: TransitionManageService,
    private _datePipe: DatePipe
  ) {
    const localGroup1 = localStorage.getItem('report.scrap.summary.group1');
    const localGroup2 = localStorage.getItem('report.scrap.summary.group2');

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
    const group1 = this.route.snapshot.paramMap.get('group1');
    if (group1) {
      let g1 = this.groupByList.find((g) => g.selector === group1);
      if (g1) this.selectedGroup = g1;
    } else if (!!localGroup1) {
      let g3 = this.groupByList.find((g) => g.selector === localGroup1);
      if (g3) this.selectedGroup = g3;
    }
    const group2 = this.route.snapshot.paramMap.get('group2');
    if (group2) {
      let g2 = this.thenByList.find((g) => g.selector === group2);
      if (g2) this.selectedThen = g2;
    } else if (!!localGroup2) {
      let g4 = this.thenByList.find((g) => g.selector === localGroup2);
      if (g4) this.selectedThen = g4;
    }

    const machines = this.route.snapshot.paramMap.get('machines')

    const qsMachines: number[] = machines
      ? JSON.parse(machines).map((m) => Number(m))
      : [];

    const initialState: FilterState = {
      startDate: this.startDate,
      endDate: this.endDate,
      group1: this.selectedGroup.selector,
      group2: this.selectedThen.selector,
      machines: qsMachines,
    };
    const reportFilterReducer = function (
      state = initialState,
      action:
        | { startDate: moment.Moment }
        | { endDate: moment.Moment }
        | { group1: string }
        | { group2: string }
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
          this.machines = machines.map((m) => ({
            ...m,
            isChecked: !qsMachines || qsMachines.includes(m.machineNumber),
          }));
          if (!qsMachines) {
            this.reportFilterChanges$.next({
              machines: this.machines.map((m) => m.machineNumber),
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

          return this.http.get(`${Ams.Config.BASE_URL}/_api/reports/scrapSummary`, {
            params: query,
          });
        }),
        switchMap((source) => source)
      )
      .subscribe((report: any) => {
        console.log('downtime summary', report);
        this.filteredList = report;
        appService.setLoading(false);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
    this.transition$.unsubscribe();
  }

  onGetGroupHeader(keyg, keyt) {
    let result = '';
    if (keyg === 'All') {
      result = `<div class="group-key">All</div>`;
    } else if (keyg['machineNumber']) {
      result = `<div class="group-key">Machine:</div><div class="group-key-val">${keyg['machineNumber']}</div>`;
    } else if (keyg['machineGroup']) {
      result = `<div class="group-key">Machine Group:</div><div class="group-key-val">${keyg['machineGroup']}</div>`;
    } else if (keyg['shift']) {
      result = `<div class="group-key">Shift:</div><div class="group-key-val">${keyg['shift']}</div>`;
    } else if (keyg['operator']) {
      result = `<div class="group-key">Operator:</div>
                <div class="group-key-val">${keyg['operator']['employeeNumber']}</div>
                <div class="group-key-val">${keyg['operator']['employeeName']}</div>
                `;
    } else if (keyg['date']) {
      result = `<div class="group-key">Date:</div><div class="group-key-val">${this._datePipe.transform(
        keyg['date'],
        'mediumDate'
      )}</div>`;
    } else if (keyg['materialCode']) {
      result = `<div class="group-key">Material:</div><div class="group-key-val">${keyg['materialCode']}</div>`;
    } else if (keyg['gauge'] && keyg['widthIn'] && keyg['toolingCode']) {
      result = `<div class="group-key">Gauge/Width/Tooling:</div>
                <div class="group-key-val">${keyg['gauge']}</div>
                <div class="group-key-val">${keyg['widthIn']}</div>
                <div class="group-key-val">${keyg['toolingCode']}</div>
                `;
    } else if (keyg['gauge'] && keyg['widthIn']) {
      result = `<div class="group-key">Gauge/Width:</div>
                <div class="group-key-val">${keyg['gauge']}</div>
                <div class="group-key-val">${keyg['widthIn']}</div>
                `;
    } else if (keyg['gauge']) {
      result = `<div class="group-key">Gauge:</div><div class="group-key-val">${keyg['gauge']}</div>`;
    } else if (keyg['toolingCode']) {
      result = `<div class="group-key">Tooling Code:</div><div class="group-key-val">${keyg['toolingCode']}</div>`;
    }

    if (keyt === 'All') {
      result += `<div class="group-key">All</div>`;
    }
    if (keyt['machineNumber']) {
      result += `<div class="group-key">Machine:</div><div class="group-key-val">${keyt['machineNumber']}</div>`;
    }
    if (keyt['shift']) {
      result += `<div class="group-key">Shift:</div><div class="group-key-val">${keyt['shift']}</div>`;
    }
    return result;
  }

  onChangeGroup(item) {
    this.selectedGroup = item;
    this.reportFilterChanges$.next({
      group1: this.selectedGroup.selector,
    });
    this.updateThenBy(item.selector);
  }

  onChangeThen(item) {
    this.selectedThen = item;
    this.reportFilterChanges$.next({
      group2: this.selectedThen.selector,
    });
  }

  onChangeDate({ startDate, endDate }) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.reportFilterChanges$.next({
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  onClose(selectedItem) {
    selectedItem.isOpen = !selectedItem.isOpen;
  }

  onChangeMachines(items) {
    this.machines = items;
    this.reportFilterChanges$.next({
      machines: this.machines.filter((x) => x.isChecked).map((m) => m.machineNumber),
    });
  }

  onChangeShifts(items) {
    this.shiftMenus = items;
    this.reportFilterChanges$.next({
      shifts: this.shiftMenus.filter((x) => x.isChecked).map((x) => x.name),
    });
  }

  updateQueryString(query: FilterState) {
    const exportQuery = {
      ...query,
      startDate: query.startDate.format('YYYY-MM-DD'),
      endDate: query.endDate.format('YYYY-MM-DD'),
    };

    localStorage.setItem('report.scrap.summary.group1', query.group1);
    localStorage.setItem('report.scrap.summary.group2', query.group2);

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

  onGetFilterIndex(mainTxt, searchTxt) {
    if (!mainTxt) return false;
    const realTxt = mainTxt.toLowerCase();
    return realTxt.indexOf(searchTxt) > -1;
  }

  updateThenBy(group1: string) {
    let currentThenBy = this.selectedThen.selector;
    switch (group1) {
      case 'All':
        this.thenByList = [{ name: 'All', selector: 'All' }];
        break;
      case 'Shift':
        this.thenByList = [
          { name: 'All', selector: 'All' },
          { name: 'Machine', selector: 'Machine' },
        ];
        break;
      case 'Machine':
        this.thenByList = [
          { name: 'All', selector: 'All' },
          { name: 'Shift', selector: 'Shift' },
        ];
        break;
      default:
        this.thenByList = [
          { name: 'All', selector: 'All' },
          { name: 'Shift', selector: 'Shift' },
          { name: 'Machine', selector: 'Machine' },
          { name: 'Shift & Machine', selector: 'ShiftMachine' },
        ];
    }

    let foundThenBy = this.thenByList.find((x) => x.selector === currentThenBy);
    if (!foundThenBy) {
      this.selectedThen = this.thenByList[0];
      this.onChangeThen(this.selectedThen);
    }
  }

  onGetFilterState(queryString): FilterState {
    if (queryString.startDate) {
      const m = moment(queryString.startDate);
      if (m.isValid()) this.startDate = m;
    }
    if (queryString.endDate) {
      const m = moment(queryString.endDate);
      if (m.isValid()) this.endDate = m;
    }
    if (queryString.group1) {
      let g1 = this.groupByList.find((g) => g.selector === queryString.group1);
      if (g1) this.selectedGroup = g1;
    }
    if (queryString.group2) {
      let g2 = this.thenByList.find((g) => g.selector === queryString.group2);
      if (g2) this.selectedThen = g2;
    }

    const qsMachines: number[] = queryString.machines
      ? queryString.machines.map((m) => Number(m))
      : undefined;

    return {
      startDate: this.startDate,
      endDate: this.endDate,
      group1: this.selectedGroup.selector,
      group2: this.selectedThen.selector,
      machines: qsMachines || [],
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
}

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map, switchMap } from 'rxjs/operators';
import { IMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { QualityAudit, QualityAuditGroup, FilterState } from '../report-type';
import { TransitionManageService } from '../../shared/services/transition.service';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-quality-audit',
  templateUrl: './quality-audit.component.html',
  styleUrls: ['./quality-audit.component.scss'],
})
export class QualityAuditComponent implements OnDestroy, OnInit {
  summaryList: QualityAudit[] = [];
  filteredList: QualityAudit[] = [];
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

          return this.http.get(`${Ams.Config.BASE_URL}/_api/reports/qualityAudit`, {
            params: query,
          });
        }),
        switchMap((source) => source)
      )
      .subscribe((summaryList: QualityAudit[]) => {
        this.summaryList = summaryList;
        this.filteredList = summaryList;
        this.customizeRow();
        appService.setLoading(false);
      });
  }

  customizeRow() {
    let mainRows = [];
    this.filteredList.forEach((qu) => {
      let item1 = {
        type: 'quality-header',
        machineNumber: qu.machineNumber,
        shift: qu.shift,
      };
      mainRows.push(item1);
      qu.groups.forEach((gitem) => {
        let item2 = {
          type: 'group-header',
          orderCode: gitem.key.orderCode,
          materialCode: gitem.key.materialCode,
          toolingCode: gitem.key.toolingCode,
          customerName: gitem.key.customerName,
          ordId: gitem.key.ordId,
        };
        mainRows.push(item2);
        gitem.entries.forEach((entry, ii) => {
          if (ii === 0) {
            mainRows.push({ type: 'entry-header' });
          }
          let item3 = {
            type: 'entry-item',
            recordDate: entry.recordDate,
            listText: entry.listText,
            listValue: entry.listValue,
            listId: entry.listId,
            codeDescription: entry.codeDescription,
            employeeNumber: entry.employeeNumber,
            employeeName: entry.employeeName,
            coilSerialNumber: entry.coilSerialNumber,
          };
          mainRows.push(item3);
        });
      });
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
      machines: qsMachines,
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
      searchTxt = searchTxt.toLowerCase();

      this.filteredList = this.summaryList
        .map((item) => this.filterItem(searchTxt, item))
        .filter((item) => item);
    }

    this.customizeRow();
  }

  filterItem(searchTxt: string, item: QualityAudit): QualityAudit {
    let filteredGroups = item.groups.map((g) => this.filterGroup(searchTxt, g));
    if (filteredGroups.length) {
      return { ...item, groups: filteredGroups.filter((g) => g) };
    }
    return null;
  }

  filterGroup(searchTxt, group: QualityAuditGroup): QualityAuditGroup {
    // if the group key gets a search hit, return the entire group
    if (
      this.onGetFilterIndex(group.key.orderCode, searchTxt) ||
      this.onGetFilterIndex(group.key.materialCode, searchTxt) ||
      this.onGetFilterIndex(group.key.toolingCode, searchTxt) ||
      this.onGetFilterIndex(group.key.customerName, searchTxt)
    ) {
      return group;
    }

    // no hit on the key, filter the entries
    let filteredEntries = group.entries.filter((e) => {
      return (
        this.onGetFilterIndex(e.employeeName, searchTxt) ||
        this.onGetFilterIndex(e.employeeNumber, searchTxt) ||
        this.onGetFilterIndex(e.coilSerialNumber, searchTxt) ||
        this.onGetFilterIndex(e.listText, searchTxt) ||
        this.onGetFilterIndex(e.listValue, searchTxt) ||
        this.onGetFilterIndex(e.listId.toString(), searchTxt)
      );
    });

    if (filteredEntries.length) {
      return { ...group, entries: filteredEntries };
    }

    return null;
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

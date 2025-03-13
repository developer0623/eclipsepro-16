import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map, switchMap } from 'rxjs/operators';
import { IMachine } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { OrderSequence } from '../report-type';
import { TransitionManageService } from '../../shared/services/transition.service';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { AppService } from '../../shared/services/app.service';
interface ColumnChoice {
  field: string;
  title: string;
  isChecked: boolean;
  filter?: string;
}

interface FilterState {
  machines?: number[];
  type?: string;
  isBack?: boolean;
  scheduleStatus?: string;
}

@Component({
  selector: 'app-order-sequence',
  templateUrl: './order-sequence.component.html',
  styleUrls: ['./order-sequence.component.scss'],
})
export class OrderSequenceComponent implements OnDestroy, OnInit {
  summaryList: OrderSequence[] = [];
  filteredList: OrderSequence[] = [];
  machines: (IMachine & { isChecked: boolean })[] = [];
  fileDownloadQueryString: string;
  reportFilterChanges$ = new Subject<
    { machines: number[] } | { isBack: boolean } | { scheduleStatus: string }
  >();
  displayTypes = ['Simple', 'Items', 'Bundles'];
  selectedDisplayType = this.displayTypes[0];
  scheduleStatuses = ['All', 'Machine', 'Assigned'];
  selectedScheduleStatus = this.scheduleStatuses[0];
  machineNumbers: number[] = [];
  groupVals = {};

  masterHeaderColumns: ColumnChoice[] = [
    {
      field: 'status',
      title: 'status',
      isChecked: false,
    },
    {
      field: 'customerName',
      title: 'customer',
      isChecked: false,
    },
    {
      field: 'requiredDate',
      title: 'requiredBy',
      isChecked: false,
      filter: 'amsDate',
    },
    {
      field: 'completionDate',
      title: 'complete',
      isChecked: false,
      filter: 'amsDateTime',
    },
    {
      field: 'importDate',
      title: 'imported',
      isChecked: false,
      filter: 'amsDate',
    },
    {
      field: 'salesOrder',
      title: 'salesOrder',
      isChecked: false,
    },
    {
      field: 'workOrder',
      title: 'workOrder',
      isChecked: false,
    },
    {
      field: 'customerPO',
      title: 'purchaseOrder',
      isChecked: false,
    },
    {
      field: 'customerNumber',
      title: 'customerNumber',
      isChecked: false,
    },
    {
      field: 'truckNumber',
      title: 'truckNumber',
      isChecked: false,
    },
    {
      field: 'stagingBay',
      title: 'stagingBay',
      isChecked: false,
    },
    {
      field: 'loadingDock',
      title: 'loadingDock',
      isChecked: false,
    },
    {
      field: 'user1',
      title: 'orderUser1',
      isChecked: false,
    },
    {
      field: 'user2',
      title: 'orderUser2',
      isChecked: false,
    },
    {
      field: 'user3',
      title: 'orderUser3',
      isChecked: false,
    },
    {
      field: 'user4',
      title: 'orderUser4',
      isChecked: false,
    },
    {
      field: 'user5',
      title: 'orderUser5',
      isChecked: false,
    },
    {
      field: 'longestLengthIn',
      title: 'longestPart',
      isChecked: false,
      filter: 'unitsFormat:"in":3',
    },
    {
      field: 'shortestLengthIn',
      title: 'shortestPart',
      isChecked: false,
      filter: 'unitsFormat:"in":3',
    },
    {
      field: 'bundleCount',
      title: 'bundleCount',
      isChecked: false,
    },
    {
      field: 'materialColor',
      title: 'Color',
      isChecked: false,
    },
    {
      field: 'materialGauge',
      title: 'Width',
      isChecked: false,
    },
    {
      field: 'operatorMessage',
      title: 'Message',
      isChecked: false,
    },
  ];

  masterItemColumns: ColumnChoice[] = [
    {
      field: 'quantityDone',
      title: 'quantityDone',
      isChecked: false,
    },
    {
      field: 'patternName',
      title: 'patternName',
      isChecked: false,
    },
    {
      field: 'option',
      title: 'option',
      isChecked: false,
    },
    {
      field: 'externalItemId',
      title: 'itemId',
      isChecked: false,
    },
    {
      field: 'bundleGroup',
      title: 'bundleGroup',
      isChecked: false,
    },
    {
      field: 'user1',
      title: 'itemUser1',
      isChecked: false,
    },
    {
      field: 'user2',
      title: 'itemUser2',
      isChecked: false,
    },
    {
      field: 'user3',
      title: 'itemUser3',
      isChecked: false,
    },
    {
      field: 'user4',
      title: 'itemUser4',
      isChecked: false,
    },
    {
      field: 'user5',
      title: 'itemUser5',
      isChecked: false,
    },
    {
      field: 'messageText',
      title: 'message',
      isChecked: false,
    },
    {
      field: 'pieceMark',
      title: 'pieceMark',
      isChecked: false,
    },
  ];

  masterBundleColumns: ColumnChoice[] = [
    {
      field: 'user1',
      title: 'bundleUser1',
      isChecked: false,
    },
    {
      field: 'user2',
      title: 'bundleUser2',
      isChecked: false,
    },
    {
      field: 'user3',
      title: 'bundleUser3',
      isChecked: false,
    },
    {
      field: 'user4',
      title: 'bundleUser4',
      isChecked: false,
    },
    {
      field: 'user5',
      title: 'bundleUser5',
      isChecked: false,
    },
  ];

  headerColumns = [];
  itemColumns = [];
  bundleColumns = [];
  selectedHeaderColumns = [];
  selectedItemColumns = [];
  selectedBundleColumns = [];
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
    const localDisplayType = localStorage.getItem('report.order-sequence.displayType');
    if (localDisplayType) {
      this.selectedDisplayType = localDisplayType;
    }
    const initialState = this.onGetFilterState();
    const reportFilterReducer = function (
      state = initialState,
      action: { machines: number[] } | { isBack: boolean }
    ) {
      return { ...state, ...action };
    };

    this.headerColumns = this.getMergedColumns('headerColumns', this.masterHeaderColumns);
    this.selectedHeaderColumns = this.headerColumns.filter((x) => x.isChecked);

    this.itemColumns = this.getMergedColumns('itemColumns', this.masterItemColumns);
    this.selectedItemColumns = this.itemColumns.filter((x) => x.isChecked);

    this.bundleColumns = this.getMergedColumns('bundleColumns', this.masterBundleColumns);
    this.selectedBundleColumns = this.bundleColumns.filter((x) => x.isChecked);

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
              scheduleStatus: this.selectedScheduleStatus,
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
        switchMap((filters) => {
          const query = {
            ...filters,
          };

          return this.http
            .get<OrderSequence[]>(`${Ams.Config.BASE_URL}/_api/reports/machineschedule`, {
              params: query,
            })
            .pipe(
              map((orders) => {
                return orders.map((order) => {
                  let bundles = _(order.items)
                    .groupBy((i) => i.bundle)
                    .map((bundle_items, bundle) => {
                      const _bundle_items = _(bundle_items);
                      const bundleNo = Number(bundle);
                      return {
                        bundleNo: bundleNo,
                        totalLbs: _bundle_items.map((x) => x.weightLbs).sum(),
                        pieces: _bundle_items.map((x) => x.quantity).sum(),
                        totalFt: _bundle_items.map((x) => x.lengthIn * x.quantity).sum() / 12,

                        bundleMinLengthIn: _bundle_items
                          .map((x) => x.lengthIn)
                          .filter((x) => x > 0) // zero is used on message only lines and is not produced.
                          .min(),
                        bundleMaxLengthIn: _bundle_items.map((x) => x.lengthIn).max(),

                        user1: order.bundles.find((b) => b.bundleNo === bundleNo)?.user1,
                        user2: order.bundles.find((b) => b.bundleNo === bundleNo)?.user2,
                        user3: order.bundles.find((b) => b.bundleNo === bundleNo)?.user3,
                        user4: order.bundles.find((b) => b.bundleNo === bundleNo)?.user4,
                        user5: order.bundles.find((b) => b.bundleNo === bundleNo)?.user5,
                      };
                    })
                    .value();
                  return { ...order, bundles: bundles };
                });
              })
            );
        })
      )
      .subscribe((report) => {
        this.summaryList = report as any;
        this.filteredList = report as any;

        this.groupVals = {};
        this.filteredList.forEach((item) => {
          const machineNumber = item.job.machineNumber;
          const itemVals = this.groupVals[machineNumber];
          if (itemVals) {
            const newVals = {
              weight: itemVals.weight + item.job.remainingLbs,
              length: itemVals.length + item.job.remainingFt,
            };
            this.groupVals = {
              ...this.groupVals,
              [machineNumber]: newVals,
            };
          } else {
            this.groupVals = {
              ...this.groupVals,
              [machineNumber]: {
                weight: item.job.remainingLbs,
                length: item.job.remainingFt,
              },
            };
          }
        });

        // summarize by material - move to server or above foreach?
        let mach = 0;
        let material = '';
        let currentFt = 0;
        let currentLbs = 0;
        let currentCount = 0;
        for (let i = 0; i < this.filteredList.length; i++) {
          const item = this.filteredList[i];
          if (item.job.machineNumber !== mach || item.job.materialCode !== material) {
            mach = item.job.machineNumber;
            material = item.job.materialCode;
            currentFt = 0;
            currentLbs = 0;
            currentCount = 0;
            if (i > 0) {
              // update the last item
              this.filteredList[i - 1].materialGroup.accLast = true;
            }
          }
          currentFt += item.job.remainingFt;
          currentLbs += item.job.remainingLbs;
          currentCount++;
          item.materialGroup = {
            accFt: currentFt,
            accLbs: currentLbs,
            accCount: currentCount,
            accLast: false,
          };
        }
        if (this.filteredList.length > 0) {
          // update the last item
          this.filteredList[this.filteredList.length - 1].materialGroup.accLast = true;
        }
        appService.setLoading(false);
      });
  }

  onChangeType(item: string) {
    this.selectedDisplayType = item;
    this.updateQueryString({ type: this.selectedDisplayType });
    localStorage.setItem('report.order-sequence.displayType', item);
  }

  onChangeStatus(item: string) {
    this.selectedScheduleStatus = item;
    this.reportFilterChanges$.next({
      machines: this.machines.filter((x) => x.isChecked).map((m) => m.machineNumber),
      scheduleStatus: this.selectedScheduleStatus,
      isBack: false,
    });
  }

  updateQueryString(query: FilterState) {
    const exportQuery = {
      ...query,
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

  onChangeMachines(items) {
    this.machines = items;
    this.reportFilterChanges$.next({
      machines: this.machines.filter((x) => x.isChecked).map((m) => m.machineNumber),
      scheduleStatus: this.selectedScheduleStatus,
      isBack: false,
    });
  }

  onGetFilterState(): FilterState {
    const machines = this.route.snapshot.paramMap.get('machines')

    const qsMachines: number[] = machines
      ? JSON.parse(machines).map((m) => Number(m))
      : [];

    const scheduleStatus = this.route.snapshot.paramMap.get('scheduleStatus');

    if (scheduleStatus) {
      this.selectedScheduleStatus = scheduleStatus;
    }

    return {
      machines: qsMachines || [],
      scheduleStatus: this.selectedScheduleStatus,
    };
  }

  onFilter(searchTxt: string) {
    if (!searchTxt) {
      this.filteredList = this.summaryList;
    } else {
      const compareToSearchText = (mainTxt: string) => {
        if (!mainTxt) return false;
        const realTxt = mainTxt.toLowerCase();
        return realTxt.indexOf(searchTxt.toLowerCase()) > -1;
      };

      this.filteredList = this.summaryList.filter((item) => {
        if (compareToSearchText(item.id)) {
          return true;
        }
        if (compareToSearchText(item.job.materialCode)) {
          return true;
        }
        if (compareToSearchText(item.job.materialDescription)) {
          return true;
        }
        if (compareToSearchText(item.job.toolingCode)) {
          return true;
        }
        if (compareToSearchText(item.job.toolingDescription)) {
          return true;
        }
        if (compareToSearchText(item.job.orderCode)) {
          return true;
        }
        if (compareToSearchText(item.job.customerName)) {
          return true;
        }
        if (item.bundles.some((o) => compareToSearchText(o.bundleNo.toString()))) {
          return true;
        }
        return false;
      });
    }
  }

  onHeaderColumnToggle(column, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    column.isChecked = !column.isChecked;
    this.selectedHeaderColumns = this.headerColumns.filter((x) => x.isChecked);
    this.setColumnData('headerColumns', this.headerColumns);
  }

  onItemColumnToggle(column, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    column.isChecked = !column.isChecked;
    this.selectedItemColumns = this.itemColumns.filter((x) => x.isChecked);
    this.setColumnData('itemColumns', this.itemColumns);
  }

  onBundleColumnToggle(column, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    column.isChecked = !column.isChecked;
    this.selectedBundleColumns = this.bundleColumns.filter((x) => x.isChecked);
    this.setColumnData('bundleColumns', this.bundleColumns);
  }

  getMergedColumns(type: string, masterColumns: ColumnChoice[]): ColumnChoice[] {
    // todo: consider getting this data from the server and not local storage
    const localStorageColumns = localStorage.getItem('report.orders-sequence.' + type);
    const localColumns: ColumnChoice[] = localStorageColumns ? JSON.parse(localStorageColumns) : [];
    return masterColumns.map((masterCol) => {
      const newCol = localColumns.find((x) => x.field === masterCol.field);
      return {
        ...masterCol,
        isChecked: newCol?.isChecked ?? masterCol.isChecked,
      };
    });
  }

  setColumnData(type: string, columns: ColumnChoice[]) {
    localStorage.setItem('report.orders-sequence.' + type, JSON.stringify(columns));
    // I'll use later.
    this.http
      .post<any>(
        `${Ams.Config.BASE_URL}/_api/user/settings/preferences/report.orders-sequence.${type}`,
        {
          value: JSON.stringify(columns),
        }
      )
      .subscribe({
        next: (data) => {
          console.log('4444444', data);
        },
        error: (e) => {},
      });
  }

  openPrintPreview() {
    window.print();
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
    this.transition$.unsubscribe();
  }
}

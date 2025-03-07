import { Component, Inject, OnDestroy } from '@angular/core';
import { GridOptions, GridApi, GridReadyEvent, GetRowIdParams } from 'ag-grid-community';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, map, filter, tap, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { IJobSummaryDto, ISystemPreferences, IUserColumnChoice } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { LinkHelperCellComponent } from '../../shared/components/link-helper-cell/link-helper-cell.component';
import { AlertCellComponent } from '../../shared/components/alert-cell/alert-cell.component';
import { UnitsService } from '../../shared/services/units.service';
import { AmsDateTimePipe } from '../../shared/pipes/dates.pipe';
import { AmsDatesPipe } from '../../shared/pipes/dates.pipe';
import { BulkEditDialogComponent } from './components/bulk-edit-dialog/bulk-edit-dialog.component';
import { BulkDeleteDialogComponent } from './components/bulk-delete-dialog/bulk-delete-dialog.component';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { selectSystemPreferences } from '../../shared/services/store/misc/selectors';

declare let gtag;

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnDestroy {
  searchTxt = '';
  selectedOrdIds = [];
  searchParams = {};
  ordersSub_;
  systemPrefsSub_;
  agGridOptions: GridOptions;
  knownJobIds: string[] = [];
  showMaterialShortageAlerts: boolean = false;

  ordersActions = [
    {
      key: 'Bulk Edit Field',
      doItemsAction: () => this.bulkEditField(),
      allowed: () => true,
    },
    {
      key: 'Delete Order(s)',
      doItemsAction: () => this.bulkDelete(),
      allowed: () => true,
    },
    {
      key: 'Set Hold',
      doItemsAction: () => this.setHold(true),
      allowed: () => true,
    },
    {
      key: 'Release Hold',
      doItemsAction: () => this.setHold(false),
      allowed: () => true,
    },
  ];
  masterListOfColumns = [
    {
      field: 'orderCode',
      headerName: 'Order',
      hide: false,
      filter: 'agTextColumnFilter',
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'JobDetail',
        hideType: true,
        isOrder: true,
      },
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      minWidth: 160,
      suppressSizeToFit: true,
    },
    {
      field: 'materialCode',
      headerName: 'Material',
      hide: false,
      filter: 'agTextColumnFilter',
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Material',
        hideType: true,
      },
    },
    {
      field: 'materialDescription',
      headerName: 'MaterialDescription',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'toolingCode',
      headerName: 'Tooling',
      hide: false,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'toolingDescription',
      headerName: 'ToolingDescription',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'totalFt',
      headerName: 'Total',
      hide: false,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
    },
    {
      field: 'remainingFt',
      headerName: 'Remaining',
      hide: false,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
      cellClassRules: {
        'error-cell': (params) =>
          this.systemPreferences.showMaterialShortageAlerts && params.data.materialShortageAlert,
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      //cellFilter: 'orderStatus',
      hide: false,
      filter: 'agTextColumnFilter',
      // valueFormatter: (params) => {
      //   return this.$filter('orderStatus')(params.value);
      // },
    },
    {
      field: 'machineNumber',
      headerName: 'Machine',
      hide: false,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'sequence',
      headerName: 'Sequence',
      hide: false,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      hide: false,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'requiredDate',
      headerName: 'RequiredBy',
      hide: false,
      valueFormatter: (params) => {
        return AmsDatesPipe.prototype.transform(params.value);
      },
    },
    {
      field: 'completionDate',
      headerName: 'Complete',
      hide: false,
      valueFormatter: (params) => {
        return AmsDateTimePipe.prototype.transform(params.value);
      },
    }, //should this show an icon if not complete (showing it is the estimate)?
    //{field: 'estimatedCompleteTime', name: 'Estimated', cellFilter: 'amsDateTime', displayName: 'estimated', headerCellFilter: 'translate'},
    {
      field: 'importDate',
      headerName: 'Imported',
      hide: false,
      valueFormatter: (params) => {
        return AmsDatesPipe.prototype.transform(params.value);
      },
    },
    {
      field: 'salesOrder',
      headerName: 'SalesOrder',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'workOrder',
      headerName: 'WorkOrder',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'customerPO',
      headerName: 'PurchaseOrder',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'customerNumber',
      headerName: 'CustomerNumber',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'truckNumber',
      headerName: 'TruckNumber',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'user1',
      headerName: 'OrderUser1',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'user2',
      headerName: 'OrderUser2',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'user3',
      headerName: 'OrderUser3',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'user4',
      headerName: 'OrderUser4',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'user5',
      headerName: 'OrderUser5',
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'longestLengthIn',
      headerName: 'LongestPart',
      hide: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 0, false, ''),
    },
    {
      field: 'shortestLengthIn',
      headerName: 'ShortestPart',
      hide: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 0, false, ''),
    },
    {
      field: 'bundleCount',
      headerName: 'BundleCount',
      hide: true,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'hasAlerts',
      headerName: 'Alerts',
      hide: false,
      cellRenderer: AlertCellComponent,
      cellRendererParams: {
        showMaterialShortageAlerts: this.showMaterialShortageAlerts,
      },
      cellClassRules: {
        'error-cell': (params) => params.value > 1, // hold is not a red background worthy alert
      },
      width: 80,
      minWidth: 80,
      suppressSizeToFit: true,
    },
  ];
  orderStorageColumns = [];
  columns;
  searchData = {};
  searchObject;
  searchFields;
  mainJobs: IJobSummaryDto[] = [];
  systemPreferences: ISystemPreferences;

  currentWidth = 0;
  currentId = '';
  desIndex = 0;
  movingIndex = 0;
  dragingType = 'sizing';
  private gridApi!: GridApi<IJobSummaryDto>;
  daysAgoList = [
    { value: 0, title: 'None' },
    { value: 7, title: '7 Days' },
    { value: 14, title: '14 Days' },
    { value: 30, title: '30 Days' },
    { value: 60, title: '60 Days' },
    { value: 90, title: '90 Days' },
    { value: 180, title: '180 Days' },
    { value: 365, title: '365 Days' },
    { value: 9999, title: 'All' },
  ];
  selectedDays = this.daysAgoList[1];
  daysAgoObs = new BehaviorSubject({ daysAgo: this.selectedDays.value });
  timedOutCloser;

  constructor(
    private clientDataStore: ClientDataStore,
    private unitsService: UnitsService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private http: HttpClient,
    private translate: TranslateService,
    private store: Store
  ) {
    let lsDaysAgo = localStorage.getItem('orders-list.daysAgo');
    if (!!lsDaysAgo) {
      this.selectedDays =
        this.daysAgoList.find((item) => item.value === Number(lsDaysAgo)) || this.daysAgoList[1];
    }

    const localOrderColumns = localStorage.getItem('orders-list.columns');
    if (!!localOrderColumns) {
      this.orderStorageColumns = JSON.parse(localOrderColumns);
      this.columns = this.orderStorageColumns.map((col) => {
        const foundCol = this.masterListOfColumns.find((item) => item.field === col.field);
        if (col.width) {
          return {
            ...foundCol,
            ...col,
            suppressSizeToFit: true,
          };
        }

        if (col.field === 'orderCode') return { ...foundCol, ...col };
        return { ...foundCol, ...col, suppressSizeToFit: false };
      });
    } else {
      this.columns = [...this.masterListOfColumns];
    }

    this.systemPrefsSub_ = this.store.select(selectSystemPreferences).subscribe((prefs) => {
      this.systemPreferences = prefs;
      this.showMaterialShortageAlerts = this.systemPreferences.showMaterialShortageAlerts;
      this.columns = this.columns.map((item) => {
        if (item.field === 'hasAlerts') {
          return {
            ...item,
            cellRendererParams: {
              showMaterialShortageAlerts: this.showMaterialShortageAlerts,
            },
          };
        }

        return item;
      });
      if (this.gridApi) {
        this.gridApi.setGridOption('columnDefs', this.sanitizeColumnDefs(this.columns));
      }
    });

    this.agGridOptions = {
      headerHeight: 25,
      defaultColDef: {
        sortable: true,
        resizable: true,
        //  headerValueGetter: params => {return this.$filter('translate')(params.colDef.headerName)},
        tooltipValueGetter: (params) => {
          if (typeof params.value === 'string') {
            return params.value;
          }
          return;
        },
      },
      columnDefs: this.sanitizeColumnDefs(this.columns),
      getRowId: (params: GetRowIdParams) => params.data.id,
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true,
      onSelectionChanged: this.onSelectionChanged,
      onColumnResized: this.onColumnResized,
      onColumnMoved: this.onColumnMoved,
      onDragStopped: this.onDragStopped,
      onSortChanged: this.onSortChanged,
      onGridReady: (params: GridReadyEvent<IJobSummaryDto>) => {
        this.gridApi = params.api;
      },
      enableCellChangeFlash: true,
      getRowClass: (params) => {
        return this.calculateRowClass(params.data);
      },
    };

    this.http
      .get<IUserColumnChoice[]>(`${Ams.Config.BASE_URL}/_api/user/settings/ordersColumns`)
      .subscribe((userColumns) => {
        console.log('order userColumns', userColumns);
        this.columns = this.columns.map((masterCol) => {
          const newCols = userColumns.find((x) => x.field === masterCol.field);
          return {
            ...masterCol,
            ...newCols,
            width: masterCol.width,
            hide: masterCol.hide, // we need to remove, when to save `hide` on sever.
          };
        });
        if (this.gridApi) {
          this.gridApi.setGridOption('columnDefs', this.sanitizeColumnDefs(this.columns));
          this.gridApi.sizeColumnsToFit();
        }
      });

    // Data Subscriptions
    this.ordersSub_ = this.daysAgoObs
      .pipe(
        tap((e) => localStorage.setItem('orders-list.daysAgo', e.daysAgo.toString())), // Side effect
        debounceTime(500), // Correct `debounceTime`
        switchMap((e) => clientDataStore.SelectJobSummariesAllRecent(e.daysAgo)), // Switch to new observable
        map((jobs) => jobs as IJobSummaryDto[]) // Type assertion
      )
      .subscribe((jobs) => {
        this.mainJobs = jobs //.filter(j => !j.isDeleted)
          .map((j) => ({
            ...j,
            hasAlerts:
              (j.patternNotDefined ? 2 : 0) +
              (j.materialShortageAlert && this.systemPreferences.showMaterialShortageAlerts
                ? 2
                : 0) +
              (j.hold ? 1 : 0),
          }));
        this.onEditPrintContent();

        if (this.gridApi) {
          let n = [];
          let u = [];
          let d = [];
          let newKnown: string[] = [];
          this.mainJobs.forEach((job) => {
            if (job.isDeleted) {
              d.push(job);
            } else {
              newKnown.push(job.id);
              if (this.knownJobIds.indexOf(job.id) >= 0) {
                u.push(job);
              } else {
                n.push(job);
              }
            }
          });
          this.knownJobIds = newKnown;
          this.gridApi.applyTransaction({
            add: n,
            update: u,
            remove: d,
          });

          // this.gridApi.sizeColumnsToFit();
        }
      });
  }

  mouseEnter(trigger) {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  mouseLeave(trigger) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }

  onChangeDaysAgo(item) {
    this.selectedDays = item;
    this.daysAgoObs.next({ daysAgo: this.selectedDays.value });
  }

  onSelectionChanged = () => {
    this.selectedOrdIds = this.gridApi.getSelectedRows().map((o) => o.ordId);
  };

  onColumnResized = (event) => {
    if (event.column) {
      this.currentWidth = event.column.actualWidth;
      this.currentId = event.column.colId;
      this.dragingType = 'sizing';
    }
  };

  onDragStopped = (event) => {
    let localColumns = [];
    if (this.dragingType === 'sizing') {
      this.columns = this.columns.map((col) => {
        let width = undefined;
        let isWidth = false;
        if (col.field === this.currentId) {
          width = this.currentWidth;
          isWidth = true;
        } else if (col.width) {
          width = col.width;
          isWidth = true;
        }
        const newItem = {
          field: col.field,
          hide: col.hide,
          sort: col.sort,
          width,
        };
        localColumns.push(newItem);
        return { ...col, width, suppressSizeToFit: isWidth };
      });
    } else if (this.dragingType === 'moving') {
      this.movingIndex = this.columns.findIndex((item) => item.field === this.currentId);
      const movedItem = this.columns[this.movingIndex];
      if (this.desIndex > this.movingIndex) {
        this.columns.splice(this.desIndex + 1, 0, movedItem);
        this.columns.splice(this.movingIndex, 1);
      } else {
        this.columns.splice(this.desIndex, 0, movedItem);
        this.columns.splice(this.movingIndex + 1, 1);
      }
      localColumns = this.columns.map((item) => ({
        field: item.field,
        width: item.width,
        hide: item.hide,
        sort: item.sort,
      }));
    }
    // this.gridApi.setGridOption('columnDefs', this.columns);
    localStorage.setItem('orders-list.columns', JSON.stringify(localColumns));
  };

  onReset() {
    localStorage.removeItem('orders-list.columns');
    this.columns = [...this.masterListOfColumns];
    this.gridApi.setGridOption('columnDefs', this.sanitizeColumnDefs(this.columns));
    this.gridApi.sizeColumnsToFit();
  }

  onColumnMoved = (event) => {
    if (event.column) {
      this.dragingType = 'moving';
      this.desIndex = event.toIndex;
      this.currentId = event.column.colId;
    }
  };

  onSortChanged = (event) => {
    let localColumns = [];
    const colState = this.gridApi.getColumnState();
    const sortColumns = colState
      .filter((s) => {
        return s.sort != null;
      })
      .map((s) => {
        return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
      });
    if (sortColumns.length > 0) {
      this.columns = this.columns.map((col) => {
        let sortDirection = '';
        if (col.field === sortColumns[0].colId) {
          sortDirection = sortColumns[0].sort;
        }
        const newItem = {
          field: col.field,
          hide: col.hide,
          sort: sortDirection,
          width: col.width,
        };
        localColumns.push(newItem);
        return { ...col, sort: sortDirection };
      });
      localStorage.setItem('orders-list.columns', JSON.stringify(localColumns));
    }
  };

  bulkEditField = () => {
    const dialogRef = this.dialog.open(BulkEditDialogComponent, {
      width: '400px',
      data: {
        ordIds: this.selectedOrdIds,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        gtag('event', 'orderList_bulkEdit', {
          event_category: 'orderList',
          event_label: 'Count',
          value: this.selectedOrdIds.length,
        });
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  };

  bulkDelete = () => {
    const dialogRef = this.dialog.open(BulkDeleteDialogComponent, {
      width: '400px',
      data: {
        ordIds: this.selectedOrdIds,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        gtag('event', 'orderList_bulkDelete', {
          event_category: 'orderList',
          event_label: 'Count',
          value: this.selectedOrdIds.length,
        });
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  };

  setHold = (onHold: boolean) => {
    this.http
      .post(`${Ams.Config.BASE_URL}/api/orders/sethold`, null, {
        params: {
          ordIds: this.selectedOrdIds,
          hold: onHold,
        },
      })
      .subscribe({
        next: (data) => {
          gtag('event', 'orderList_bulkHold', {
            event_category: 'orderList',
            event_label: 'bulkHold',
            value: this.selectedOrdIds.length,
          });
        },
        error: (e) => {
          this.toast('Hold change was not saved. ' + e.errors.join(' '));
        },
      });
  };

  onOrdersGridOptionsToggle = (column, $event) => {
    $event.stopPropagation();
    $event.preventDefault();
    column.hide = !column.hide;

    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.sanitizeColumnDefs(this.columns));
      this.gridApi.sizeColumnsToFit();
    }

    const data = this.columns.map((x) => ({
      field: x.field,
      isChecked: !x.hide,
      width: x.width,
    }));
    const localColumns = this.columns.map((item) => ({
      field: item.field,
      width: item.width,
      hide: item.hide,
    }));
    localStorage.setItem('orders-list.columns', JSON.stringify(localColumns));
    this.http
      .post<IUserColumnChoice[]>(`${Ams.Config.BASE_URL}/_api/user/settings/ordersColumns`, {
        data,
      })
      .subscribe({
        next: (data) => {},
        error: (e) => {},
      });

    // todo: this is not being used yet. it's currently just an example.
    this.http
      .post<any>(`${Ams.Config.BASE_URL}/_api/user/settings/preferences/orders-list.columns`, {
        value: JSON.stringify(data),
      })
      .subscribe({
        next: (data) => {},
        error: (e) => {},
      });
  };

  onFilter = () => {
    this.gridApi.setGridOption('quickFilterText', this.searchTxt);
  };

  onAddPrintHeader(mainComp) {
    const htmlStr = `
      <div id="main-print-body">
        <div id="print-content" class="print-content size-1117 pt-printer">
          <div class="page-content">
            <div class="print-content__main-titles">
              <div class="print-content__title1">Eclipsepro</div>
              <div class="print-content__title2">Orders</div>
            </div>
            <div class="print-content__main-table">
              ${mainComp}
            </div>
          </div>
        </div>
      </div>
    `;

    return htmlStr;
  }

  // todo: get the list of rows from the grid instead
  onPrintFilter(items) {
    this.searchFields = this.columns.filter((x) => !x.hide).map((x) => x.field);
    if (!Object.keys(this.searchData).length) return items;
    Object.keys(this.searchData).forEach(
      (key) => this.searchData[key] === undefined && delete this.searchData[key]
    );
    const filteredItems = items.filter((row) => {
      let match = true;
      Object.keys(this.searchData).forEach((key) => {
        switch (key) {
          case 'totalFt':
          case 'remainingFt': {
            if (
              !(row[key].toString().toLowerCase() + ' ft').match(this.searchData[key].toLowerCase())
            ) {
              match = false;
            }
            break;
          }
          case 'machineNumber': {
            if (row[key]?.toString().toLowerCase() !== this.searchData[key].toLowerCase()) {
              match = false;
            }
            break;
          }
          case 'estimatedCompleteTime': {
            if (!AmsDateTimePipe.prototype.transform(row[key]).match(this.searchData[key])) {
              match = false;
            }
            break;
          }
          case 'requiredDate':
          case 'completeDate':
          case 'importDate': {
            if (!AmsDatesPipe.prototype.transform(row[key]).match(this.searchData[key])) {
              match = false;
            }
            break;
          }
          case 'query': {
            let count = 0;
            match = false;
            this.searchFields.forEach((field) => {
              switch (field) {
                case 'totalFt':
                case 'remainingFt': {
                  if (
                    (row[field].toString().toLowerCase() + ' ft').match(
                      this.searchData[key].toLowerCase()
                    )
                  ) {
                    count++;
                  }
                  break;
                }
                case 'machineNumber': {
                  if (row[field]?.toString().toLowerCase() === this.searchData[key].toLowerCase()) {
                    count++;
                  }
                  break;
                }
                case 'estimatedCompleteTime': {
                  if (
                    !AmsDateTimePipe.prototype.transform(row[field]).match(this.searchData[key])
                  ) {
                    count++;
                  }
                  break;
                }
                case 'requiredDate':
                case 'completeDate':
                case 'importDate': {
                  if (AmsDatesPipe.prototype.transform(row[field]).match(this.searchData[key])) {
                    count++;
                  }
                  break;
                }
                default: {
                  if (
                    row[field].toString().toLowerCase().match(this.searchData[key].toLowerCase())
                  ) {
                    count++;
                  }
                  break;
                }
              }
            });
            if (count > 0) {
              match = true;
            }
            break;
          }
          default: {
            if (!row[key].toString().toLowerCase().match(this.searchData[key].toLowerCase())) {
              match = false;
            }
            break;
          }
        }
      });
      return match;
    });
    return filteredItems;
  }

  onGetMainData() {
    return this.onPrintFilter(this.mainJobs.filter((j) => !j.isDeleted));
  }

  onGetMainCol(val, field) {
    switch (field) {
      case 'totalFt':
      case 'remainingFt': {
        return `<div class="main-con">${this.unitsService.formatUserUnits(
          val,
          'ft',
          0,
          false,
          ''
        )}</div>`;
      }
      case 'shortestLengthIn':
      case 'longestLengthIn': {
        return `<div class="main-con">${this.unitsService.formatUserUnits(
          val,
          'in',
          0,
          false,
          ''
        )}</div>`;
      }
      case 'requiredDate':
      case 'importDate': {
        return `<div class="main-con">${AmsDatesPipe.prototype.transform(val)}</div>`;
      }
      case 'completionDate': {
        return `<div class="main-con">${AmsDateTimePipe.prototype.transform(val)}</div>`;
      }
      default: {
        return `<div class="main-con">${val}</div>`;
      }
    }
  }

  onGetRowForPrint(item) {
    this.searchFields = this.columns.filter((x) => !x.hide).map((x) => x.field);
    let row = `<div class="material-usage-item">`;
    this.searchFields.forEach((field) => {
      if (item[field]) {
        row += this.onGetMainCol(item[field], field);
      } else {
        row += `<div class="main-con"></div>`;
      }
    });
    row += '</div>';
    return row;
  }
  onGetMainPage() {
    let htmlStr = `<div class="xl-list-container wi-100">
                    <div class="material-usage-item sub-header">
                  `;
    this.searchFields = this.columns.filter((x) => !x.hide).map((x) => x.headerName);
    this.searchFields.forEach((item) => {
      let x = this.translate.instant(item);
      htmlStr += `<div class="main-con">${x}</div>`;
    });
    htmlStr += '</div>';
    const filteredJobs = this.onGetMainData();
    filteredJobs.forEach((item) => {
      htmlStr += this.onGetRowForPrint(item);
    });

    htmlStr += '</div>';
    return htmlStr;
  }

  onEditPrintContent() {
    let mainComp = document.getElementById('print-body');
    mainComp.innerHTML = '';
    let style = document.createElement('style');
    style.innerHTML = '@page {size: 11in 17in;}';
    document.head.appendChild(style);
    const mainStr = this.onGetMainPage();
    const htmlStr = this.onAddPrintHeader(mainStr);
    mainComp.insertAdjacentHTML('beforeend', htmlStr);
  }

  openPrintPreview = () => {
    window.print();
  };

  calculateRowClass(data: IJobSummaryDto): string {
    if (data.hold) {
      return 'row-state-hold';
    }
    switch (data.scheduleState.state) {
      case 'Scheduled':
        return data.scheduleState.isOnMachine ? 'row-state-machine' : 'row-state-scheduled';
      case 'Done':
        return 'row-state-done';
    }
    return '';
  }

  private sanitizeColumnDefs(columns: any[]): any[] {
    // remove properties that ag-gris doesn't like
    // todo: there should be a better way to do this.
    return columns.map((col) => {
      let { isChecked, $$hashKey, ...rest } = col;
      return rest;
    });
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.systemPrefsSub_.unsubscribe();
    this.ordersSub_.unsubscribe();
    let mainComp = document.getElementById('print-body');
    mainComp.innerHTML = '';
  }
}

import { Component, Inject, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Ams } from 'src/app/amsconfig';
// import {
//   ConsumptionSummaryForOrder,
//   ProducedBundlesForOrder,
// } from 'src/app/core/services/store/order/selectors';

import {
  selectSingleOrder,
  selectSingleOrderById,
  BundleRules,
  selectConsumptionSummaryForOrder,
  selectProducedBundlesForOrder,
} from '../../shared/services/store/order/selectors';
import {
  initSingleOrderAction,
  setRebundleResultAction,
  saveRebundleResultAction,
  cancelBundleResultAction,
} from '../../shared/services/store/order/actions';

import { putAction } from '../../shared/services/clientData.actions';
import { patchJobsAction } from '../../shared/services/store/scheduler/actions';

import {
  IBundleResult,
  IJobItem,
  BadRequestResponse,
  RebundleResult,
  IExportEvent,
  PatternDef,
  ISystemPreferences,
  IConsumptionHistoryMachine,
  IUserColumnChoice,
} from 'src/app/core/dto';
import { UserHasRole } from '../../shared/services/store/user/selector';
import { AmsDateTimePipe } from '../../shared/pipes/dates.pipe';
import { AmsDatesPipe } from '../../shared/pipes/dates.pipe';
import { TimeSpanPipe } from '../../shared/pipes/dates.pipe';
import { UnitsService } from '../../shared/services/units.service';
import { BundleTagCellComponent } from '../../shared/components/bundle-tag-cell/bundle-tag-cell.component';
import { SplitModalComponent } from './components/split-modal/split-modal.component';
import { CombineToNewBundlesDialogComponent } from './components/combine-to-new-bundles-dialog/combine-to-new-bundles-dialog.component';
import { ItemBulkEditDialogComponent } from './components/item-bulk-edit-dialog/item-bulk-edit-dialog.component';
import { OrderDefChangeDialogComponent } from './components/order-def-change-dialog/order-def-change-dialog.component';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { selectSystemPreferences } from '../../shared/services/store/misc/selectors';
declare let gtag;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnDestroy {
  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;
  order;
  productionData = [];
  consumptionHistory = [];
  producedBundleData: IBundleResult[] = [];

  bundleRules: BundleRules = {} as BundleRules;
  bundleCheckState = {};
  itemsCheckState = {};
  ordId: number;
  lastCheckedItemId = 0;
  userHasJobEditorRole = false;

  producedBundleColumns = [
    {
      field: 'bundleCode',
      headerName: 'Id',
    },
    {
      field: 'bundleNumber',
      headerName: 'Bundle',
    },
    {
      field: 'endTime',
      valueFormatter: (params) => {
        return AmsDateTimePipe.prototype.transform(params.value);
      },
      headerName: 'completed',
    },
    {
      field: 'totalQty',
      headerName: 'totalPieces',
    },
    {
      field: 'producedLengthIn',
      valueFormatter: (params) => {
        return this.unitsService.formatUserUnits(params.value, 'in', 0, false, 'ft');
      },
      headerName: 'good',
    },
    {
      field: 'scrapIn',
      valueFormatter: (params) => {
        return this.unitsService.formatUserUnits(params.value, 'in', 0, false, 'ft');
      },
      headerName: 'scrap',
    },
    //{field: 'scrapPct', cellFilter: 'unitsFormat:"%":0', headerName: 'scrapPercent', headerCellFilter: 'translate'},
    {
      field: 'runMinutes',
      valueFormatter: (params) => {
        return this.unitsService.formatUserUnits(params.value, 'min', 0, false, '');
      },
      headerName: 'running',
    },
    //{field: 'nonExemptMinutes', cellFilter: 'unitsFormat:"min":0', headerName: 'unscheduled', headerCellFilter: 'translate'},
    {
      field: 'longestLengthIn',
      valueFormatter: (params) => {
        return this.unitsService.formatUserUnits(params.value, 'in', 0, false, 'ft');
      },
      headerName: 'longest',
    },
    {
      field: 'finalMachineNumber',
      headerName: 'machine',
    },
    {
      field: 'bundleCode',
      headerName: 'Tag',
      cellRenderer: BundleTagCellComponent,
    },
  ];
  systemPreferences: ISystemPreferences;
  alerts: string[];
  printTemplates: string[] = [];

  productionSummaryColumns = [
    {
      field: 'productionDate',
      headerName: 'Production Date',
      hide: false,
      valueFormatter: (params) => {
        return AmsDatesPipe.prototype.transform(params.value);
      },
    },
    {
      field: 'goodPieceCount',
      headerName: 'Total Pieces',
      hide: false,
    },
    {
      field: 'goodFeet',
      headerName: 'Good',
      hide: false,
      valueFormatter: (params) => {
        console.log('2222233333333', params.value);
        return this._decimalPipe.transform(params.value, '1.2-2');
      },
    },
    {
      field: 'scrapFeet',
      headerName: 'Scrap',
      hide: false,
      valueFormatter: (params) => {
        return this._decimalPipe.transform(params.value, '1.2-2');
      },
    },
    {
      field: 'totalMinutes',
      headerName: 'Running',
      hide: false,
    },
    {
      field: 'machine.description',
      headerName: 'Machine',
      hide: false,
    },
    {
      field: 'coilSerialNumber',
      headerName: 'Coil ID',
      hide: false,
    },
  ];
  productionSummaryGridApi!: GridApi<IConsumptionHistoryMachine>;
  productionSummaryAgGridOptions: GridOptions = {
    headerHeight: 25,
    defaultColDef: {
      sortable: true,
    },
    columnDefs: this.productionSummaryColumns,
    onGridReady: (params: GridReadyEvent<IConsumptionHistoryMachine>) => {
      this.productionSummaryGridApi = params.api;
      this.loadProductionSummary();
    },
  };
  consumptionSummarySub_;
  bundleGridApi!: GridApi<IBundleResult>;
  bundleAgGridOptions: GridOptions = {
    headerHeight: 25,
    defaultColDef: {
      sortable: true,
      headerValueGetter: (params) => {
        return this.translate.instant(params.colDef.headerName);
      },
    },
    columnDefs: this.producedBundleColumns,
    onGridReady: (params: GridReadyEvent<IBundleResult>) => {
      this.bundleGridApi = params.api;
      this.loadBundleData();
    },
  };
  bundlesSub_;
  bundleHeight = 0;
  summaryHeight = 0;

  timedOutCloser;
  jobDetailsFilterSub_;
  consumptionSummaryFilterSub_;
  bundlesFilterSub_;
  jobDetailsSub_;
  systemPrefsSub_;
  userRoleSub_;
  isEditing = false;

  constructor(
    private store: Store,
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private translate: TranslateService,
    private unitsService: UnitsService,
    private _decimalPipe: DecimalPipe,
    private _datePipe: DatePipe
  ) {
    this.ordId = this.ordId = Number(this.route.snapshot.paramMap.get('id'));

    this.store.dispatch(initSingleOrderAction({ ordId: this.ordId }));

    this.systemPrefsSub_ = this.store.select(selectSystemPreferences).subscribe((prefs) => {
      this.systemPreferences = prefs;
    });

    // Data Subscriptions
    const filter: { property: 'ordId'; values: (string | number)[] } = {
      property: 'ordId',
      values: [this.ordId],
    };
    this.jobDetailsFilterSub_ = clientDataStore.SelectJobDetailIn(filter).subscribe();
    this.consumptionSummaryFilterSub_ = clientDataStore
      .SelectConsumptionHistoryIn(filter)
      .subscribe();
    this.bundlesFilterSub_ = clientDataStore.SelectBundleResultsIn(filter).subscribe();

    this.getBundleRules(this.ordId);

    this.jobDetailsSub_ = this.store
      .select(selectSingleOrderById(this.ordId))
      .subscribe((singleOrder) => {
        // There is a bug where the first emit is often null.
        if (singleOrder) {
          // the inline input editors will wipe out active user changes with an update.
          // So, we don't update if an editor control is open.
          if (this.isEditing) {
            return;
          }
          if (this.order && this.isPatchPending()) {
            // there are patch changes pending. Let's try to patch the changes back in.
            this.savePacket.forEach((p) => {
              let path = p.path.split('/');
              if (path.length > 2) {
                switch (path[1]) {
                  case 'job':
                    singleOrder.job[path[2]] = p.value;
                    break;
                  case 'items':
                    let targetItem = singleOrder.items.find((i) => i.itemId === Number(path[2]));
                    targetItem[path[3]] = p.value;
                    break;
                }
              }
            });
          }

          this.order = singleOrder;

          // Preserve the local sort - if there is one
          const idxColWithASort = this.itemHeaders.findIndex((h) => h.order !== 'none');
          if (idxColWithASort > -1) this.onOrderItems(idxColWithASort);

          this.updateAlerts();
          this.updateBundleChecksFromItems();
        }
      });

    this.http
      .get(`${Ams.Config.BASE_URL}/_api/user/settings/orderItemsColumns`)
      .subscribe((userColumns: IUserColumnChoice[]) => {
        this.itemHeaders.forEach((x) => {
          x.isVisible = userColumns.find((u) => u.field === x.field)?.isChecked ?? x.isVisible;
        });
      });

    this.http
      .get(`${Ams.Config.BASE_URL}/api/job/printTemplates`)
      .subscribe((printTemplates: string[]) => {
        this.printTemplates = printTemplates;
      });

    this.userRoleSub_ = this.store
      .select(UserHasRole('job-editor'))
      .subscribe((userHasJobEditorRole: boolean) => {
        this.userHasJobEditorRole = userHasJobEditorRole;
      });
  }

  ngOnDestroy(): void {
    this.jobDetailsFilterSub_.unsubscribe();
    this.jobDetailsSub_.unsubscribe();
    this.consumptionSummaryFilterSub_.unsubscribe();
    this.consumptionSummarySub_.unsubscribe();
    this.bundlesFilterSub_.unsubscribe();
    this.bundlesSub_.unsubscribe();
    this.userRoleSub_.unsubscribe();
    this.systemPrefsSub_.unsubscribe();
  }

  private toastUserCanNotEdit() {
    this._snackBar.openFromTemplate(this.snackBarTemplate, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 2000,
    });
  }

  loadProductionSummary() {
    this.consumptionSummarySub_ = this.store
      .select(selectConsumptionSummaryForOrder(this.ordId))
      .subscribe((consumptionHistory) => {
        console.log('3333333', consumptionHistory);
        this.summaryHeight = (consumptionHistory.length + 1) * 28;
        this.productionSummaryGridApi.setGridOption('rowData', consumptionHistory);
        this.productionSummaryGridApi.sizeColumnsToFit();
      });
  }

  loadBundleData() {
    this.bundlesSub_ = this.store
      .select(selectProducedBundlesForOrder(this.ordId))
      .subscribe((producedBundleData) => {
        this.bundleHeight = (producedBundleData.length + 1) * 28;
        this.bundleGridApi.setGridOption('rowData', producedBundleData);
        this.bundleGridApi.sizeColumnsToFit();
      });
  }

  selectedBundleCount() {
    return Object.values(this.bundleCheckState).filter((x) => x).length;
  }

  selectedBundleNos(): number[] {
    return Object.keys(this.bundleCheckState)
      .filter((key) => this.bundleCheckState[key])
      .map(Number);
  }

  onBundleChecked(bundleNo: number) {
    this.bundleCheckState[bundleNo] = !this.bundleCheckState[bundleNo];
    let checked = this.bundleCheckState[bundleNo];
    this.order.items
      .filter((i) => i.bundle === bundleNo)
      .forEach((i) => (this.itemsCheckState[i.itemId] = checked));
  }

  updateBundleChecksFromItems() {
    this.order.bundlesModel.forEach((b) => {
      let x = this.order.items
        .filter((i) => i.bundle === b.bundleNo)
        .every((i) => this.itemsCheckState[i.itemId] === true);
      this.bundleCheckState[b.bundleNo] = x;
    });
  }

  updateAlerts() {
    this.alerts = [];
    if (this.order.job.materialShortageAlert && this.systemPreferences.showMaterialShortageAlerts) {
      this.alerts.push('Material Shortage');
    }
    if (this.order.job.patternNotDefined) {
      this.alerts.push('Pattern Not Defined');
    }
  }

  doBundleAction(action: string) {
    console.log('Bundle action:', action);
  }

  itemHeaders: {
    field: keyof (IJobItem & { isVisible });
    order: 'asc' | 'desc' | 'none';
    title: string;
    isVisible: boolean;
    isEditable: boolean;
    units: string;
    unitDecimals: number;
  }[] = [
    {
      field: 'bundle',
      order: 'none',
      title: 'Bundle',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'lengthIn',
      order: 'none',
      title: 'Length',
      isVisible: true,
      isEditable: true,
      units: 'in',
      unitDecimals: 3,
    },
    {
      field: 'quantity',
      order: 'none',
      title: 'Pieces',
      isVisible: true,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'quantityDone',
      order: 'none',
      title: 'Pcs Done',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'patternName',
      order: 'none',
      title: 'Pattern',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
      //sref: 'app.punch-patterns_list.detail({id: pattern.patternName})'
    },
    {
      field: 'weightLbs',
      order: 'none',
      title: 'Weight',
      isVisible: true,
      isEditable: false,
      units: 'lbs',
      unitDecimals: 0,
    },
    {
      field: 'sequence',
      order: 'asc',
      title: 'Sequence',
      isEditable: false,
      isVisible: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'externalItemId',
      order: 'none',
      title: 'Item ID',
      isVisible: true,
      isEditable: false,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user1',
      order: 'none',
      title: 'itemUser1',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user2',
      order: 'none',
      title: 'itemUser2',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user3',
      order: 'none',
      title: 'itemUser3',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user4',
      order: 'none',
      title: 'itemUser4',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'user5',
      order: 'none',
      title: 'itemUser5',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'messageText',
      order: 'none',
      title: 'Message',
      isVisible: true,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'pieceMark',
      order: 'none',
      title: 'Piece Mark',
      isVisible: true,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'bundleGroup',
      order: 'none',
      title: 'bundleGroup',
      isVisible: true,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'partLabelDef',
      order: 'none',
      title: 'Part Label',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
    {
      field: 'bundleLabelDef',
      order: 'none',
      title: 'Bundle Label',
      isVisible: false,
      isEditable: true,
      units: '',
      unitDecimals: 0,
    },
  ];

  bundleChoices: { id: number; text: string }[] = [];

  onItemGridOptionsToggle(column, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    column.isVisible = !column.isVisible;

    let data = this.itemHeaders.map((x) => ({
      field: x.field,
      isChecked: x.isVisible,
    }));
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/user/settings/orderItemsColumns`, { data })
      .subscribe();
  }

  private onOrderItems(index) {
    const clickedHeader = this.itemHeaders[index];
    let sortOrder: 'asc' | 'desc' = clickedHeader.order === 'desc' ? 'desc' : 'asc'; // this is probably not needed but don't want to accidentally send 'none' to orderBy.
    this.order.items = _.orderBy(this.order.items, clickedHeader.field, sortOrder);
  }

  onClickItemHeader = (index) => {
    let nextOrder: 'asc' | 'desc' = this.itemHeaders[index].order === 'asc' ? 'desc' : 'asc'; // cycle between asc and desc. If none, start with asc.

    this.itemHeaders.forEach((item) => {
      item.order = 'none';
    });
    this.itemHeaders[index].order = nextOrder;
    this.onOrderItems(index);
  };

  onOrderChangeItemHeader = (index) => {
    let orderedItem = this.itemHeaders[index];
    if (orderedItem.order === 'asc') {
      orderedItem.order = 'desc';
    } else {
      orderedItem.order = 'asc';
    }

    this.onOrderItems(index);
  };

  itemsCheckedCount() {
    return this.CheckedItemIds.length;
  }

  onItemClicked = (item: IJobItem, $event) => {
    let isShifted = $event.shiftKey;
    // this might be tricky to determine. ng-click happens before the model is updated.
    // So, the inverse of the current checked value
    let isChecked = this.itemsCheckState[item.itemId] ?? false;
    if (!isChecked) {
      // using the inverse here
      if (isShifted && this.lastCheckedItemId !== 0) {
        // get range
        let lastIndex = this.order.items.map((i) => i.itemId).indexOf(this.lastCheckedItemId);
        let thisIndex = this.order.items.map((i) => i.itemId).indexOf(item.itemId);
        if (lastIndex < 0 || thisIndex < 0) {
          console.error(
            `unexpected range clicked. Last id:${this.lastCheckedItemId} (${lastIndex}), this id:${item.itemId} (${thisIndex})`
          );
          this.lastCheckedItemId = 0;
          return;
        }
        for (let x = Math.min(lastIndex, thisIndex); x < Math.max(lastIndex, thisIndex); x++) {
          if (x !== thisIndex)
            // don't modify the clicked item
            this.itemsCheckState[this.order.items[x].itemId] = true;
        }
      }
      this.lastCheckedItemId = item.itemId;
    } else {
      this.lastCheckedItemId = 0; //??
    }
  };
  onItemChanged = (item: IJobItem) => {
    this.updateBundleChecksFromItems();
  };

  isAllJobItemChecked = () => this.order.items.every((i) => this.itemsCheckState[i.itemId]);

  isJobItemIndeterminate = () =>
    this.order.items.some((i) => this.itemsCheckState[i.itemId]) && !this.isAllJobItemChecked();

  isBundleItemIndeterminate = (bundleNo: number) =>
    this.order.items
      .filter((i) => i.bundle === bundleNo)
      .some((i) => this.itemsCheckState[i.itemId]) && !this.bundleCheckState[bundleNo];

  onJobItemToggleAll = () => {
    const checkAllOrNone = this.itemsCheckedCount() < this.order.items.length;
    this.order.items.forEach((item) => {
      this.itemsCheckState[item.itemId] = checkAllOrNone;
    });
    this.updateBundleChecksFromItems();
  };

  savePacket: { value: string; path: string; op: string }[] = [];
  isPatchPending() {
    return this.savePacket.length > 0;
  }
  isRebundlePending() {
    return this.order.rebundleResult ? true : false;
  }
  assertNoPatchPending() {
    if (this.isPatchPending()) {
      this.toast('Cannot make this change until current changes are saved.');
      return true;
    }
    return false;
  }
  assertNoRebundlePending() {
    if (this.isRebundlePending()) {
      this.toast('Cannot make this change until rebundling changes are saved.');
      return true;
    }
    return false;
  }
  onChangeOrderDetail(value: number | string, path: string) {
    if (this.assertNoRebundlePending()) {
      return;
    }
    if (typeof value === 'number') {
      // Server requires a string, not a number.
      value = value.toString();
    }

    // remove any existing patches for this path
    this.savePacket = this.savePacket.filter((s) => s.path !== path);

    this.savePacket.push({ value, path, op: 'replace' });
    // this.$rootScope.$broadcast('warningSaved', true);
  }

  onInputEditorOpenClose(value: boolean) {
    this.isEditing = value;
  }

  onChangeItem(value: number | string, path: string, item) {
    if (this.assertNoRebundlePending()) {
      return;
    }
    if (typeof value === 'number') {
      // Server requires a string, not a number.
      value = value.toString();
    }
    const packet = {
      value: value.toString(),
      path: `/items/${item.itemId}/${path}`,
      op: 'replace',
    };
    console.log(`save item`, packet);

    // remove any existing patches for this path
    this.savePacket = this.savePacket.filter((s) => s.path !== packet.path);

    this.savePacket.push(packet);
    // this.$rootScope.$broadcast('warningSaved', true);
  }

  onChangeItemBundle(value: number | 'new', item: IJobItem) {
    if (this.assertNoPatchPending()) {
      return;
    }

    // If items are checked and the item that is being changed is checked, send the list. Otherwise, only send the item being changed.
    let itemIds =
      this.CheckedItemIds.indexOf(item.itemId) >= 0 ? this.CheckedItemIds : [item.itemId];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<RebundleResult>(
        `${Ams.Config.BASE_URL}/api/ordercommand/rebundle/combineitems`,
        {
          ordId: this.ordId,
          items: this.order.items,
          itemIds: itemIds,
          targetBundle: value === 'new' ? -1 : value,
          bundleGroupField: 'none',
        },
        httpOptions
      )
      .subscribe({
        next: (data) => {
          console.table(data.rebundledItems);
          this.dispatchBundleResult(data);
        },
        error: (e) => {
          this.toast('Order update failed: ' + e.error.errors.join('\n'));
        },
      });
  }

  loadBundleChoices(item: IJobItem) {
    this.bundleChoices = [...new Set(this.order.items.map((i) => i.bundle))] // Distinct bundles
      .map((bn) => ({
        id: Number(bn),
        text: bn.toString(),
      }));

    const allowSplit = this.order.items.filter((x) => x.bundle === item.bundle).length > 1;

    // Split to new is a nullop when the item is in a bundle by itself.
    if (allowSplit)
      // -1 is the magic number for new bundle
      this.bundleChoices.push({ id: -1, text: 'New' });
  }

  saveOrderDetailChanges() {
    console.log('saving', this.savePacket);
    if (!this.userHasJobEditorRole) {
      this.toastUserCanNotEdit();
      return;
    }
    this.http
      .patch(`${Ams.Config.BASE_URL}/api/ordercommand/${this.ordId}/savechanges`, {
        operations: this.savePacket,
      })
      .subscribe({
        next: (data) => {
          let packetSize = this.savePacket.length;
          this.savePacket = []; // success
          // this.$rootScope.$broadcast('warningSaved', false);
          this.toast('Order updates saved');
          gtag('event', 'orderDetail_save', {
            event_category: 'orderDetail',
            event_label: 'Changes',
            value: packetSize,
          });
        },
        error: (e) => {
          console.log('123444444', e);
          this.toast('Order update failed: ' + e.error.errors.join('\n'));
        },
      });
  }

  changeOrderDef() {
    if (!this.userHasJobEditorRole) {
      this.toastUserCanNotEdit();
      return;
    }
    if (this.assertNoPatchPending()) {
      return;
    }

    const dialogRef = this.dialog.open(OrderDefChangeDialogComponent, {
      width: '400px',
      data: {
        ordId: this.ordId,
        orderCode: this.order.job.orderCode,
        materialCode: this.order.job.materialCode,
        toolingCode: this.order.job.toolingCode,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        const filter: { property: 'ordId'; values: (string | number)[] } = {
          property: 'ordId',
          values: [this.ordId],
        };
        this.jobDetailsFilterSub_ = this.clientDataStore.SelectJobDetailIn(filter).subscribe();
      }
    });
  }

  onDeleteJob() {
    console.log('saving', this.savePacket);
    if (!this.userHasJobEditorRole) {
      this.toastUserCanNotEdit();
      return;
    }
    this.http.delete(Ams.Config.BASE_URL + `/api/job/${this.ordId}`).subscribe({
      next: () => {
        gtag('event', 'orderDetail_deleteOrder', {
          event_category: 'orderDetail',
        });
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.toast('Order delete failed');
      },
    });
  }

  bundlesActions = [
    {
      key: 'Resequence Bundles: Long to Short',
      doBundlesAction: () => this.resequence('BundlesByLengthDesc'),
      allowed: () => this.order.allowRebundling,
    },
    {
      key: 'Resequence Bundles: Short to Long',
      doBundlesAction: () => this.resequence('BundlesByLengthAsc'),
      allowed: () => this.order.allowRebundling,
    },
  ];
  itemsActions = [
    {
      key: 'Auto Rebundle Selected',
      doItemsAction: () => this.rebundleSelectedItems(),
      allowed: () => this.order.allowRebundling,
    },
    {
      key: 'Split Selected To Multiple Items...',
      doItemsAction: () => this.splitSelectedItems(),
      allowed: () => this.order.allowRebundling,
    },
    {
      key: 'Combine Selected To New Bundle(s)...',
      doItemsAction: () => this.combineSelectedItems(),
      allowed: () => this.order.allowRebundling,
    },
    {
      key: 'Resequence: By Bundle',
      doItemsAction: () => this.resequence('ByBundleNum'),
      allowed: () => this.order.allowRebundling,
    },
    {
      key: 'Resequence: By Bundle, then Long to Short',
      doItemsAction: () => this.resequence('ByBundleNumAscThenLengthDesc'),
      allowed: () => this.order.allowRebundling,
    },
    {
      key: 'Resequence: By Bundle, then Short to Long',
      doItemsAction: () => this.resequence('ByBundleNumAscThenLengthAsc'),
      allowed: () => this.order.allowRebundling,
    },
    {
      key: 'Bulk Edit Field',
      doItemsAction: () => this.bulkEditField(),
      allowed: () => true,
    },
  ];
  bundlesViews = [
    { icon: '', title: 'Collapsed', id: 0 },
    { icon: '', title: 'Carousel', id: 1 },
    { icon: '', title: 'Line Detail', id: 2 },
  ];
  selectedBundleView = this.bundlesViews[0];
  changeBundleView(view) {
    this.selectedBundleView = view;
  }
  get CheckedItemIds(): number[] {
    // Multiple rebundling operations can mean that itemsCheckState
    // contains members that refer to items that no longer exist.
    const existing = this.order.items.map((x) => x.itemId);
    return Object.keys(this.itemsCheckState)
      .filter((key) => this.itemsCheckState[key])
      .map(Number)
      .filter((x) => existing.includes(x));
  }
  get CheckedItems(): IJobItem[] {
    let checkedIds = this.CheckedItemIds;
    return this.order.items.filter((x) => checkedIds.includes(x.itemId));
  }
  rebundleSelectedItems() {
    console.log('rebundling items action');
    if (this.assertNoPatchPending()) {
      return;
    }
    //const itemsToRebundle = this.CheckedItems;
    const items = this.order.items;
    const itemIds = this.CheckedItemIds;

    this.rebundleItems({
      items: items,
      itemIds: itemIds,
      rules: this.bundleRules,
      ordId: this.ordId,
    });
  }

  rebundleItems(args: { items: IJobItem[]; itemIds: number[]; rules: BundleRules; ordId: number }) {
    this.http
      .post<RebundleResult>(`${Ams.Config.BASE_URL}/api/ordercommand/rebundle`, args)
      .subscribe({
        next: (data) => {
          this.dispatchBundleResult(data);
          gtag('event', 'orderDetail_rebundleItems', {
            event_category: 'orderDetail',
            event_label: 'Count',
            value: args.itemIds.length,
          });
        },
        error: (e) => {
          this.toast('Rebundle failed: ' + e.error.errors.join('\n'));
        },
      });
  }
  resequence(
    strategy:
      | 'ByBundleNumAscThenLengthDesc'
      | 'ByBundleNumAscThenLengthAsc'
      | 'ByBundleNum'
      | 'BundlesByLengthDesc'
      | 'BundlesByLengthAsc'
  ) {
    if (this.CheckedItems.length !== this.order.items.length) {
      this.toast('Resequencing does not apply to a partial order. Select all the items.');
      return;
    }
    this.http
      .post<RebundleResult>(
        `${Ams.Config.BASE_URL}/api/ordercommand/rebundle/resequencebystrategy`,
        {
          ordId: this.ordId,
          items: this.order.items,
          strategy: strategy,
        }
      )
      .subscribe({
        next: (data) => {
          this.dispatchBundleResult(data);
        },
        error: (e) => {
          this.toast('Rebundle failed: ' + e.error.errors.join('\n'));
        },
      });
  }

  cancelUnsavedChanges() {
    let packetSize = this.savePacket.length;
    this.savePacket = [];
    // this.$rootScope.$broadcast('warningSaved', false);
    this.store.dispatch(cancelBundleResultAction());
    gtag('event', 'orderDetail_cancel', {
      event_category: 'orderDetail',
      event_label: 'Bundles',
      value: packetSize,
    });
  }
  saveBundleChanges() {
    if (!this.userHasJobEditorRole) {
      this.toastUserCanNotEdit();
      return;
    }
    let packetSize = this.savePacket.length;
    this.store.dispatch(
      saveRebundleResultAction({
        ordId: this.order.ordId,
        rebundleResult: this.order.rebundleResult,
      })
    );
    gtag('event', 'orderDetail_save', {
      event_category: 'orderDetail',
      event_label: 'Bundles',
      value: packetSize,
    });
  }
  splitSelectedItems() {
    if (this.assertNoPatchPending()) {
      return;
    }
    const dialogRef = this.dialog.open(SplitModalComponent, {
      width: '400px',
      data: {
        ordId: this.ordId,
        items: this.order.items,
        itemIds: this.CheckedItemIds,
        maxPieces: this.order.bundlesModel[0].maxPieces || 0,
        maxWeight: this.order.bundlesModel[0].maxWeightLbs || 0,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Split modal closed');
    });
  }

  combineSelectedItems() {
    if (this.assertNoPatchPending()) {
      return;
    }
    const dialogRef = this.dialog.open(CombineToNewBundlesDialogComponent, {
      width: '400px',
      data: {
        ordId: this.ordId,
        items: this.order.items,
        itemIds: this.CheckedItemIds,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dispatchBundleResult(result);
        gtag('event', 'orderDetail_combineItems', {
          event_category: 'orderDetail',
          event_label: 'Count',
          value: this.CheckedItemIds.length,
        });
      }
    });
  }

  resequenceItems(nextSeq: number) {
    if (this.assertNoPatchPending()) {
      return;
    }
    console.log('pre-reseq', this.itemsCheckState);
    const items = this.order.items;
    const itemIds = this.CheckedItemIds;
    const ordId = this.ordId;
    const clientDataStore = this.clientDataStore;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post<RebundleResult>(
        `${Ams.Config.BASE_URL}/api/ordercommand/rebundle/resequence`,
        {
          ordId,
          items,
          itemIds,
          targetSeqPos: nextSeq,
        },
        httpOptions
      )
      .subscribe({
        next: (data) => {
          this.dispatchBundleResult(data);
          gtag('event', 'orderDetail_resequenceItems', {
            event_category: 'orderDetail',
            event_label: 'Count',
            value: items,
          });
        },
        error: (e) => {
          this.toast('Order update failed: ' + e.error.errors.join('\n'));
        },
      });
  }

  dispatchBundleResult(result: RebundleResult) {
    console.log('hasUnsavedBundleChanges');
    // this.$rootScope.$broadcast('warningSaved', true);
    this.store.dispatch(setRebundleResultAction({ rebundleResult: result }));
  }

  moveSequenceUp() {
    const checkedItems = this.CheckedItems;
    let minSeq = Math.min(...checkedItems.map((i) => i.sequence));
    this.resequenceItems(Math.max(minSeq - 1, 1));
  }

  canMoveSequenceUp() {
    // If it's position in the short checked items array is the same as it's
    // sequence, then it can't be moved.
    return this.CheckedItems.filter((item, i) => item.sequence !== i + 1).length > 0;
  }

  moveSequenceDown() {
    const checkedItems = this.CheckedItems;
    // we still take the min sequence otherwise it steps by the selected count
    let minSeq = Math.min(...checkedItems.map((i) => i.sequence));
    this.resequenceItems(minSeq + 1);
  }

  canMoveSequenceDown(): boolean {
    return (
      this.CheckedItems.filter(
        (item, i, items) => item.sequence !== this.order.items.length - (items.length - i - 1)
      ).length > 0
    );
  }

  bulkEditField = () => {
    const dialogRef = this.dialog.open(ItemBulkEditDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('result2', result);
        if (this.assertNoRebundlePending()) {
          return;
        }
        // if (typeof value === 'number') {
        //   // Server requires a string, not a number.
        //   value = value.toString();
        // }
        // todo: check that patternName is being mapped properly.
        this.CheckedItemIds.forEach((itemId) => {
          const packet = {
            value: result.bulkEditResult.value.toString(),
            path: `/items/${itemId}/${result.bulkEditResult.field}`,
            op: 'replace',
          };
          // remove any existing patches for this path
          this.savePacket = this.savePacket.filter((s) => s.path !== packet.path);
          this.savePacket.push(packet);
        });
      }
      gtag('event', 'orderDetail_bulkItemEdit', {
        event_category: 'orderDetail',
        event_label: 'Count',
        value: this.CheckedItemIds.length,
        // add modified field?
      });
    });
  };

  slickConfig4 = {
    method: {},
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
  };

  summaryHeaders = [
    {
      item: 'productionDate',
      order: 'asc',
      title: 'Production Date',
      checked: false,
    },
    {
      item: 'goodPieceCount',
      order: 'asc',
      title: 'Total Pieces',
      checked: false,
    },
    { item: 'goodFeet', order: 'asc', title: 'Good', checked: false },
    { item: 'scrapFeet', order: 'asc', title: 'Scrap', checked: true },
    {
      item: 'totalMinutes',
      order: 'asc',
      title: 'Running',
      checked: false,
    },
    {
      item: 'machineNumber',
      order: 'asc',
      title: 'Machine',
      checked: false,
    },
    {
      item: 'coilSerialNumber',
      order: 'asc',
      title: 'Coil ID',
      checked: false,
    },
  ];

  onOrderSummaries = (index) => {
    const selectedItem = this.summaryHeaders[index];
    let secondItem;
    if (index === 6) {
      secondItem = this.summaryHeaders[0];
    } else {
      secondItem = this.summaryHeaders[index + 1];
    }
    this.consumptionHistory = _.orderBy(
      this.consumptionHistory,
      [selectedItem.item, secondItem.item],
      [selectedItem.order, secondItem.order]
    );
  };

  onClickSummaryHeader = (index) => {
    this.summaryHeaders.forEach((item) => {
      item.checked = false;
    });
    this.summaryHeaders[index].checked = true;
    this.onOrderSummaries(index);
  };

  onOrderChangeSummaryHeader = (index) => {
    let orderedItem = this.summaryHeaders[index];
    if (orderedItem.order === 'asc') {
      orderedItem.order = 'desc';
    } else {
      orderedItem.order = 'asc';
    }

    this.onOrderSummaries(index);
  };

  openScheduleMenu = function ($mdMenu, ev) {
    $mdMenu.open(ev);
  };

  scheduleCommand = function (cmd) {
    console.log('schedule command:' + cmd.action);
    this.$http.post(`${Ams.Config.BASE_URL}/api/scheduleCommand`, cmd);
    //todo:modify the status until an update comes
    this.order.job.status = '...';
  };

  getBundleRules(ordId: number) {
    this.http
      .get(`${Ams.Config.BASE_URL}/api/job/${ordId}/bundlerules`)
      .subscribe((rules: BundleRules) => {
        this.bundleRules = rules;
        this.store.dispatch(putAction({ collection: 'BundleRules', payload: rules }));
      });
  }

  onToggleHold() {
    // if (!this.userHasSchedulerRole) {
    //   this.toastUserCanNotSchedule();
    //   return;
    // }

    const hold = !this.order.job.hold;
    this.http
      .post(`${Ams.Config.BASE_URL}/api/orders/sethold`, {
        ordIds: this.ordId,
        hold,
      })
      .subscribe({
        next: () => {
          // We need to fix
          // this.store.dispatch(patchJobsAction({ordIds: this.ordId, collection:  , patch: {hold}}))
          // this.clientDataStore.Dispatch(new PatchJobs(this.ordId, { hold }));
        },
        error: (e) => {
          this.toast(
            `Error: Schedule change was not saved. Most likely your Agent service is not running. [${e.statusText}]`
          );
        },
      });
  }

  onGetBundleHeight() {
    return {
      height: `${this.bundleHeight > 100 ? this.bundleHeight : 100}px`,
    };
  }

  onGetSummaryHeight() {
    return {
      height: `${this.summaryHeight > 100 ? this.summaryHeight : 100}px`,
    };
  }

  printBundle(bundleCode: string) {
    this.http.post<string>(`${Ams.Config.BASE_URL}/_api/bundle/${bundleCode}/print`, {}).subscribe({
      next: (data) => {
        this.toast(data);
      },
      error: (e) => {
        this.toast('Print failed.\n' + e.error.errors.join('\n'));
      },
    });
  }

  createPatternForName(patternName: string) {
    console.log(`create pattern ${patternName}`);
    this.router.navigate(['/punch-patterns'], {
      queryParams: { id: 'new', name: patternName }
    });
  }

  onChangePattern({ patternName, item }) {
    console.log(`change pattern ${patternName}`);
    this.onChangeItem(patternName, 'punchPattern', item);
  }

  onAddItemClick() {
    console.log('here');
    this.order.items.push({ ...this.order.items[0], quantity: 0 });
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  trackByIndex = (index: number): number => {
    return index;
  };

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
}

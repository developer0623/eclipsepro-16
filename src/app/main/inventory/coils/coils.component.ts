import { Component, Inject, OnDestroy } from '@angular/core';
import {
  GridOptions,
  GridApi,
  SortDirection,
  GetRowIdParams,
  ColDef,
  IRowNode,
} from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LinkHelperCellComponent } from '../../shared/components/link-helper-cell/link-helper-cell.component';
import { CheckboxCellComponent } from '../../shared/components/checkbox-cell/checkbox-cell.component';
import { UnitsService } from '../../shared/services/units.service';

import { ICoilDto, IUserColumnChoice } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { AmsDatesPipe } from '../../shared/pipes/dates.pipe';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-coils',
  templateUrl: './coils.component.html',
  styleUrls: ['./coils.component.scss'],
})
export class CoilsComponent implements OnDestroy {
  searchTxt = '';
  knownCoilIds: string[] = [];
  agGridOptions: GridOptions;
  coilsSub_: Subscription;
  showCompleted = false;

  masterListOfColumns = [
    {
      field: 'coilId',
      headerName: 'coilId',
      filter: 'agTextColumnFilter',
      hide: false,
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Coil',
        hideType: true,
      },
    },
    {
      field: 'materialCode',
      headerName: 'material',
      filter: 'agTextColumnFilter',
      hide: false,
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Material',
        hideType: true,
      },
    },
    {
      field: 'description',
      headerName: 'description',
      filter: 'agTextColumnFilter',
      hide: false,
    },
    {
      field: 'lengthRemainingFt',
      headerName: 'remaining',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 1, false, ''),
      hide: false,
    },
    {
      field: 'lengthStartFt',
      headerName: 'starting',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 1, false, ''),
      hide: false,
    },
    {
      field: 'lengthUsedFt',
      headerName: 'used',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 1, false, ''),
      hide: false,
    },
    {
      field: 'lengthNonExemptScrapFt',
      headerName: 'scrap',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 1, false, ''),
      hide: false,
    },
    {
      field: 'lengthOtherAdjustmentsFt',
      headerName: 'adjustments',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 1, false, ''),
      hide: true,
    },
    {
      field: 'dateIn',
      //cellFilter: 'age:row.entity.dateOut',
      headerName: 'dateIn',
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => AmsDatesPipe.prototype.transform(params.value),
      hide: false,
    },
    {
      field: 'location.name',
      headerName: 'location',
      filter: 'agTextColumnFilter',
      hide: true,
    },
    {
      field: 'vendorName',
      headerName: 'vendor',
      filter: 'agTextColumnFilter',
      hide: true,
    },
    {
      field: 'isComplete',
      headerName: 'complete',
      hide: false,
      cellRenderer: CheckboxCellComponent,
    },
    {
      field: 'isStarted',
      headerName: 'started',
      hide: false,
      cellRenderer: CheckboxCellComponent,
    },
    {
      field: 'currentWeightLbs',
      headerName: 'weight',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'lbs', 0, false, ''),
      hide: false,
    },
  ];

  columns: ColDef[];
  coils: ICoilDto[] = [];

  currentWidth = 0;
  currentId = '';
  desIndex = 0;
  movingIndex = 0;
  dragingType = 'sizing';
  private gridApi!: GridApi<ICoilDto>;

  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private unitsService: UnitsService,
    private translate: TranslateService
  ) {
    const localOrderColumns = localStorage.getItem('coil-list.columns');
    if (!!localOrderColumns) {
      const orderStorageColumns = JSON.parse(localOrderColumns);
      this.columns = orderStorageColumns.map((col) => {
        const foundCol = this.masterListOfColumns.find((item) => item.field === col.field);
        if (col.width) {
          return {
            ...foundCol,
            ...col,
            suppressSizeToFit: true,
          };
        }
        return { ...foundCol, ...col, suppressSizeToFit: false };
      });
    } else {
      this.columns = [...this.masterListOfColumns];
    }

    this.agGridOptions = {
      headerHeight: 25,
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,
        headerValueGetter: (params) => this.translate.instant(params.colDef.headerName),
        tooltipValueGetter: (params) => {
          if (typeof params.value === 'string') {
            return params.value;
          }
          return;
        },
      },
      columnDefs: this.columns,
      isExternalFilterPresent: (params: GetRowIdParams) => !!this.searchTxt || this.showCompleted,
      getRowId: (params: GetRowIdParams) => params.data.coilId,
      onColumnResized: this.onColumnResized,
      onColumnMoved: this.onColumnMoved,
      onDragStopped: this.onDragStopped,
      onSortChanged: this.onSortChanged,
      doesExternalFilterPass: (node: IRowNode<ICoilDto>) => this.doesExternalFilterPass(node),
      onGridReady: (params) => {
        this.gridApi = params.api;
      },
      enableCellChangeFlash: true,
    };

    this.http
      .get(`${Ams.Config.BASE_URL}/_api/user/settings/coilsColumns`)
      .subscribe((userColumns: IUserColumnChoice[]) => {
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
          this.gridApi.setGridOption('columnDefs', this.columns);
          this.gridApi.sizeColumnsToFit();
        }
      });

    this.coilsSub_ = clientDataStore
      .SelectCoilDtos()
      .pipe(debounceTime(500))
      .subscribe((coils) => {
        this.coils = coils;

        if (this.gridApi) {
          let n = [];
          let u = [];
          let d = [];
          let newKnown: string[] = [];
          coils.forEach((coil) => {
            newKnown.push(coil.coilId);
            if (this.knownCoilIds.indexOf(coil.coilId) >= 0) {
              u.push(coil);
            } else {
              n.push(coil);
            }
          });
          // remove anything that's not there anymore
          let idsToDelete = this.knownCoilIds.filter((x) => !newKnown.includes(x));
          d = this.coils.filter((c) => idsToDelete.includes(c.coilId));

          this.knownCoilIds = newKnown;
          this.gridApi.applyTransaction({
            add: n,
            update: u,
            remove: d,
          });
        }
      });
  }

  matchesSearchText(text, search) {
    return text.toString().toLowerCase().includes(search.toLowerCase());
  }

  doesExternalFilterPass(node: IRowNode<ICoilDto>): boolean {
    if (node.data) {
      if (!this.searchTxt && !this.showCompleted) return true;

      const searchTextMatches =
        this.searchTxt &&
        (this.matchesSearchText(node.data.coilId, this.searchTxt) ||
          this.matchesSearchText(node.data.materialCode, this.searchTxt) ||
          this.matchesSearchText(node.data.description, this.searchTxt));

      if (this.showCompleted) {
        return this.searchTxt ? searchTextMatches && node.data.isComplete : node.data.isComplete;
      }

      return searchTextMatches;
    }
    return true;
  }

  onColumnResized = (event) => {
    if (event.column) {
      this.currentWidth = event.column.actualWidth;
      this.currentId = event.column.colId;
      this.dragingType = 'sizing';
    }
  };

  // This function is called after changing the column order and width.
  // 'sizing' is for changing the width and 'moving' is for changing the order.
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
    localStorage.setItem('coil-list.columns', JSON.stringify(localColumns));
  };

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
        let sortDirection: SortDirection | undefined;
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
      localStorage.setItem('coil-list.columns', JSON.stringify(localColumns));
    }
  };

  onCoilsGridOptionsToggle = (column, $event) => {
    $event.stopPropagation();
    $event.preventDefault();
    column.hide = !column.hide;
    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.columns);
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
    localStorage.setItem('coil-list.columns', JSON.stringify(localColumns));

    this.http
      .post<IUserColumnChoice[]>(`${Ams.Config.BASE_URL}/_api/user/settings/coilsColumns`, {
        data,
      })
      .subscribe({
        next: (data) => {},
        error: (e) => {},
      });
  };

  onFilter = () => {
    this.gridApi.onFilterChanged();
  };

  onReset() {
    localStorage.removeItem('coil-list.columns');
    this.columns = [...this.masterListOfColumns];
    this.gridApi.setGridOption('columnDefs', this.columns);
    this.gridApi.sizeColumnsToFit();
  }

  openPrintPreview = () => {
    window.print();
  };

  ngOnDestroy(): void {
    this.coilsSub_.unsubscribe();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { GridOptions, GridApi, SortDirection, GetRowIdParams, ColDef } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LinkHelperCellComponent } from '../../shared/components/link-helper-cell/link-helper-cell.component';
import { UnitsService } from '../../shared/services/units.service';

import { IMaterialDto, IUserColumnChoice } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-coil-types',
  templateUrl: './coil-types.component.html',
  styleUrls: ['./coil-types.component.scss'],
})
export class CoilTypesComponent implements OnDestroy {
  searchTxt = '';
  knownCoilIds: string[] = [];
  agGridOptions: GridOptions;
  coilTypesSub_: Subscription;

  masterListOfColumns: ColDef[] = [
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
      field: 'onHandFt',
      headerName: 'onHand',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 0, false, ''),
      hide: false,
    },
    {
      field: 'demandFt',
      headerName: 'demand',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 0, false, ''),
      hide: false,
    },
    {
      field: 'balanceFt',
      headerName: 'balance',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 0, false, ''),
      hide: false,
    },
    {
      field: 'gauge',
      headerName: 'gauge',
      filter: 'agNumberColumnFilter',
      hide: false,
    },
    {
      field: 'thicknessIn',
      headerName: 'thickness',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 3, false, ''),
      hide: false,
    },
    {
      field: 'widthIn',
      headerName: 'width',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 3, false, ''),
      hide: false,
    }, //
    {
      field: 'color',
      headerName: 'color',
      filter: 'agTextColumnFilter',
      hide: false,
    },
    {
      field: 'type',
      headerName: 'materialType',
      filter: 'agTextColumnFilter',
      hide: false,
    },
    {
      field: 'lbsPerFt',
      headerName: 'lbsPerFt',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'lbs', 1, false, ''),
      hide: false,
    },
  ];

  columns: ColDef[];
  coilTypes: IMaterialDto[] = [];

  currentWidth = 0;
  currentId = '';
  desIndex = 0;
  movingIndex = 0;
  dragingType = 'sizing';
  private gridApi!: GridApi<IMaterialDto>;

  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private unitsService: UnitsService,
    private translate: TranslateService
  ) {
    const localOrderColumns = localStorage.getItem('material-list.columns');
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
        headerValueGetter: (params) => this.translate.instant(params.colDef.headerName),
        tooltipValueGetter: (params) => {
          if (typeof params.value === 'string') {
            return params.value;
          }
          return;
        },
      },
      columnDefs: this.columns,
      getRowId: (params: GetRowIdParams) => params.data.materialCode,
      onColumnResized: this.onColumnResized,
      onColumnMoved: this.onColumnMoved,
      onDragStopped: this.onDragStopped,
      onSortChanged: this.onSortChanged,
      onGridReady: (params) => {
        this.gridApi = params.api;
      },
      enableCellChangeFlash: true,
    };

    this.http
      .get(`${Ams.Config.BASE_URL}/_api/user/settings/coilTypesColumns`)
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

    this.coilTypesSub_ = clientDataStore
      .SelectCoilTypes()
      .pipe(
        debounceTime(500) // Waits 500ms after the last emission before processing
      )
      .subscribe((coilTypes) => {
        this.coilTypes = coilTypes;

        if (this.gridApi) {
          let n = [];
          let u = [];
          let newKnown: string[] = [];
          coilTypes.forEach((ct) => {
            newKnown.push(ct.materialCode);
            if (this.knownCoilIds.indexOf(ct.materialCode) >= 0) {
              u.push(ct);
            } else {
              n.push(ct);
            }
          });
          this.knownCoilIds = newKnown;
          this.gridApi.applyTransaction({
            add: n,
            update: u,
            remove: [],
          });
        }
      });
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
    localStorage.setItem('material-list.columns', JSON.stringify(localColumns));
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
      localStorage.setItem('material-list.columns', JSON.stringify(localColumns));
    }
  };

  onCoilTypesGridOptionsToggle = (column, $event) => {
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
    localStorage.setItem('material-list.columns', JSON.stringify(localColumns));

    this.http
      .post<IUserColumnChoice[]>(`${Ams.Config.BASE_URL}/_api/user/settings/coilTypesColumns`, {
        data,
      })
      .subscribe({
        next: (data) => {},
        error: (e) => {},
      });
  };

  onFilter = () => {
    this.gridApi.setGridOption('quickFilterText', this.searchTxt);
  };

  onReset() {
    localStorage.removeItem('material-list.columns');
    this.columns = [...this.masterListOfColumns];
    this.gridApi.setGridOption('columnDefs', this.columns);
    this.gridApi.sizeColumnsToFit();
  }

  openPrintPreview = () => {
    window.print();
  };

  ngOnDestroy(): void {
    this.coilTypesSub_.unsubscribe();
  }
}

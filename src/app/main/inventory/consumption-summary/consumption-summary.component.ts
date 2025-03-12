import { Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { GridOptions, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import * as _ from 'lodash';
import { IConsumptionHistory } from 'src/app/core/dto';
import { UnitsService } from '../../shared/services/units.service';
import { LinkHelperCellComponent } from '../../shared/components/link-helper-cell/link-helper-cell.component';
import { AmsDatesPipe } from '../../shared/pipes/dates.pipe';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-consumption-summary',
  templateUrl: './consumption-summary.component.html',
  styleUrls: ['./consumption-summary.component.scss'],
})
export class ConsumptionSummaryComponent implements OnDestroy, OnChanges {
  @Input() ordId: string;
  @Input() machine: number;
  @Input() coil: string;
  @Input() material: string;
  displayGroup: string = '';
  consumptionSummarySub_;
  agGridOptions: GridOptions<IConsumptionHistory>;
  columnList: ColDef[] = [
    {
      headerName: 'id',
      field: 'id',
      hide: true,
    },
    {
      headerName: 'date',
      field: 'productionDate',
      cellDataType: 'date',
      valueFormatter: (params) => {
        return AmsDatesPipe.prototype.transform(params.value);
      },
    },
    {
      headerName: 'machine',
      field: 'machineNumber', //todo: create filter or component
      filter: 'agTextColumnFilter',
      //displayGroup: 'machine'
    },
    {
      headerName: 'order',
      field: 'orderCode',
      filter: 'agTextColumnFilter',
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'JobDetail',
        hideType: true,
      },
    },
    {
      headerName: 'material',
      field: 'materialCode',
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Material',
        hideType: true,
      },
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'tooling',
      field: 'toolingCode',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'coil',
      field: 'coilSerialNumber',
      filter: 'agTextColumnFilter',
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Coil',
        hideType: true,
      },
      //displayGroup: "coil",
    },
    {
      headerName: 'Coil Material',
      field: 'coilMaterialCode',
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Material',
        hideType: true,
      },
      filter: 'agTextColumnFilter',
      cellClassRules: {
        'grid-cell-alert-frame': (params) =>
          params.value && params.value !== params.data.materialCode,
      },
      hide: true,
    },
    {
      headerName: 'good',
      field: 'goodPieceCount',
      filter: 'agNumberColumnFilter',
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
    },
    {
      headerName: 'scrap',
      field: 'scrapPieceCount',
      filter: 'agNumberColumnFilter',
      hide: true,
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
    },
    {
      headerName: 'totalLength',
      field: 'totalFeet',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
      hide: true,
    },
    {
      headerName: 'goodLength',
      field: 'goodFeet',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
    },
    {
      headerName: 'scrapLength',
      field: 'scrapFeet',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
    },
    {
      headerName: 'reclaimedScrapLength',
      field: 'reclaimedScrapFeet',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
    },
    {
      headerName: 'Duration',
      field: 'totalMinutes',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      //footerCellFilter: "number:2",
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
      hide: true,
    },
    {
      headerName: 'operationMinutes',
      field: 'operationMinutes',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      //footerCellFilter: "number:2",
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
      hide: true,
    },
    {
      headerName: 'runMinutes',
      field: 'runMinutes',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      //footerCellFilter: "number:2",
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
    },
    {
      headerName: 'nonExemptMinutes',
      field: 'nonExemptMinutes',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      //footerCellFilter: "number:2",
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
      hide: true,
    },
    {
      headerName: 'exemptMinutes',
      field: 'exemptMinutes',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      //footerCellFilter: "number:2",
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
      hide: true,
    },
    //fpm
    {
      headerName: 'avgFpm',
      field: 'avgFpm',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      hide: true,
    },
    {
      headerName: 'targetFpm',
      field: 'targetFpm',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      hide: true,
    },
    {
      headerName: 'ScrapPct',
      field: 'scrapPct',
      filter: 'agNumberColumnFilter',
      //cellFilter: "number:2",
      hide: true,
    },
  ];

  columType = '';
  private gridApi!: GridApi<IConsumptionHistory>;

  constructor(private clientDataStore: ClientDataStore, private unitsService: UnitsService) {
    this.displayGroup = this.ordId
      ? 'order'
      : this.coil
      ? 'coil'
      : this.material
      ? 'material'
      : 'all';

    this.columType = `${this.displayGroup}ConsumptionSummaryColumns`;

    const localSortitem = localStorage.getItem(this.columType);
    let sortedColumns = [];
    if (!!localSortitem) {
      const sortItem = JSON.parse(localSortitem);
      sortedColumns = this.columnList.map((col) => {
        if (col.field === sortItem.field) {
          return { ...col, sort: sortItem.direction };
        }
        return col;
      });
    } else {
      sortedColumns = [...this.columnList];
    }

    this.agGridOptions = {
      headerHeight: 25,
      columnDefs: sortedColumns,
      onSortChanged: this.onSortChanged,
      onGridReady: (params) => {
        this.gridApi = params.api;
      },
      defaultColDef: {
        sortable: true,
      },
    };
  }

  private refreshData() {
    let query;
    if (this.ordId) {
      query = { property: 'ordId', values: [this.ordId] };
    } else if (this.machine) {
      query = { property: 'machineNumber', values: [this.machine] };
    } else if (this.coil) {
      query = { property: 'coilSerialNumber', values: [this.coil] };
    } else if (this.material) {
      query = { property: 'materialCode', values: [this.material] };
    }
    //if (this.startDate) query = { ...query, startDate: this.startDate };
    //if (this.endDate) query = { ...query, endDate: this.endDate };

    if (_.isEmpty(query)) {
      // can't load unbounded results
      return;
    }

    this.consumptionSummarySub_ = this.clientDataStore
      .SelectConsumptionHistoryIn(query)
      .subscribe((history) => {
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', history);
          this.gridApi.sizeColumnsToFit();
        }
      });
  }

  onSortChanged = (event) => {
    const colState = this.gridApi.getColumnState();
    const sortColumns = colState
      .filter((s) => {
        return s.sort != null;
      })
      .map((s) => {
        return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
      });

    if (sortColumns.length > 0) {
      const sortItem = {
        field: sortColumns[0].colId,
        direction: sortColumns[0].sort,
      };
      localStorage.setItem(this.columType, JSON.stringify(sortItem));
    }
  };

  ngOnDestroy(): void {
    this.consumptionSummarySub_.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshData();
  }
}

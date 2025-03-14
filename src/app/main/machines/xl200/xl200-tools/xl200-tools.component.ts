import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GridOptions, GridApi, GetRowIdParams } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UnitsService } from 'src/app/main/shared/services/units.service';
import { IMachineTools, ITool } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-xl200-tools',
  templateUrl: './xl200-tools.component.html',
  styleUrls: ['./xl200-tools.component.scss'],
})
export class Xl200ToolsComponent implements OnChanges, OnInit {
  @Input() machineId: number;
  currentTools: IMachineTools = {} as IMachineTools;
  agGridOptions: GridOptions;
  masterListofToolColumns = [
    {
      field: 'tool',
      headerName: 'tool',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'name',
      headerName: 'toolName',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'press',
      headerName: 'press',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'gag',
      headerName: 'gag',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'offsetIn',
      headerName: 'xOffset',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 3, false, ''),
    },
    {
      field: 'yOffsetIn',
      headerName: 'yOffset',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 3, false, ''),
    },
    {
      field: 'axis',
      headerName: 'Axis',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'kerfAdjustIn',
      headerName: 'Kerf Adjustment',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 3, false, ''),
    },
  ];
  private gridApi!: GridApi<ITool>;

  constructor(
    private unitsService: UnitsService,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

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
      localStorage.setItem('xl200.tools.columnsSort', JSON.stringify(sortItem));
    }
  };

  onSizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  ngOnInit(): void {
    const localSortitem = localStorage.getItem('xl200.tools.columnsSort');
    let sortedColumns = [];
    if (!!localSortitem) {
      const sortItem = JSON.parse(localSortitem);
      sortedColumns = this.masterListofToolColumns.map((col) => {
        if (col.field === sortItem.field) {
          return { ...col, sort: sortItem.direction };
        }
        return col;
      });
    } else {
      sortedColumns = [...this.masterListofToolColumns];
    }
    this.agGridOptions = {
      autoSizeStrategy: {
        type: 'fitGridWidth',
      },
      headerHeight: 25,
      defaultColDef: {
        sortable: true,
        //resizable: true,
        headerValueGetter: (params) => this.translate.instant(params.colDef.headerName),
        tooltipValueGetter: (params) => {
          if (typeof params.value === 'string') {
            return params.value;
          }
          return;
        },
      },
      columnDefs: sortedColumns, //this.columns.map(({isChecked, ...rest}) => {return {...rest, hide: !isChecked}}),
      getRowId: (params: GetRowIdParams) => params.data.tool,
      enableCellChangeFlash: true,
      onSortChanged: this.onSortChanged,
      onGridReady: (params) => {
        this.gridApi = params.api;
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.machineId && changes.machineId.currentValue) {
      this.http
        .get<IMachineTools[]>(`${Ams.Config.BASE_URL}/_api/machine/${this.machineId}/tools`)
        .subscribe((data) => {
          this.currentTools = data[0];
          if (this.gridApi) {
            this.gridApi.setGridOption('rowData', this.currentTools.tools);
          }
        });
    }
  }
}

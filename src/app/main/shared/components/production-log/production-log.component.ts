import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GridOptions, GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LinkHelperCellComponent } from '../link-helper-cell/link-helper-cell.component';
import { UnitsService } from '../../services/units.service';
import { IProductionEvent } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-production-log',
  templateUrl: './production-log.component.html',
  styleUrls: ['./production-log.component.scss'],
})
export class ProductionLogComponent implements OnChanges, OnInit, OnDestroy {
  @Input() ordId: number;
  @Input() machines: number | number[];
  @Input() shiftCode: string = '';
  @Input() coil: string = '';
  @Input() patternName: string = '';
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() shifts: number[];
  @Input() domLayout = 'autoHeight';

  group = '';
  displayGroup: string = '';
  agGridOptions: GridOptions<IProductionEvent>;
  masterListOfColumns = [
    {
      headerName: 'eventType',
      field: 'eventTitle',
      filter: 'agTextColumnFilter',
      minWidth: 100,
      hide: false,
    },
    {
      headerName: 'date',
      field: 'recordDate',
      cellDataType: 'date',
      valueFormatter: (params) => {
        let dateIn = moment(params.value);
        if (dateIn.isBefore('1980-01-02')) {
          return '';
        }
        //todo:review this format
        dateIn.add(0.5, 'seconds').startOf('second'); //round to nearest second
        return dateIn.format('L') + ' ' + dateIn.format('LT');
      },
      minWidth: 120,
      hide: false,
    },
    //// I wanted to keep date and time as separate columns, but it's not working because of the way
    //// we keep the selected list of keys.
    //   {
    //     headerName: 'time',
    //     field: 'recordDate',
    //     //type: "timeColumn",
    //     valueFormatter: (params) => {
    //       return this.$filter('amsTime')(params.value);
    //     },
    //     minWidth: 90,
    //     hide: false,
    //   },
    {
      headerName: 'machine',
      field: 'machineDescription',
      filter: 'agTextColumnFilter',
      displayGroup: 'machine',
      hide: false,
    },
    {
      // if the row is of type 'log', we replace Order and the rest with the message
      headerName: 'order',
      field: 'orderCode',
      filter: 'agTextColumnFilter',
      hide: false,
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'JobDetail',
        hideType: true,
      },
      colSpan: (params) =>
        params.data.eventTitle === 'log' ||
        params.data.eventTitle === 'error' ||
        params.data.eventTitle === 'setupsChange'
          ? 20
          : 1,
    },
    {
      headerName: 'bundle',
      field: 'bundle',
      filter: 'agNumberColumnFilter',
      hide: false,
      cellClassRules: {
        'grid-cell-alert-text': (params) => params.value >= 900,
      },
    },
    {
      headerName: 'partLength',
      field: 'partLengthIn',
      filter: 'agNumberColumnFilter',
      hide: false,
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'in', 3, false, ''),
    },
    {
      headerName: 'quantity',
      field: 'quantity',
      filter: 'agNumberColumnFilter',
      hide: false,
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
    },
    {
      headerName: 'produced',
      field: 'producedLengthFt',
      filter: 'agNumberColumnFilter',
      hide: false,
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
      //aggregationType: this.uiGridConstants.aggregationTypes.sum,
    },
    {
      headerName: 'consumed',
      field: 'consumedLengthFt',
      filter: 'agNumberColumnFilter',
      hide: false,
      valueFormatter: (params) =>
        this.unitsService.formatUserUnits(params.value, 'ft', 2, false, ''),
      cellClassRules: {
        // todo: remove kerf
        'grid-cell-alert-text': (params) => params.data.scrapFt + params.data.exemptScrapFt >= 0.5,
      },
      // aggregationType: this.uiGridConstants.aggregationTypes.sum,
    },
    {
      headerName: 'coil',
      field: 'coilSerialNumber',
      filter: 'agTextColumnFilter',
      hide: false,
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Coil',
        hideType: true,
      },
      displayGroup: 'coil',
    },
    {
      headerName: 'coilsMaterial',
      field: 'coilMaterialCode',
      hide: false,
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'Material',
        hideType: true,
      },
      filter: 'agTextColumnFilter',
      cellClassRules: {
        'grid-cell-alert-frame': (params) =>
          params.value && params.data.materialCode && params.value !== params.data.materialCode,
      },
    },
    {
      headerName: 'itemId',
      field: 'externalItemId',
      filter: 'agTextColumnFilter',
      hide: false,
    },
    {
      headerName: 'patternName',
      field: 'patternName',
      filter: 'agTextColumnFilter',
      cellRenderer: LinkHelperCellComponent,
      cellRendererParams: {
        docType: 'PunchPattern',
        hideType: true,
      },
      displayGroup: 'patternName',
      hide: false,
    },
    {
      headerName: 'duration',
      field: 'durationMinutes',
      filter: 'agNumberColumnFilter',
      hide: false,
      cellClassRules: {
        'grid-cell-alert-text': (params) => params.data.downMinutes + params.data.exemptMinutes > 0,
      },
      //cellFilter: "number:2",
      //footerCellFilter: "number:2",
      // aggregationType: this.uiGridConstants.aggregationTypes.sum,
    },
    {
      headerName: 'description',
      field: 'lossDescription',
      filter: 'agTextColumnFilter',
      hide: false,
    },
    {
      headerName: 'workGroup',
      field: 'workGroup',
      filter: 'agTextColumnFilter',
      hide: true,
    },
    {
      headerName: 'processedDate',
      field: 'processedDate',
      valueFormatter: (params) => {
        let dateIn = moment(params.value);
        if (dateIn.isBefore('1980-01-02')) {
          return '';
        }
        //todo:review this format
        dateIn.add(0.5, 'seconds').startOf('second'); //round to nearest second
        return dateIn.format('L') + ' ' + dateIn.format('LT');
      },
      hide: true,
    },
    {
      headerName: 'employeeName',
      field: 'employeeName',
      filter: 'agTextColumnFilter',
      hide: true,
    },
    {
      headerName: 'employeeNumber',
      field: 'employeeNumber',
      filter: 'agTextColumnFilter',
      hide: true,
    },
    {
      headerName: 'heatNumber',
      field: 'heatNumber',
      filter: 'agTextColumnFilter',
      hide: true,
    },
    {
      headerName: 'bundleId',
      field: 'bundleId',
      filter: 'agTextColumnFilter',
      hide: true,
    },
    {
      headerName: 'coilChanged',
      field: 'coilChange',
      filter: 'agNumberColumnFilter',
      hide: true,
    },
    {
      headerName: 'materialChanged',
      field: 'materialChange',
      filter: 'agNumberColumnFilter',
      hide: true,
    },
    {
      headerName: 'toolingChanged',
      field: 'toolingChange',
      filter: 'agNumberColumnFilter',
      hide: true,
    },
    {
      headerName: 'materialDeviation',
      field: 'toolingChange',
      filter: 'agNumberColumnFilter',
      hide: true,
    },
  ];
  columns;

  currentWidth = 0;
  currentId = '';
  desIndex = 0;
  movingIndex = 0;
  dragingType = 'sizing';
  columType = '';
  private gridApi!: GridApi<IProductionEvent>;

  constructor(
    private unitsService: UnitsService,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  private refreshData() {
    let query = {};
    if (this.ordId) query = { ...query, ordId: this.ordId };
    if (this.machines) query = { ...query, machines: this.machines };
    if (this.shiftCode) query = { ...query, shiftCode: this.shiftCode };
    if (this.coil) query = { ...query, coilSerialNumber: this.coil };
    if (this.patternName) query = { ...query, patternName: this.patternName };
    if (this.startDate) query = { ...query, startDate: this.startDate };
    if (this.endDate) query = { ...query, endDate: this.endDate };
    if (this.shifts) query = { ...query, shifts: this.shifts };

    if (_.isEmpty(query)) {
      // can't load unbounded results
      return;
    }

    // don't send a bad request if we don't have enough info
    // machine dashboard doesn't always have shiftCode property on group
    if (query['machines'] && !query['shiftCode'] && (!query['startDate'] || !query['endDate'])) {
      console.log('missing shiftCode or date range');
      return;
    }

    // todo: now that we know the filter, we should update columns based on displayGroup

    this.http
      .get<IProductionEvent[]>(Ams.Config.BASE_URL + '/_api/productionEvents', {
        params: query,
      })
      .subscribe((data: IProductionEvent[]) => {
        this.gridApi.setGridOption('rowData', data);
        this.gridApi.sizeColumnsToFit();
      });
  }

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
    // this.agGridOptions.api.setColumnDefs(this.columns);
    localStorage.setItem(this.columType, JSON.stringify(localColumns));
  };

  onReset() {
    localStorage.removeItem(this.columType);
    this.columns = [
      ...this.masterListOfColumns
        .filter((c) => c.displayGroup !== this.displayGroup)
        .map(({ displayGroup, ...rest }) => rest),
    ];
    this.gridApi.setGridOption('columnDefs', this.columns);
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
      localStorage.setItem(this.columType, JSON.stringify(localColumns));
    }
  };

  onColumnToggle(column, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    column.hide = !column.hide;

    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.columns);
      this.gridApi.sizeColumnsToFit();
    }

    const localColumns = this.columns.map((item) => ({
      field: item.field,
      width: item.width,
      hide: item.hide,
    }));
    localStorage.setItem(this.columType, JSON.stringify(localColumns));
  }

  onSizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.gridApi) {
      this.refreshData();
    }
  }

  ngOnInit(): void {
    this.displayGroup = this.ordId
      ? 'order'
      : this.shiftCode
      ? 'machine'
      : this.coil
      ? 'coil'
      : this.patternName
      ? 'patternName'
      : 'all';

    this.columType = `production-log.${this.displayGroup}.columns`;

    const localOrderColumns = localStorage.getItem(this.columType);
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
      this.columns = [
        ...this.masterListOfColumns
          .filter((c) => c.displayGroup !== this.displayGroup)
          .map(({ displayGroup, ...rest }) => rest),
      ];
    }

    this.agGridOptions = {
      headerHeight: 25,
      columnDefs: this.columns,
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
      onColumnResized: this.onColumnResized,
      onColumnMoved: this.onColumnMoved,
      onDragStopped: this.onDragStopped,
      onSortChanged: this.onSortChanged,
      onGridReady: (params) => {
        this.gridApi = params.api;
        this.refreshData();
      },
    };
  }

  onFilter(searchTxt) {
    this.gridApi.setGridOption('quickFilterText', searchTxt);
  }

  ngOnDestroy(): void {}
}

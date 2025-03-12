import { Component, OnDestroy } from '@angular/core';
import { GridOptions, GridApi, GridReadyEvent, GetRowIdParams, ColDef } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { LinkHelperCellComponent } from '../../shared/components/link-helper-cell/link-helper-cell.component';
import { ICoilDtoLocation, IMaterialDto } from 'src/app/core/dto';
import { UnitsService } from '../../shared/services/units.service';
import { MaterialEditDialogComponent } from '../material-edit-dialog/material-edit-dialog.component';
import { AmsDatesPipe } from '../../shared/pipes/dates.pipe';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-coil-type-detail',
  templateUrl: './coil-type-detail.component.html',
  styleUrls: ['./coil-type-detail.component.scss'],
})
export class CoilTypeDetailComponent implements OnDestroy {
  materialCode: string;
  coilType: IMaterialDto = {} as IMaterialDto;
  coilList = [];
  knownCoilIds: string[] = [];
  agCoilGridOptions: GridOptions;
  masterListofColumns: ColDef[] = [
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
      field: 'lengthUsedFt',
      headerName: 'used',
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
      headerName: 'dateIn',
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => AmsDatesPipe.prototype.transform(params.value),
      hide: false,
    },
    {
      field: 'location.name',
      headerName: 'location',
      filter: 'agTextColumnFilter',
      hide: false,
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
      cellRenderer: (params) => {
        return `<input type="checkbox" [checked]="${params.value}"></input>`;
      },
    },
    {
      field: 'isStarted',
      headerName: 'started',
      hide: false,
      cellRenderer: (params) => {
        return `<input type="checkbox" [checked]="${params.value}"></input>`;
      },
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
  columns = this.masterListofColumns;
  private gridApi!: GridApi<ICoilDtoLocation>;

  subscriptions_: Subscription[] = [];

  constructor(
    private clientDataStore: ClientDataStore,
    private unitsService: UnitsService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    public dialog: MatDialog
  ) {
    this.materialCode = this.route.snapshot.paramMap.get('id');
    const localSortitem = localStorage.getItem('material.coils.columnsSort');
    if (!!localSortitem) {
      const sortItem = JSON.parse(localSortitem);
      this.columns = this.masterListofColumns.map((col) => {
        if (col.field === sortItem.field) {
          return { ...col, sort: sortItem.direction };
        }
        return col;
      });
    } else {
      this.columns = [...this.masterListofColumns];
    }

    this.agCoilGridOptions = {
      headerHeight: 25,
      defaultColDef: {
        sortable: true,
        headerValueGetter: (params) => this.translate.instant(params.colDef.headerName),
        tooltipValueGetter: (params) => {
          if (typeof params.value === 'string') {
            return params.value;
          }
          return;
        },
      },
      columnDefs: this.columns,
      getRowId: (params: GetRowIdParams) => params.data.id,
      enableCellChangeFlash: true,
      onSortChanged: this.onSortChanged,
      onGridReady: (params: GridReadyEvent<ICoilDtoLocation>) => {
        this.gridApi = params.api;
      },
    };
    //// Data Subscriptions
    this.subscriptions_ = [
      clientDataStore
        .SelectCoilTypes()
        .pipe(
          map((cts) => cts.find((ct) => ct.materialCode === this.materialCode)),
          filter((ct) => !!ct)
        )
        .subscribe((coilType) => {
          console.log('111111', coilType);
          this.coilType = coilType as IMaterialDto;
        }),
      clientDataStore
        .SelectCoilDtosIn({
          property: 'MaterialCode',
          values: [this.materialCode],
        })
        .subscribe((coils) => {
          //this.coilsGridOptions.data = coils;if (this.agGridOptions.api) {
          let n = [];
          let u = [];
          let d = [];
          let newKnown: string[] = [];
          if (this.gridApi) {
            coils.forEach((coil) => {
              newKnown.push(coil.coilId);
              if (this.knownCoilIds.indexOf(coil.coilId) >= 0) {
                u.push(coil);
              } else {
                n.push(coil);
              }
            });
            this.knownCoilIds = newKnown;
            this.gridApi.applyTransaction({
              add: n,
              update: u,
              remove: d,
            });

            this.gridApi.sizeColumnsToFit();
          }
        }),
    ];
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
      localStorage.setItem('material.coils.columnsSort', JSON.stringify(sortItem));
    }
  };

  editDialog() {
    const dialogRef = this.dialog.open(MaterialEditDialogComponent, {
      width: '600px',
      data: {
        coilType: { ...this.coilType },
      },
    });

    dialogRef.afterClosed().subscribe((result: IMaterialDto | undefined) => {
      if (result) {
        this.coilType = { ...result };
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((s) => s.unsubscribe());
  }
}

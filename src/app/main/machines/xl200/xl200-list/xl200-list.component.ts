import { Component, Inject, OnDestroy } from '@angular/core';
import { GridOptions, GridApi, ColDef, GetRowIdParams } from 'ag-grid-community';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { ClientDataStore } from 'src/app/main/shared/services/clientData.store';
import { Ams } from 'src/app/amsconfig';
import { IMachine, IUserColumnChoice } from 'src/app/core/dto';
import { UserHasRoles } from '../../../shared/services/store/user/selector';

@Component({
  selector: 'app-xl200-list',
  templateUrl: './xl200-list.component.html',
  styleUrls: ['./xl200-list.component.scss'],
})
export class Xl200ListComponent implements OnDestroy {
  userHasAdminRole = false;

  masterListOfColumns: ColDef[] = [
    {
      field: 'machineNumber',
      headerName: 'machineNumber',
      hide: false,
    },
    {
      field: 'description',
      headerName: 'description',
      hide: false,
    },
    {
      field: 'ipAddress',
      headerName: 'ipAddress',
      hide: false,
    },
    {
      field: 'commName',
      headerName: 'commName',
      hide: false,
    },
    {
      field: 'softwareModel',
      headerName: 'softwareModel',
      hide: false,
    },
    {
      field: 'softwareVersion',
      headerName: 'softwareVersion',
      hide: false,
    },
    {
      field: 'uartVersion',
      headerName: 'uartVersion',
      hide: false,
    },
    {
      field: 'serialNumber',
      headerName: 'serialNumber',
      hide: false,
    },
    {
      field: 'machineGroup',
      headerName: 'machineGroup',
      hide: false,
    },
  ];
  columns = this.masterListOfColumns;
  subscriptions_: Subscription[] = [];
  machines: IMachine[] = [];
  agGridOptions: GridOptions<IMachine> = {
    headerHeight: 25,
    columnDefs: this.columns,
    defaultColDef: {
      sortable: true,
      resizable: true,
      headerValueGetter: (params) => this.translate.instant(params.colDef.headerName),
    },
    onGridReady: (params) => {
      this.gridApi = params.api;
      if (this.machines.length > 0) {
        this.gridApi.setGridOption('rowData', this.machines);
        this.gridApi.sizeColumnsToFit();
      }
    },
    rowSelection: 'single',
    onSelectionChanged: () => {
      const selectedRows = this.gridApi!.getSelectedRows();
      this.router.navigate(['/machines/xl200', selectedRows[0].id]);
    },
  };
  private gridApi: GridApi<IMachine>;

  constructor(
    private clientDataStore: ClientDataStore,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private store: Store
  ) {
    this.subscriptions_ = [
      clientDataStore
        .SelectMachines()
        .pipe(
          filter((ms) => ms && ms.length > 0), // Ensures non-empty array
          map((ms) => ms.slice().sort((a, b) => a.description.localeCompare(b.description))) // Sorts machines
        )
        .subscribe((machines) => {
          console.log('machines', machines);
          this.machines = machines;
          if (this.gridApi) {
            this.gridApi.setGridOption('rowData', machines);
            this.gridApi.sizeColumnsToFit();
          }

          // this.machines = machines;
        }),

      this.store
        .select(UserHasRoles(['administrator', 'machine-manager'], false))
        .subscribe((userHasAdminRole) => {
          this.userHasAdminRole = userHasAdminRole;
        }),
    ];

    this.http
      .get(`${Ams.Config.BASE_URL}/_api/user/settings/machineColumns`)
      .subscribe((userColumns: IUserColumnChoice[]) => {
        console.log('123123123', userColumns);
        this.columns = this.columns.map((masterCol) => {
          const newCols = userColumns.find((x) => x.field === masterCol.field);
          return {
            ...masterCol,
            ...newCols,
          };
        });
        if (this.gridApi) {
          this.gridApi.setGridOption('columnDefs', this.columns);
          this.gridApi.sizeColumnsToFit();
        }
      });
  }

  onColumnsGridOptionsToggle = (column, $event) => {
    $event.stopPropagation();
    $event.preventDefault();
    column.hide = !column.hide;

    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.columns);
      this.gridApi.sizeColumnsToFit();
    }

    // const data = this.columns.map((x) => ({
    //   field: x.field,
    //   isChecked: !x.hide,
    //   width: x.width,
    // }));
    // const localColumns = this.columns.map((item) => ({
    //   field: item.field,
    //   width: item.width,
    //   hide: item.hide,
    // }));
    // localStorage.setItem(
    //   'orders-list.columns',
    //   JSON.stringify(localColumns)
    // );
    this.http
      .post<IUserColumnChoice[]>(`${Ams.Config.BASE_URL}/_api/user/settings/machineColumns`, {
        data: this.columns,
      })
      .subscribe({
        next: (data) => {},
        error: (e) => {},
      });
  };

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}

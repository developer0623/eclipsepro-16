import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AddToolingModalComponent } from '../add-tooling-modal/add-tooling-modal.component';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { ToolingDef, IUserColumnChoice } from '../../../../app/core/dto';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-tooling-list',
  templateUrl: './tooling-list.component.html',
  styleUrls: ['./tooling-list.component.scss'],
})
export class ToolingListComponent implements OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  toolsSub_: Subscription;
  dataSource: MatTableDataSource<ToolingDef>;
  searchTxt: string = '';
  pageSizeOptions = [15, 25, 50, 100];
  pageSize = this.pageSizeOptions[0];
  pageIndex = 0;

  columns = [
    {
      columnDef: 'toolingCode',
      displayName: 'ToolingCode',
      sortDes: 'Sort by toolingCode',
      cell: (element: ToolingDef) => `${element.toolingCode}`,
      isChecked: true,
    },
    {
      columnDef: 'machines',
      displayName: 'Machine(s)',
      sortDes: 'Sort by machines',
      cell: (element: ToolingDef) => `${element.machines}`,
      isChecked: true,
    },
    {
      columnDef: 'description',
      displayName: 'Description',
      sortDes: 'Sort by description',
      cell: (element: ToolingDef) => `${element.description}`,
      isChecked: true,
    },
    {
      columnDef: 'pCodeGroup',
      displayName: 'PCodeGroup',
      sortDes: 'Sort by pCodeGroup',
      cell: (element: ToolingDef) => `${element.pCodeGroup}`,
      isChecked: true,
    },
    {
      columnDef: 'finWidth',
      displayName: 'FinWidth',
      sortDes: 'Sort by finWidth',
      cell: (element: ToolingDef) => `${element.finWidth}`,
      isChecked: true,
    },
  ];

  displayedColumns: string[] = [
    'toolingCode',
    'machines',
    'description',
    'pCodeGroup',
    'finWidth',
    'hasUnassignedMachineTool',
  ];
  sortState: Sort;
  subscriptions_: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private http: HttpClient,
    private clientDataStore: ClientDataStore
  ) {
    const localSort = localStorage.getItem('tooling.sort');
    if (localSort) {
      this.sortState = JSON.parse(localSort);
    }
    const localPageSize = localStorage.getItem('tooling.page.size');
    if (localPageSize) {
      this.pageSize = Number(localPageSize);
    }
    const localPageIndex = localStorage.getItem('tooling.page.index');
    if (localPageIndex) {
      this.pageIndex = Number(localPageIndex);
    }
    this.toolsSub_ = this.clientDataStore.SelectTooling().subscribe((tooling) => {
      const toolingUp = tooling.map((tooling) => {
        return {
          ...tooling,
          machines: tooling.machines.map((machine) => machine.description).join(', '),
        };
      });
      this.dataSource = new MatTableDataSource<any>(toolingUp);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.http
      .get(`${Ams.Config.BASE_URL}/_api/user/settings/toolingColumns`)
      .subscribe((columns: IUserColumnChoice[]) => {
        // overwrite each column's isChecked with the user's preference
        this.columns = this.columns.map((masterCol) => {
          const col = columns.find((x) => x.field === masterCol.columnDef);
          return {
            ...masterCol,
            isChecked: col ? col.isChecked : masterCol.isChecked,
          };
        });
        this.onGetDisplayedColumns();
      });
  }

  onChangeColumn = (column, $event) => {
    $event.stopPropagation();
    $event.preventDefault();
    column.isChecked = !column.isChecked;
    this.onGetDisplayedColumns();
    const data = this.columns.map((x) => ({
      field: x.columnDef,
      isChecked: x.isChecked,
    }));

    this.http
      .post(`${Ams.Config.BASE_URL}/_api/user/settings/toolingColumns`, { data })
      .subscribe();
  };

  onGetDisplayedColumns() {
    this.displayedColumns = [
      ...this.columns.filter((column) => column.isChecked).map((column) => column.columnDef),
      'hasUnassignedMachineTool',
    ];
  }

  announceSortChange(sortState: Sort) {
    localStorage.setItem('tooling.sort', JSON.stringify(sortState));
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  gotoDetail(row: ToolingDef) {
    this.router.navigate(['/tooling', row.id]);
  }

  addTooling() {
    const dialogRef = this.dialog.open(AddToolingModalComponent, {
      width: '320px',
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      const data = { toolingCode: result };
      if (result) {
        this.http.put<ToolingDef>(`${Ams.Config.BASE_URL}/_api/tooling/${result}`, data).subscribe({
          next: (data) => {
            this.router.navigate(['/tooling',result]);
          },
          error: (error) => {
            console.log(error);
          },
        });
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    localStorage.setItem('tooling.page.size', String(this.pageSize));
    localStorage.setItem('tooling.page.index', String(this.pageIndex));
  }

  ngOnDestroy(): void {
    this.toolsSub_.unsubscribe();
  }
}

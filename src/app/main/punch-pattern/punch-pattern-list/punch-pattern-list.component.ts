import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IPunchPattern } from 'src/app/core/dto';
import { AmsDatesPipe } from '../../shared/pipes/dates.pipe';
import { UserHasRole } from '../../shared/services/store/user/selector';
import { AddPatternModalComponent } from '../add-pattern-modal/add-pattern-modal.component';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-punch-pattern-list',
  templateUrl: './punch-pattern-list.component.html',
  styleUrls: ['./punch-pattern-list.component.scss'],
})
export class PunchPatternListComponent implements OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSub_: Subscription;
  userRolesSub_: Subscription;
  userHasEditorRole = false;
  dataSource: MatTableDataSource<IPunchPattern>;
  searchTxt: string = '';
  columns = [
    {
      columnDef: 'isMacro',
      displayName: 'patternMacro',
      sortDes: 'Sort by isMacro',
      cell: (element: IPunchPattern) => `${element.isMacro}`,
    },
    {
      columnDef: 'isPermanent',
      displayName: 'permanent',
      sortDes: 'Sort by isPermanent',
      cell: (element: IPunchPattern) => `${element.isPermanent}`,
    },
    {
      columnDef: 'patternNumber',
      displayName: 'patternNumber',
      sortDes: 'Sort by number',
      cell: (element: IPunchPattern) => `${element.patternNumber}`,
    },
    {
      columnDef: 'punchCount',
      displayName: 'punchCount',
      sortDes: 'Sort by number',
      cell: (element: IPunchPattern) => `${element.punchCount}`,
    },
    {
      columnDef: 'lastUsedDate',
      displayName: 'lastUsed',
      sortDes: 'Sort by lastUsedDate',
      cell: (element: IPunchPattern) => `${AmsDatesPipe.prototype.transform(element.lastUsedDate)}`,
    },
    {
      columnDef: 'importDate',
      displayName: 'created',
      sortDes: 'Sort by importDate',
      cell: (element: IPunchPattern) => `${AmsDatesPipe.prototype.transform(element.importDate)}`,
    },
  ];
  displayedColumns: string[] = [
    'patternName',
    'isMacro',
    'isPermanent',
    'patternNumber',
    'punchCount',
    'lastUsedDate',
    'importDate',
  ];

  sortState: Sort;

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private clientDataStore: ClientDataStore,
    private store: Store
  ) {
    const localSort = localStorage.getItem('punchPattern.sort');
    if (localSort) {
      this.sortState = JSON.parse(localSort);
    }
    this.dataSub_ = this.clientDataStore.SelectPunchPatterns().subscribe((patterns) => {
      this.dataSource = new MatTableDataSource(patterns);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.userRolesSub_ = this.store
      .select(UserHasRole('pattern-editor'))
      .subscribe((userHasEditorRole) => {
        this.userHasEditorRole = userHasEditorRole;
      });
  }

  announceSortChange(sortState: Sort) {
    localStorage.setItem('punchPattern.sort', JSON.stringify(sortState));
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

  gotoDetail(row: IPunchPattern) {
    this.router.navigate(['/punch-patterns', row.id]);
  }

  addPattern() {
    const dialogRef = this.dialog.open(AddPatternModalComponent, {
      width: '320px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.router.navigate(['/punch-patterns', 'new'], { queryParams: { name: result }});
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSub_.unsubscribe();
    this.userRolesSub_.unsubscribe();
  }
}

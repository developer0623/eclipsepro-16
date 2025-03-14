import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { Ams } from 'src/app/amsconfig';
import {
  IMachineSetup,
  IMachineSetupParam,
  IMachineSetupCompare,
  IMachineCompareItem,
} from 'src/app/core/dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { HistoryDialogComponent } from '../history-dialog/history-dialog.component';
import { SetUpUrl } from '../url-constant';

@Component({
  selector: 'app-xl200-setups',
  templateUrl: './xl200-setups.component.html',
  styleUrls: ['./xl200-setups.component.scss'],
})
export class Xl200SetupsComponent implements OnInit {
  @Input() machineId: number;
  @ViewChild(MatSort) sort: MatSort;
  selectedTabIndex = 0;
  machineSetups: IMachineSetup[] = [];
  currentSetup: IMachineSetup = {} as IMachineSetup;
  dataSource: MatTableDataSource<IMachineSetupParam>;
  displayedColumns = ['paramGroupId', 'setupName', 'setupValue', 'action'];
  filterObj = {
    searchTxt: '',
    changedOnly: false,
  };
  compareFilterObj = {
    searchTxt: '',
    changedOnly: true,
  };
  isLoading = false;
  snapshotId = '.current';

  selectedIds = [];
  selectedSnapShots = [];
  comparedData: IMachineCompareItem[] = [];
  filteredComparedData: IMachineCompareItem[] = [];

  constructor(
    private http: HttpClient,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const setupIds = this.route.snapshot.paramMap.get('setupIds');
    const snapshot = this.route.snapshot.paramMap.get('snapshot');
    if (setupIds) {
      this.selectedTabIndex = 1;
      this.selectedIds = [...JSON.parse(setupIds)];
      this.onGetComparedData(true);
    } else if (snapshot) {
      this.snapshotId = snapshot;
    }
    this.http
      .get<IMachineSetup[]>(Ams.Config.BASE_URL + `/_api/machine/${this.machineId}/${SetUpUrl}`)
      .subscribe((data) => {
        this.machineSetups = data;
        if (this.selectedIds.length !== 0) {
          this.selectedSnapShots = this.selectedIds.map((id) => {
            return this.machineSetups.find((item) => item.id === id);
          });
        }
      });

    this.http
      .get<IMachineSetup>(
        Ams.Config.BASE_URL + `/_api/machine/${this.machineId}/${SetUpUrl}/${this.snapshotId}`
      )
      .subscribe((data) => {
        this.currentSetup = data;
        this.addDataToTable();
      });
  }

  matchesSearchText(text, search) {
    return text.toString().toLowerCase().includes(search.toLowerCase());
  }

  addDataToTable() {
    this.dataSource = new MatTableDataSource(this.currentSetup.parameters);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      const { searchtxt, changedonly } = JSON.parse(filter);
      if (!searchtxt && !changedonly) return true;

      const searchTextMatches =
        searchtxt &&
        (this.matchesSearchText(data.paramGroupId, searchtxt) ||
          this.matchesSearchText(data.setupName, searchtxt) ||
          this.matchesSearchText(data.setupValue, searchtxt));

      if (changedonly) {
        return searchtxt ? searchTextMatches && data.hasChanged : data.hasChanged;
      }

      return searchTextMatches;
    };

    this.dataSource.filter = JSON.stringify(this.filterObj).trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterObj).trim().toLowerCase();
  }

  onChangeSnapshot(item: IMachineSetup) {
    this.isLoading = true;
    this.snapshotId = item.id;
    this.router.navigate(
      ['.'], 
      { 
        queryParams: { snapshot: this.snapshotId, setupIds: [] },
        queryParamsHandling: 'merge'
      }
    );
    this.http
      .get<IMachineSetup>(
        Ams.Config.BASE_URL + `/_api/machine/${this.machineId}/${SetUpUrl}/${item.id}`
      )
      .subscribe((data) => {
        this.isLoading = false;
        this.currentSetup = data;
        this.addDataToTable();
      });
  }

  onRemoveSnapShot(index) {
    this.selectedIds.splice(index, 1);
    this.selectedSnapShots.splice(index, 1);
    this.onGetComparedData();
  }

  onCompareSnapshot(item) {
    const index = this.selectedIds.indexOf(item.id);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
      this.selectedSnapShots.splice(index, 1);
      this.onGetComparedData();
    } else if (this.selectedIds.length < 5) {
      this.selectedIds.push(item.id);
      this.selectedSnapShots.push(item);
      this.onGetComparedData();
    }
  }

  onGetCheckedState(id) {
    return this.selectedIds.indexOf(id) > -1;
  }

  onGetComparedData(isFirstLoad = false) {
    if (!isFirstLoad) {
      this.router.navigate(
        ['.'], 
        { 
          queryParams: { setupIds: this.selectedIds, tab: 'setups', snapshot: '' },
          queryParamsHandling: 'merge'
        }
      );
    }
    if (this.selectedIds.length > 0) {
      const param = this.selectedIds.reduce((total, item) => `${total}&setupIds=${item}`);
      this.isLoading = true;
      this.http
        .get<IMachineSetupCompare>(
          Ams.Config.BASE_URL +
            `/_api/machine/${this.machineId}/${SetUpUrl}/.compare?setupIds=${param}`
        )
        .subscribe((data) => {
          this.isLoading = false;
          if (data.comparison.length > 0) {
            this.comparedData = [...data.comparison];
            this.applyCompareFilter();
          }
        });
    } else {
      this.comparedData = [];
      this.filteredComparedData = [];
    }
  }

  onGetWidth(len) {
    switch (len) {
      case 4:
        return {
          width: '25%',
        };
      case 5:
        return {
          width: '20%',
        };
      default:
        return {
          width: '30%',
        };
    }
  }

  applyCompareFilter() {
    const { searchTxt, changedOnly } = this.compareFilterObj;
    if (!searchTxt && !changedOnly) {
      this.filteredComparedData = [...this.comparedData];
    } else {
      this.filteredComparedData = this.comparedData.filter((item) => {
        let searchTextMatches = true;
        let changedOnlyMatches = true;
        if (searchTxt) {
          let nameSearchTextMatches = this.matchesSearchText(item.setupName, searchTxt);
          let valSearched = item.setupValues.filter((val) =>
            this.matchesSearchText(val.setupValue, searchTxt)
          );
          searchTextMatches = nameSearchTextMatches || valSearched.length > 0;
        }

        if (changedOnly) {
          changedOnlyMatches = item.setupValues.filter((val) => val.hasChanged).length > 0;
        }

        return searchTextMatches && changedOnlyMatches;
      });
    }
  }

  onOpenHistoryModal(item: IMachineSetupParam) {
    const dialogRef = this.dialog.open(HistoryDialogComponent, {
      width: '760px',
      data: {
        setupParam: item,
        machineId: this.machineId,
        setupId: this.currentSetup.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  gotoParam(item) {
    this.selectedTabIndex = 0;
    this.onChangeSnapshot(item);
  }

  onChangeTab(index) {
    this.selectedTabIndex = index;
    this.onParentChangeTab();
  }

  onParentChangeTab() {
    if (this.selectedTabIndex) {
      if (this.selectedIds.length === 0) {
        const selectedItem = this.machineSetups.find((item) => item.id == this.currentSetup.id);
        this.onCompareSnapshot(selectedItem);
      } else {
        this.router.navigate(
          ['.'], 
          { 
            queryParams: { tab: 'setups', snapshot: '', setupIds: this.selectedIds },
            queryParamsHandling: 'merge'
          }
        );
      }
    } else if (this.snapshotId === '.current') {
      this.router.navigate(
        ['.'], 
        { 
          queryParams: { tab: 'setups', snapshot: '', setupIds: [] },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      this.router.navigate(
        ['.'], 
        { 
          queryParams: { tab: 'setups', snapshot: this.snapshotId, setupIds: [] },
          queryParamsHandling: 'merge'
        }
      );
    }
  }
}

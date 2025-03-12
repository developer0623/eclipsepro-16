import { groupBy } from 'lodash';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router  } from '@angular/router';
import { ILocation, IReasonCode, LocationCategory, IWarehouseLocation } from 'src/app/core/dto';
import { AddReasonComponent } from './add-reason/add-reason.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { WarehouseService } from '../../shared/services/warehouse.service';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
})
export class AppSettingsComponent {
  reasons: IReasonCode[] = [];
  reasonsGroup: {
    NonpreferredReasons: IReasonCode[];
    OverrideReasons: IReasonCode[];
    UnattainableReasons: IReasonCode[];
  } = { NonpreferredReasons: [], OverrideReasons: [], UnattainableReasons: [] };
  serverLocations: ILocation[] = [];
  locations: IWarehouseLocation[] = [];
  selectedTime = 10;
  panelIsOpen = false;
  selectedTabIndex = 0;

  warningTimes = [
    { value: 10, name: '10mins' },
    { value: 20, name: '20mins' },
    { value: 30, name: '30mins' },
  ];
  initLocations = [
    {
      title: 'MACHINE',
      items: [],
      doNotEdit: true,
      category: LocationCategory[LocationCategory.Machine],
    },
    { title: 'WAREHOUSE', items: [], category: LocationCategory[LocationCategory.Warehouse] },
    {
      title: 'STAGING BAY',
      items: [],
      category: LocationCategory[LocationCategory.StagingBay],
    },
    { title: 'TRUCK', items: [], category: LocationCategory[LocationCategory.Truck] },
    {
      title: 'LOADING DOCK',
      items: [],
      category: LocationCategory[LocationCategory.LoadingDock],
    },
    { title: 'BIN', items: [], category: LocationCategory[LocationCategory.Bin] },
  ];

  subscriptions_: Subscription[] = [];

  constructor(
    private ClientDataStore: ClientDataStore,
    private snackBar: MatSnackBar,
    private warehouseService: WarehouseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.selectedTabIndex = Number(this.route.snapshot.paramMap.get('tab')) || 0;
    this.subscriptions_ = [
      this.ClientDataStore.SelectReasonCodes().subscribe((reasons) => {
        this.reasons = [...reasons];
        this.reasonsGroup = this.groupByCodeSet(this.reasons);
      }),
      this.ClientDataStore.SelectLocations().subscribe((locations) => {
        this.serverLocations = [...locations];
        this.seperateLocations();
      }),
    ];
  }

  groupByCodeSet(codes: IReasonCode[]) {
    const grouped = groupBy(codes, 'codeSet');

    return {
      NonpreferredReasons: grouped['NonpreferredReasons'] || [],
      OverrideReasons: grouped['OverrideReasons'] || [],
      UnattainableReasons: grouped['UnattainableReasons'] || [],
    };
  }

  seperateLocations() {
    const init = [...this.initLocations];
    this.serverLocations.forEach((location) => {
      const listItem = init[LocationCategory[location.category]];
      if (listItem) {
        const i = listItem.items.findIndex((l) => l.id === location.id);
        if (i >= 0) {
          listItem.items[i] = location;
        } else {
          listItem.items.push(location);
        }
      }
    });
    this.locations = init;
  }

  removeReson(reason: IReasonCode) {
    this.warehouseService.deleteReason(reason.id).subscribe((result) => {
      this.reasons = this.reasons.filter((item) => item.id !== reason.id);
      this.reasonsGroup = this.groupByCodeSet(this.reasons);
      this.toast('Removed a reason');
    });
  }
  gotoAddReason(codeSet: string): void {
    const dialogRef = this.dialog.open(AddReasonComponent, {
      width: '400px',
      data: { codeSet },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reasons = [...this.reasons, result];
        this.reasonsGroup = this.groupByCodeSet(this.reasons);
        this.toast('Added a reason');
      }
    });
  }

  removeLocation(location: ILocation) {
    this.warehouseService.deleteLocation(location.id).subscribe((result) => {
      this.serverLocations = this.serverLocations.filter((item) => item.id !== location.id);
      this.seperateLocations();
      this.toast('Removed a location');
    });
  }

  gotoAddLocation(locationGroup: any): void {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      width: '400px',
      data: { category: locationGroup.category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.serverLocations = [...this.serverLocations, result];
        this.seperateLocations();
        this.toast('Added a location');
      }
    });
  }

  onChangeTab(index) {
    this.selectedTabIndex = index;
    this.router.navigate([], {
      queryParams: { tab: index },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    
    // this.state.go('.', { tab: index }, { notify: false });
  }

  private toast(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}

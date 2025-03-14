import { Component, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { machineDetailsViewModel } from '../selectors';
import { UserHasRoles } from 'src/app/main/shared/services/store/user/selector';
import { LockdownCode, IMachine, LockdownCodeValue } from 'src/app/core/dto';
import { Xl200ToolsComponent } from '../xl200-tools/xl200-tools.component';
import { Xl200SetupsComponent } from '../xl200-setups/xl200-setups.component';
import { selectMachine } from 'src/app/main/shared/services/store/order/selectors';
import { putAction } from 'src/app/main/shared/services/clientData.actions';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-xl200-detail',
  templateUrl: './xl200-detail.component.html',
  styleUrls: ['./xl200-detail.component.scss'],
})
export class Xl200DetailComponent implements OnDestroy {
  @ViewChild(Xl200ToolsComponent) xl200ToolsComponent: Xl200ToolsComponent;
  @ViewChild(Xl200SetupsComponent) xl200SetupsComponent: Xl200SetupsComponent;
  machineId: number;
  machine: ReturnType<typeof machineDetailsViewModel> = {} as ReturnType<
    typeof machineDetailsViewModel
  >;
  userHasAdminRole = false;
  test = 1;
  machineKeys = [
    {
      field: 'machineNumber',
      name: 'Machine Number',
      isEditable: false,
    },
    {
      field: 'isActive',
      name: 'Active Status',
      isEditable: false,
    },
    {
      field: 'isHoleCount',
      name: 'Hole Count',
      isEditable: false,
    },
    {
      field: 'bundleIdPrefix',
      name: 'BundleId Prefix',
      isEditable: true,
    },
    {
      field: 'description',
      name: 'Description',
      isEditable: true,
    },
    {
      field: 'ipAddress',
      name: 'IP Address',
      isEditable: true,
    },
    {
      field: 'commName',
      name: 'CommName',
      isEditable: false,
    },
    {
      field: 'serialNumber',
      name: 'Serial Number',
      isEditable: false,
    },
    {
      field: 'softwareModel',
      name: 'Software Model',
      isEditable: false,
    },
    {
      field: 'softwareVersion',
      name: 'Software Version',
      isEditable: false,
    },
    {
      field: 'uartVersion',
      name: 'UART Version',
      isEditable: false,
    },
    {
      field: 'machineGroup',
      name: 'Machine Group',
      isEditable: false,
    },
    {
      field: 'defaultPatternName',
      name: 'Default Pattern',
      isEditable: true,
      // todo: add drop down to select pattern name
    },
  ];
  selectedTabIndex = 0;
  tabsNickNames = ['details', 'settings', 'restrictions', 'setups', 'tools', 'patterns'];

  subscriptions_: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private store: Store,
    private http: HttpClient
  ) {
    this.machineId = this.machineId = Number(this.route.snapshot.paramMap.get('id'));
    const tabparam = this.route.snapshot.paramMap.get('tab');
    if (tabparam) {
      this.selectedTabIndex = this.tabsNickNames.indexOf(tabparam);
    }
    this.subscriptions_ = [
      this.store
        .select(selectMachine)
        .pipe(
          filter((ms) => ms.length > 0), // Ensure that we only process when the array is not empty
          map((ms) => {
            const m = ms.find((m) => m.machineNumber === this.machineId); // Find the machine with the specific ID
            return m ? machineDetailsViewModel(m) : null; // Return machine details view model or null
          }),
          filter((m) => !!m)
        )
        .subscribe((machine) => {
          this.machine = machine;
          console.log('this.machine', this.machine);
        }),

      this.store
        .select(UserHasRoles(['administrator', 'machine-manager'], false))
        .subscribe((userHasAdminRole) => {
          this.userHasAdminRole = userHasAdminRole;
        }),
    ];
  }

  onChangeTab(index) {
    if (index === 4) {
      this.xl200ToolsComponent.onSizeToFit();
    }

    if (index === 3) {
      this.xl200SetupsComponent.onParentChangeTab();
    } else {
      this.router.navigate(
        ['.'], 
        { 
          queryParams: { tab: this.tabsNickNames[index], snapshot: '', setupIds: [] },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  onOrderLockdownChange(val: LockdownCodeValue, code: LockdownCode) {
    code.value = val;
    this.onChangeDetail([code], 'orderLockdownModel');
  }
  onPatternLockdownChange(val: LockdownCodeValue, code: LockdownCode) {
    code.value = val;
    this.onChangeDetail([code], 'patternLockdownModel');
  }

  onChangeEnforcedSetups() {
    this.onChangeDetail(this.machine.eclipseEnforcedSetups, 'eclipseEnforcedSetups');
  }

  onChangeDetail(value, field: string) {
    if (!this.userHasAdminRole) {
      this.toast('You do not have permission to change this setting');
      return;
    }
    const data = {
      machineNumber: this.machine.machineNumber,
      [field]: value,
    };

    this.http
      .patch(`${Ams.Config.BASE_URL}/_api/machine/${this.machine.machineNumber}`, { data })
      .subscribe({
        next: (response) => {
          this.store.dispatch(putAction({ collection: 'Machine', payload: response }));
          return this.toast('Machine updated successfully');
        },
        error: (ex) => {
          this.toast(
            'Machine change was not saved. ' + ex.data.errors.reduce((x, y) => x + ' ' + y)
          );
        },
      });
  }

  onClose(selectedItem) {
    selectedItem.isOpen = !selectedItem.isOpen;
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }
}

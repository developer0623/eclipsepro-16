import { Component } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  IMetricDefinition,
  IDevice,
  IDeviceState,
  IDeviceMetrics,
  IMachine,
  IDashboardMachine,
} from 'src/app/core/dto';
import { MachineDataService } from '../../shared/services/machine-data.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class Dashboards2Component {
  machineSort = 'machineNumber';
  devices: (IDevice & { state: IDeviceState; metrics: IDeviceMetrics })[];
  dashboardMachines: IDashboardMachine[] = [];

  subscriptions_: Subscription[] = [];

  constructor(public machineData: MachineDataService) {
    this.machineSort = localStorage.getItem('machineSort') ?? 'machineNumber';

    this.subscriptions_ = [
      this.machineData.dashboardMachines$.subscribe((data) => {
        if (data && data.length > 0) {
          this.dashboardMachines = [...data.filter((m) => m.machine.isActive)];
        }
      }),

      this.machineData.dashboardDevices$.subscribe((data) => {
        if (data && data.length > 0) {
          this.devices = [...data];
        }
      }),
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }

  swapSort = () => {
    this.machineSort =
      this.machineSort === 'machineNumber' ? 'machine.description' : 'machineNumber';
    localStorage.setItem('machineSort', this.machineSort);
  };

  trackByKey = (index: number, m: IMachine): number => {
    return m.id;
  };
}

import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription, combineLatest } from 'rxjs';
import { TransitionManageService } from '../../shared/services/transition.service';

import { IMachine, IDashboardMachine, IMachineSelection, IDashboardDevice } from 'src/app/core/dto';
import { MachineDataService } from '../../shared/services/machine-data.service';

// todo: the only purpose of this component should be to select a machine. The content and the shift
// selection should be moved to different components by machine type (currently xl and device)
@Component({
  selector: 'app-machine-detail',
  templateUrl: './machine-detail.component.html',
  styleUrls: ['./machine-detail.component.scss'],
})
export class MachineDetailComponent implements OnDestroy {
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  machineNumber: number = 0;
  deviceId: string;
  machineSelection: IMachineSelection;

  dashboardMachines: IDashboardMachine[] = [];
  dashboardDevices: IDashboardDevice[] = [];
  machineSort = 'machineNumber';

  subscriptions_: Subscription[] = [];
  transition$;

  constructor(
    public machineData: MachineDataService,
    private router: Router,
    private route: ActivatedRoute,
    private transManageService: TransitionManageService
  ) {
    this.machineSort = localStorage.getItem('machineSort') ?? 'machineNumber';
    this.updateMachineFromRoute();

    this.subscriptions_ = [
      combineLatest([
        this.machineData.dashboardMachines$,
        this.machineData.dashboardDevices$,
      ]).subscribe(([machines, devices]) => {
        this.dashboardMachines = _.sortBy(machines, this.machineSort);
        this.dashboardDevices = devices;
      }),
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }

  onChangeMachine(machineSelection: IMachineSelection) {
    console.log('onChangeMachine', machineSelection);
    this.machineSelection = machineSelection;
    if (machineSelection.type === 'xl') {
      this.machineNumber = machineSelection.xlId;
      this.deviceId = '';
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { id: machineSelection.xlId },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } else {
      this.machineNumber = 0;
      this.deviceId = machineSelection.deviceId;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { id: machineSelection.deviceId },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  trackByKey = (index: number, m: IMachine): number => {
    return m.id;
  };
  updateMachineFromRoute() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.machineNumber = Number(id);
      this.deviceId = '';
      this.machineSelection = { type: 'xl', xlId: this.machineNumber, deviceId: '' };
    } else {
      this.machineNumber = 0;
      this.deviceId = id;
      this.machineSelection = { type: 'device', xlId: 0, deviceId: this.deviceId };
    }
  }
}

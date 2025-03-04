import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';

import { IDashboardDevice, IDashboardMachine, IMachine, IMachineSelection } from 'src/app/core/dto';
/*
This was a copy of scheduler-tabs component. It will be used in the dashboard and
wherever we need tabs for machines. The reason both are still here is that we
are making changes to add Device machines and don't want to impact the scheduler
as it is in the process of being migrated to ng16.
*/
@Component({
  selector: 'app-machine-tabs',
  templateUrl: './machine-tabs.component.html',
  styleUrls: ['./machine-tabs.component.scss'],
})
export class MachineTabsComponent implements OnChanges {
  @Input() set dashboardMachines(value: IDashboardMachine[]) {
    this.dashboardMachines$.next(value);
  }
  @Input() set dashboardDevices(value: IDashboardDevice[]) {
    this.dashboardDevices$.next(value);
  }
  protected readonly dashboardMachines$ = new BehaviorSubject<IDashboardMachine[]>([]);
  protected readonly dashboardDevices$ = new BehaviorSubject<IDashboardDevice[]>([]);
  @Input() selectedMachine: IMachineSelection;
  @Input() isInitMove = false; // todo: what is this?
  @Output() onChangeMachine: EventEmitter<IMachineSelection> =
    new EventEmitter<IMachineSelection>();
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;

  machines: IMachineCombo[];
  selectedTabIndex = 0;
  // todo: remove all external references to tab index. We should be passing the IMachineSelection object instead.
  // todo: sorting should be done here, not in the parent component
  trackByKey = (index: number, m: IMachineCombo): string => {
    return m.selection.type === 'xl' ? String(m.selection.xlId) : m.selection.deviceId;
  };

  constructor() {
    this.dashboardMachines$
      .pipe(
        combineLatestWith(this.dashboardDevices$),
        map(([machines, devices]) => {
          let x = machines.map((machine) => ({
            selection: { type: 'xl', xlId: machine.machine.id, deviceId: '' },
            xl: machine,
            device: undefined,
          }));
          let d = devices.map((device) => ({
            selection: { type: 'device', xlId: 0, deviceId: device.deviceId },
            xl: undefined,
            device: device,
          }));
          return { x, d };
        })
      )
      .subscribe((machines) => {
        this.machines = [...machines.x, ...machines.d];
        this.onSetActiveTab();
      });
  }

  onSetActiveTab() {
    if (!this.selectedMachine) {
      return;
    }
    if (
      this.selectedMachine.type === 'xl' &&
      this.selectedMachine.xlId > 0 &&
      this.machines.length > 0
    ) {
      let cur_mach_index = this.machines.findIndex(
        (m) => m.selection.xlId === Number(this.selectedMachine.xlId)
      );
      this.selectedTabIndex = cur_mach_index >= 0 ? cur_mach_index : 0;
    } else if (
      this.selectedMachine.type === 'device' &&
      this.selectedMachine.deviceId.length > 0 &&
      this.machines.length > 0
    ) {
      let cur_mach_index = this.machines.findIndex(
        (m) => m.selection.deviceId === this.selectedMachine.deviceId
      );
      this.selectedTabIndex = cur_mach_index >= 0 ? cur_mach_index : 0;
    }
    if (this.selectedTabIndex > 0) this.centerSelectedTab();
  }

  selectedTabChange() {
    this.selectedTabIndex = this.tabGroup.selectedIndex;
    this.centerSelectedTab();
    this.onChangeMachine.emit(this.machines[this.selectedTabIndex].selection);
  }

  centerSelectedTab() {
    const tabHeader = this.tabGroup._tabHeader;
    const tabList = tabHeader._tabList.nativeElement;
    const tabElement = tabList.children[0].children[this.selectedTabIndex];
    if (!tabElement) {
      // during initialization, tabElement may not be available
      return;
    }
    const tabWidth = tabElement.offsetWidth;
    const screenWidth = this.tabGroup._tabHeader._tabListContainer.nativeElement.clientWidth;
    const scrollAmount = tabElement.offsetLeft + tabWidth / 2 - screenWidth / 2;
    tabHeader.scrollDistance = scrollAmount;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedMachine &&
      changes.selectedMachine.currentValue &&
      changes.selectedMachine.firstChange
    ) {
      if (this.tabGroup && this.tabGroup._tabHeader && this.tabGroup._tabHeader._tabList) {
        this.onSetActiveTab();
      } else {
        setTimeout(() => {
          this.onSetActiveTab();
        });
      }
    }
  }
}
interface IMachineCombo {
  selection: IMachineSelection;
  xl?: IDashboardMachine;
  device?: IDashboardDevice;
}

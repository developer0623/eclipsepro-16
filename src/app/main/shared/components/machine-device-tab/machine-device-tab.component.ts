import { Component, Input } from '@angular/core';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { IDashboardMachine, IMetricDefinition } from 'src/app/core/dto';

@Component({
  selector: 'app-machine-device-tab',
  templateUrl: './machine-device-tab.component.html',
  styleUrls: ['./machine-device-tab.component.scss'],
})
export class MachineDeviceTabComponent {
  @Input() device;
  isOpen = false;
  positions = [
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' }
    ),
  ];

  onShowTooltip() {
    this.isOpen = true;
  }

  onHideTooltip() {
    this.isOpen = false;
  }

  ongGetStatus() {
    switch (this.device?.state?.runState) {
      case 'R':
        return 'mdi-play';
      case 'O':
        return 'mdi-close-circle-outline';
      case 'H':
        return 'mdi-stop';
      default:
        return '';
    }
  }
}

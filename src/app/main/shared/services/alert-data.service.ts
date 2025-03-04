import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ClientDataStore } from './clientData.store';
import { IAlert, IMachine } from 'src/app/core/dto';

@Injectable({
  providedIn: 'root',
})
export class AlertDataService {
  alerts: IAlert[] = [];
  criticalAlertsLength: 0;
  firstLoad = true;
  machines: IMachine[] = [];
  machineSub_: Subscription;

  constructor(private clientDataStore: ClientDataStore) {
    this.machineSub_ = clientDataStore
      .SelectMachines()
      .pipe(
        filter((ms) => ms && ms.length > 0) // Ensure the machines array is not empty
      )
      .subscribe((ms) => {
        this.machines = ms;
      });

    clientDataStore.SelectAlerts().subscribe((alerts) => {
      this.applyAlertUpdates(alerts);
    });
  }

  applyAlertUpdates(newAlerts) {
    //first, look for new alerts
    //I'm sure there is a way better way to do this. Ugly for now...
    if (!this.firstLoad) {
      for (let newI = 0; newI < newAlerts.length; newI++) {
        let found = false;
        for (let oldI = 0; oldI < this.alerts.length; oldI++) {
          if (newAlerts[newI].id === this.alerts[oldI].id) {
            found = true;
            break;
          }
        }
        if (!found && newAlerts[newI].isCritical) {
          //new critical alert, toast it
          // we need to fix
          let message = 'New alert: ' + newAlerts[newI].title;
          // this.$mdToast.show(
          //   this.$mdToast
          //     .simple()
          //     .textContent(message)
          //     .position('top right')
          //     .hideDelay(2000)
          //     .parent('#content')
          // );
        }
      }
    }

    this.alerts.length = 0;
    this.criticalAlertsLength = 0;
    newAlerts.forEach((alert) => {
      let clonedAlert = { ...alert }; // Clone to make it mutable

      if (clonedAlert.machineNumber > 0) {
        clonedAlert.machine = this.machines.find(
          (machine) => machine.machineNumber === clonedAlert.machineNumber
        );
      }

      this.alerts.push(clonedAlert);

      if (clonedAlert.isCritical) {
        this.criticalAlertsLength++;
      }
    });
    this.firstLoad = false;
  }
  addOfflineAlert() {
    let newAlert = {
      id: '00000000-0000-0000-0000-000000000000',
      alertType: 'Unknown',
      referenceId: '0',
      title: 'EclipsePro Server is Offline',
      created: Date(),
      updated: Date(),
      expires: '0001-01-01T00:00:00.0000000-06:00',
      icon: 'server-off',
      iconColor: 'red-fg',
      link: '',
      description: 'EclipsePro server cannot be contacted. SignalR is attempting to reconnect...',
      percentComplete: 0,
      isCritical: true,
      actions: [],
    };

    this.alerts.push(newAlert);
    this.criticalAlertsLength++;
  }

  removeOfflineAlert() {
    const i = this.alerts.findIndex((a) => a.id === '00000000-0000-0000-0000-000000000000');
    if (i > -1) {
      this.alerts.splice(i, 1);
      this.criticalAlertsLength--;
    }
  }
}

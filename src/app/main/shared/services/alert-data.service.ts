import { Injectable } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientDataStore } from './clientData.store';
import { IAlert, IMachine } from 'src/app/core/dto';

@Injectable({
  providedIn: 'root',
})
export class AlertDataService {
  alerts: IAlert[] = [];
  private alertsSubject = new BehaviorSubject<IAlert[]>([]);
  alerts$ = this.alertsSubject.asObservable();
  criticalAlertsLength = 0;
  firstLoad = true;
  machines: IMachine[] = [];
  machineSub_: Subscription;

  constructor(private clientDataStore: ClientDataStore, private _snackBar: MatSnackBar) {
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
    if (!this.firstLoad) {
      const newCriticalAlerts = newAlerts.filter(
        (newAlert) =>
          newAlert.isCritical && !this.alerts.some((oldAlert) => oldAlert.id === newAlert.id)
      );

      newCriticalAlerts.forEach((alert) => {
        this._snackBar.open(alert.title, '', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
        });
      });
    }

    this.alerts = newAlerts.map((alert) => ({
      ...alert,
      machine:
        this.machines.find((machine) => machine.machineNumber === alert.machineNumber) || null,
    }));

    this.alertsSubject.next([...this.alerts]);
    this.criticalAlertsLength = this.alerts.filter((alert) => alert.isCritical).length;
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

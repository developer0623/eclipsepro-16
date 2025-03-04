import { Injectable, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IScheduledDowntimeDto } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { MachineDataService } from './machine-data.service';
import { ClientDataStore } from './clientData.store';

@Injectable({
  providedIn: 'root',
})
export class DowntimeDataService {
  private _downtimes$: BehaviorSubject<IScheduledDowntimeDto[]> = new BehaviorSubject<
    IScheduledDowntimeDto[]
  >([]);
  downtimeObs: Observable<IScheduledDowntimeDto[]> = this._downtimes$.asObservable();
  private subscription: Subscription;

  constructor(
    public clientDataStore: ClientDataStore,
    public machineData: MachineDataService,
    private http: HttpClient
  ) {
    this.subscription = clientDataStore.SelectScheduledDowntimeDefinition().subscribe((sdd) => {
      let downtimes = sdd.map((d) => {
        return this.formatDowntime(d, this.machineData.machines);
      });

      this._downtimes$.next(downtimes);
    });
  }

  formatDowntime(downtime: IScheduledDowntimeDto, machineList: any): IScheduledDowntimeDto {
    const machines: string[] = downtime.machines.map((downtimeMachineId: any) => {
      const machine = machineList[downtimeMachineId];
      return machine
        ? machine.description
        : `Machine ID ${downtimeMachineId} (Error ID not valid!)`;
    });
    return {
      ...downtime,
      machinesText: machines.join(', '),
    };
  }

  //todo:next two methods are gone when actions are dispatched
  _addOrUpdateDowntimeInStore(downtime: IScheduledDowntimeDto): void {
    downtime = this.formatDowntime(downtime, this.machineData.machines);
    const downtimes = this._downtimes$.getValue();
    const index = downtimes.findIndex((d) => d.id === downtime.id);

    if (index >= 0) {
      // Update the existing downtime
      this._downtimes$.next(downtimes.map((dt) => (dt.id === downtime.id ? downtime : dt)));
    } else {
      // Add new downtime
      this._downtimes$.next([...downtimes, downtime]);
    }
  }

  _deleteDowntimeInStore(deletedId: string): void {
    const downtimes = this._downtimes$.getValue();
    this._downtimes$.next(downtimes.filter((dt) => dt.id !== deletedId));
  }

  saveDowntime(downtimeData: IScheduledDowntimeDto) {
    return this.http
      .post<IScheduledDowntimeDto>(
        `${Ams.Config.BASE_URL}/api/scheduledDowntimeDefinitions`,
        downtimeData
      )
      .pipe(
        map((res) => {
          this._addOrUpdateDowntimeInStore(res); //todo:dispatch this instead
          return res;
        })
      );
  }

  updateDowntime(downtimeData: IScheduledDowntimeDto) {
    return this.http
      .put<IScheduledDowntimeDto>(
        `${Ams.Config.BASE_URL}/api/scheduledDowntimeDefinitions/${downtimeData.id}`,
        downtimeData
      )
      .pipe(
        map((res) => {
          this._addOrUpdateDowntimeInStore(res); //todo:dispatch this instead
          return res;
        })
      );
  }

  deleteDowntime(downtimeDataId: string) {
    return this.http
      .delete(`${Ams.Config.BASE_URL}/api/scheduledDowntimeDefinitions/${downtimeDataId}`)
      .pipe(
        map((res) => {
          this._deleteDowntimeInStore(downtimeDataId); //todo:dispatch this instead
          return res;
        })
      );
  }

  getDowntimeMachine(downtimeId: string): IScheduledDowntimeDto {
    let downtimes = this._downtimes$.getValue();
    let d = downtimes.findIndex((d) => d.id === downtimeId);
    if (d >= 0) {
      return downtimes[d];
    }
    return null;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

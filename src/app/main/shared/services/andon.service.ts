import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  filter,
  mergeMap,
  distinctUntilChanged,
  map,
  switchMap,
  mergeWith,
  finalize,
} from 'rxjs/operators';
import { machineLocation, selectAndOnDataForMachine } from './store/andon/selector';
import { IWallboardDevice } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { ClientDataStore } from './clientData.store';
import { putAction, delAction } from './clientData.actions';

@Injectable({
  providedIn: 'root',
})
export class AndonService {
  constructor(
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private store: Store
  ) {}
  andonDataForMachineAndSequence(machineNumber: number) {
    // This takes the _subscriptions_...
    const sub1 = this.clientDataStore.SelectMachineScheduleSummaryIn({
      property: 'machineNumber',
      values: [machineNumber],
    });
    const sub2 = sub1.pipe(
      mergeMap((x) => x),
      filter((x) => x.machineNumber === machineNumber),
      distinctUntilChanged((prev, curr) => prev.currentOrderId === curr.currentOrderId),
      map((scheduleSummary) =>
        this.clientDataStore.SelectJobDetailIn({
          property: 'ordId',
          values: [scheduleSummary.currentOrderId],
        })
      ),
      switchMap((jobDetail) => jobDetail)
    );
    const sub3 = this.clientDataStore.SelectAndonSequenceConfig();
    const sub4 = this.clientDataStore.SelectAndonViews();

    // These are taken in MachineData, so I won't double down here.
    //const sub5 = this.clientDataStore.SelectMetricDefinitions();
    //const sub6 = this.clientDataStore.SelectLocations();

    const sub6 = this.clientDataStore.SelectTasksIn({
      property: 'sourceLocationId',
      values: [machineLocation(machineNumber)],
    });
    const sub7 = this.clientDataStore.SelectTasksIn({
      property: 'destinationLocationId',
      values: [machineLocation(machineNumber)],
    });

    sub1.pipe(mergeWith(sub2, sub3, sub4, sub6, sub7)).subscribe();

    // ...and this gets the _data_.
    return this.store.select(selectAndOnDataForMachine(machineNumber));
  }

  updateWallboardDevice(id, contentType, deviceParams, wallboardDeviceName) {
    this.http
      .patch<IWallboardDevice>(`${Ams.Config.BASE_URL}/api/wallboards/registeredDevices/${id}`, {
        id,
        contentType,
        deviceParams,
        wallboardDeviceName,
      })
      .subscribe({
        next: (result) => {
          this.store.dispatch(putAction({ collection: 'WallboardDevices', payload: result }));
        },
      });
  }

  deleteWallboardDevice(id: string, documentID: string) {
    this.http.delete(`${Ams.Config.BASE_URL}/api/wallboards/registeredDevices/${id}`).subscribe({
      next: () => {
        this.store.dispatch(delAction({ collection: 'WallboardDevices', id: documentID }));
      },
    });
  }
}

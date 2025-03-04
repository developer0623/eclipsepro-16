import { Injectable, Inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IProductionSummaryReportRecord } from 'src/app/core/dto';
import { Sch } from 'src/app/core/services/jobs.service.types';
import { ClientDataStore } from './clientData.store';

@Injectable({
  providedIn: 'root',
})
export class ProductionSummaryService {
  machineSub_: Subscription;
  markerId: number = 0;

  constructor(private clientDataStore: ClientDataStore) {
    this.machineSub_ = clientDataStore
      .SelectMachines()
      .pipe(filter((ms) => ms && ms.length > 0))
      .subscribe();
  }

  selectProductionSummary(): Observable<IProductionSummaryReportRecord[]> {
    // Jobs that are not on a schedule have a machine id of zero.
    let productionSummaryObs = this.clientDataStore.SelectProductionSummaryReport();
    return productionSummaryObs;
  }
}

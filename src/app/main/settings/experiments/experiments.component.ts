import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectSystemInfo } from '../../shared/services/store/misc/selectors';
import { SystemInfoService } from 'src/app/main/shared/services/system-info.service';
import { IMachineStateDto } from 'src/app/core/dto';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
})
export class ExperimentsComponent implements OnDestroy {
  systemInfo = { isSignalRConnected: false, signalRConnectionId: '', serverStartTime: null };
  private subscriptions_: Subscription[] = [];
  machines: IMachineStateDto[] = [];
  constructor(
    private clientDataStore: ClientDataStore,
    public systemInfoService: SystemInfoService,
    private store: Store
  ) {
    this.subscriptions_.push(
      this.store.select(selectSystemInfo).subscribe((sysInfo) => {
        this.systemInfo = sysInfo;
      }),
      clientDataStore.SelectMachineStates().subscribe((m) => {
        this.machines = m;
      })
    );
  }

  trackByIndex = (index: number): number => {
    return index;
  };

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}

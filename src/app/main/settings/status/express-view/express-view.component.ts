import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ExpressCommState, ExpressCtrlState } from 'src/app/core/dto';
import { ClientDataStore } from 'src/app/main/shared/services/clientData.store';
import { selectExpressAll } from 'src/app/main/shared/services/store/settings/selectors';

@Component({
  selector: 'express-view',
  templateUrl: './express-view.component.html',
  styleUrls: ['./express-view.component.scss'],
})
export class ExpressViewComponent {
  commState: ExpressCommState;
  ctrlStates: ExpressCtrlState[] = [];
  private subscriptions_: Subscription[] = [];
  constructor(private clientDataStore: ClientDataStore, private store: Store) {
    this.subscriptions_.push(clientDataStore.SelectAll('ExpressCtrlState').subscribe());
    this.subscriptions_.push(clientDataStore.SelectAll('ExpressCommState').subscribe());
    this.subscriptions_.push(
      this.store.select(selectExpressAll).subscribe(({ ctrlStates, commState, machines }) => {
        if (machines.length > 0) {
          this.ctrlStates = ctrlStates.map((ctrl) => ({
            ...ctrl,
            machine: machines.find((m) => m.machineNumber === ctrl.machineNumber),
          }));
        }

        this.commState = commState;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}

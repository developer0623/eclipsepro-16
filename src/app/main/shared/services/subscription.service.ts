import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';
import { ClientDataHubService } from './client-data-hub.service';
import { selectSystemInfo } from './store/misc/selectors';
import { Fx, ISystemInfo } from 'src/app/core/dto';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private clientDataHub: ClientDataHubService, private store: Store) {}

  private fireWhenConnected(thunk) {
    this.store
      .select(selectSystemInfo)
      .pipe(
        filter((info: ISystemInfo) => info.isSignalRConnected),
        tap(thunk)
      )
      .subscribe();
  }

  addSubscription(subscription: Fx.Subscription) {
    this.fireWhenConnected((_) => this.clientDataHub.addSubscription(subscription));
  }
  deleteSubscription(subscription: Fx.Subscription) {
    this.fireWhenConnected((_) => this.clientDataHub.deleteSubscription(subscription));
  }
}

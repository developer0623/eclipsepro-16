import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Ams } from 'src/app/amsconfig';
import { Fx } from 'src/app/core/dto';
import { putAction, delAction, initializeAction } from './clientData.actions';
import {
  signalrConnectedAction,
  signalrDisconnectedAction,
  signalrReconnectedAction,
  initSystemInfoAction,
} from './store/misc/actions';

@Injectable({
  providedIn: 'root',
})
export class ClientDataHubService {
  connection;
  connectionId: string = '';

  constructor(private store: Store) {
    const server = Ams.Config.BASE_URL;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(server + '/hubs')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on('objectPut', (collection, data) => {
      this.store.dispatch(putAction({ collection, payload: data }));
    });

    this.connection.on('objectDelete', (collection, id) => {
      this.store.dispatch(delAction({ collection, id }));
    });

    this.connection.on('objectBatchPut', (collection, batch) => {
      this.store.dispatch(initializeAction({ collection, payload: batch }));
    });

    // Server calls this when we connect. Put the data in the store.
    this.connection.on('sendSystemInfo', (systemInfo) => {
      this.store.dispatch(initSystemInfoAction({ payload: systemInfo }));
    });

    this.connection.onclose((error) => {
      console.log('ClientDataHub: disconnected', error);
      this.store.dispatch(signalrDisconnectedAction());
      this.start(); // the built in reconnect timed out. Now try to restart.
    });

    this.connection.onreconnecting((error) => {
      console.log(`ClientDataHub: reconnecting`);
    });

    this.connection.onreconnected((error) => {
      console.log(`ClientDataHub: reconnected === ${this.connection.connectionId}`, error);

      // If the connectionId has changed, then we need to re-subscribe to all the subscriptions.
      if (this.connection.connectionId !== this.connectionId) {
        this.store.dispatch(signalrReconnectedAction({ payload: this.connection.connectionId }));
        this.connectionId = this.connection.connectionId;
      }
    });

    // Start the hub connection
    this.start();
  }

  start() {
    console.log('ClientDataHub: connecting');
    this.connection
      .start()
      .then(() => {
        console.log(`ClientDataHub: connected === ${this.connection.connectionId}`);
        this.connectionId = this.connection.connectionId;
        this.store.dispatch(signalrConnectedAction({ payload: this.connection.connectionId }));
      })
      .catch((error) => {
        console.error('ClientDataHub: error', error);
        setTimeout(() => this.start(), 5000);
      });
  }

  addSubscription(sub: Fx.Subscription) {
    const newSub = _.cloneDeep(sub);
    if (this.connection.state === 'Connected') {
      // connected
      // The server side json binding won't bind a number[] to a string[].
      // So at the last possible place, we'll manually map.
      if (newSub.filterDef.type === Fx.IN) {
        let filterDef = newSub.filterDef as Fx.In;
        filterDef.values = filterDef.values.map((x) => x.toString());
      }
      console.log(`ClientDataHub (${this.connection.connectionId}) : addSubscription`, sub);
      this.connection
        .invoke('AddSubscription', newSub)
        .catch((error) => console.error('AddSubscription call failed', sub, error));
    } else {
      console.log(
        `ClientDataHub: not connected connection.state: ${this.connection.state}, unable to subscribe to ${sub.collection}`
      );
    }
  }
  deleteSubscription(sub: Fx.Subscription) {
    if (this.connection.state === 'Connected') {
      // connected
      console.log(`ClientDataHub (${this.connection.connectionId}) : deleteSubscription`, sub);
      this.connection
        .invoke('DeleteSubscription', sub)
        .catch((error) => console.error('DeleteSubscription call failed', sub, error));
    } else {
      console.log(
        'not connected',
        'connection.state: ',
        this.connection.state,
        'unable to delete subscription to ' + sub.collection
      );
    }
  }
}

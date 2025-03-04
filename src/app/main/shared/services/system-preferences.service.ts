import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClientDataStore } from './clientData.store';
import { ISystemPreferences } from 'src/app/core/dto';

@Injectable({
  providedIn: 'root',
})
export class SystemPreferencesService {
  systemPreferences: ISystemPreferences;
  constructor(private store: Store, private clientDataStore: ClientDataStore) {
    this.clientDataStore.SelectSystemPreferences().subscribe((data) => {
      this.systemPreferences = data;
    });
  }
}

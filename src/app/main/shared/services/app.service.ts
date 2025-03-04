import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  isLoading = false;
  constructor() {}
  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}

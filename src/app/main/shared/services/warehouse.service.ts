import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  constructor(private http: HttpClient) {}
  addReason(reason) {
    return this.http.post<string>(`${Ams.Config.BASE_URL}/_api/warehouse/reasons`, reason);
  }

  deleteReason(id: string) {
    return this.http.delete<string>(`${Ams.Config.BASE_URL}/_api/warehouse/reasons/${id}`);
  }

  addLocation(location) {
    return this.http.post<string>(`${Ams.Config.BASE_URL}/_api/warehouse/locations`, location);
  }

  deleteLocation(id: string) {
    return this.http.delete<string>(`${Ams.Config.BASE_URL}/_api/warehouse/locations/${id}`);
  }
}

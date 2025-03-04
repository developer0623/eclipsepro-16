import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Ams } from 'src/app/amsconfig';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  features = { dummy: false };
  features$ = new Subject();

  constructor(private http: HttpClient) {}

  featureDisabled(feature) {
    return feature.split(';').every((f) => this.features[f] === false);
  }

  refresh() {
    this.http.get(`${Ams.Config.BASE_URL}/api/features`).subscribe((data) => {
      this.features = { ...data, ...this.features };
      this.features$.next(this.features);
    });
  }

  setFeature(feature: string, enabled: boolean) {
    return this.http.post(`${Ams.Config.BASE_URL}/api/features/${feature}?enabled=${enabled}`, {});
  }
}

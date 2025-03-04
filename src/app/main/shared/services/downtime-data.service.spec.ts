import { TestBed } from '@angular/core/testing';

import { DowntimeDataService } from './downtime-data.service';

describe('DowntimeDataService', () => {
  let service: DowntimeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DowntimeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

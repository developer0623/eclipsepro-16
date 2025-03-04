import { TestBed } from '@angular/core/testing';

import { ProductionDeviceExplorerDataService } from './production-device-explorer-data.service';

describe('ProductionDeviceExplorerDataService', () => {
  let service: ProductionDeviceExplorerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionDeviceExplorerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

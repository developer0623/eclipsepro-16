import { TestBed } from '@angular/core/testing';

import { ProductionExplorerDataService } from './production-explorer-data.service';

describe('ProductionExplorerDataService', () => {
  let service: ProductionExplorerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionExplorerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

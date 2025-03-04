import { TestBed } from '@angular/core/testing';

import { ProductionSummaryService } from './production-summary.service';

describe('ProductionSummaryService', () => {
  let service: ProductionSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

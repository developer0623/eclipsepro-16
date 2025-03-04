import { TestBed } from '@angular/core/testing';

import { AndonService } from './andon.service';

describe('AndonService', () => {
  let service: AndonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AndonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EclipseProHelperService } from './eclipse-pro-helper.service';

describe('EclipseProHelperService', () => {
  let service: EclipseProHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EclipseProHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

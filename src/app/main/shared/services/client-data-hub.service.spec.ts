import { TestBed } from '@angular/core/testing';

import { ClientDataHubService } from './client-data-hub.service';

describe('ClientDataHubService', () => {
  let service: ClientDataHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientDataHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

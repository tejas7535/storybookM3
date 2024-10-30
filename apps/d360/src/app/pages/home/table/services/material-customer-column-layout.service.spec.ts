import { HttpClient } from '@angular/common/http';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MaterialCustomerColumnLayoutsService } from './material-customer-column-layout.service';

describe('MaterialCustomerColumnLayoutService', () => {
  let spectator: SpectatorService<MaterialCustomerColumnLayoutsService>;
  const createService = createServiceFactory({
    service: MaterialCustomerColumnLayoutsService,
    mocks: [HttpClient],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});

import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { ColumnDefinition } from '../../../../shared/services/abstract-column-settings.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { MaterialCustomerTableService } from './material-customer-table.service';

describe('MaterialCustomerTableService', () => {
  let spectator: SpectatorService<
    MaterialCustomerTableService<string, ColumnDefinition<string>>
  >;
  const createService = createServiceFactory({
    service: MaterialCustomerTableService,
    providers: [
      mockProvider(HttpClient, {
        get: jest.fn().mockReturnValue(of({})),
      }),
    ],
    mocks: [AgGridLocalizationService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});

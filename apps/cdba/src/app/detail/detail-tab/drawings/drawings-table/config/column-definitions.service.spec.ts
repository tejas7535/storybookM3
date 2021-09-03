import {
  SpectatorService,
  createServiceFactory,
  mockProvider,
} from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ColumnUtilsService } from '@cdba/shared/components/table';

import { ColumnDefinitionService } from './column-definitions.service';

describe('ColumnDefinitions', () => {
  let service: ColumnDefinitionService;
  let spectator: SpectatorService<ColumnDefinitionService>;

  const createService = createServiceFactory({
    service: ColumnDefinitionService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(ColumnUtilsService, {
        formatDate: jest.fn(() => ''),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});

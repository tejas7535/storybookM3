import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

describe('GreaseResultDataSourceService', () => {
  let spectator: SpectatorService<GreaseResultDataSourceService>;
  let service: GreaseResultDataSourceService;
  const localizeNumber = jest.fn();

  const createService = createServiceFactory({
    service: GreaseResultDataSourceService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(TranslocoLocaleService, { localizeNumber }),
      UndefinedValuePipe,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

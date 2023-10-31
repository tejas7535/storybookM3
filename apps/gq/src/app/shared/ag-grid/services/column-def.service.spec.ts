import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnDefService } from './column-def.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('ColumnDefService', () => {
  let service: ColumnDefService;
  let spectator: SpectatorService<ColumnDefService>;

  const createService = createServiceFactory({
    service: ColumnDefService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      { provide: TransformationService, useValue: {} },
      mockProvider(TranslocoLocaleService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});

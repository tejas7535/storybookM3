import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TranslocoModule } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

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
    imports: [MatSnackBarModule],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
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

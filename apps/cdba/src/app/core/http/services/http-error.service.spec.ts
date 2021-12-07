import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HttpErrorService } from './http-error.service';

describe('HttpErrorService', () => {
  let service: HttpErrorService;
  let spectator: SpectatorService<HttpErrorService>;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: HttpErrorService,
    imports: [provideTranslocoTestingModule({ en: {} }), MatSnackBarModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    snackBar = spectator.inject(MatSnackBar);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleHttpErrorDefault', () => {
    test('should open error snackbar', () => {
      const spySnackbarOpen = jest.spyOn(snackBar, 'open');

      service.handleHttpErrorDefault();

      expect(spySnackbarOpen).toHaveBeenCalled();
    });

    test('should not open error snackbar', () => {
      const spySnackbarOpen = jest.spyOn(snackBar, 'open');

      service.snackBarIsOpen = true;
      service.handleHttpErrorDefault();

      expect(spySnackbarOpen).not.toHaveBeenCalled();
    });
  });
});

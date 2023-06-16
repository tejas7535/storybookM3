import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let spectator: SpectatorService<ErrorService>;
  let service: ErrorService;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: ErrorService,
    imports: [provideTranslocoTestingModule({ en: {} }), MatSnackBarModule],
    providers: [ErrorService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ErrorService);
    snackBar = spectator.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#openSnackBar', () => {
    it('should trigger the angular material snackbar open method', () => {
      const openMatSnackBar = jest.spyOn(snackBar, 'open');

      const mockMessage = 'mockMessage';
      const mockAction = 'mockAction';
      service.openSnackBar(mockMessage, mockAction);

      expect(openMatSnackBar).toBeCalledWith(mockMessage, mockAction);
    });
  });

  describe('#openGenericSnackBar', () => {
    it('should trigger the error service openSnackBar method', () => {
      const openSnackBar = jest.spyOn(service, 'openSnackBar');

      service.openGenericSnackBar();

      expect(openSnackBar).toBeCalledTimes(1);
    });
  });
});

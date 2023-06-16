import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { MsdSnackbarService } from './msd-snackbar.service';
jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));
describe('MsdSnackbarService', () => {
  let spectator: SpectatorService<MsdSnackbarService>;
  let service: MsdSnackbarService;

  const initialState = {};

  const createService = createServiceFactory({
    service: MsdSnackbarService,
    imports: [MatSnackBarModule],
    providers: [provideMockStore({ initialState })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdSnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open snackbar', () => {
    service['snackBar'].open = jest.fn();
    const msgKey = 'asdkhfjasdhf';
    service.open(msgKey);

    expect(service['snackBar'].open).toBeCalledWith(
      msgKey,
      MsdSnackbarService['DEFAULT_ACTION_KEY'],
      MsdSnackbarService['DEFAULT_CONFIG']
    );
  });
});

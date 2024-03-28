import { MatSnackBarModule } from '@angular/material/snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { CustomSnackbarComponent } from '../../main-table/custom-snackbar/custom-snackbar.component';
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
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open info snackbar', () => {
    service['snackBar'].openFromComponent = jest.fn();
    const msgKey = 'test';
    service.info(msgKey);

    expect(service['snackBar'].openFromComponent).toBeCalledWith(
      CustomSnackbarComponent,
      {
        ...MsdSnackbarService['DEFAULT_CONFIG'],
        data: {
          message: 'test',
        },
      }
    );
  });
  it('should open info translated snackbar', () => {
    service['snackBar'].openFromComponent = jest.fn();
    const msgKey = 'test';
    service.infoTranslated(msgKey);

    expect(service['snackBar'].openFromComponent).toBeCalledWith(
      CustomSnackbarComponent,
      {
        ...MsdSnackbarService['DEFAULT_CONFIG'],
        data: {
          message: 'test',
        },
      }
    );
  });
  it('should open error snackbar', () => {
    service['snackBar'].openFromComponent = jest.fn();
    const msgKey = 'test';
    service.error(msgKey);

    expect(service['snackBar'].openFromComponent).toBeCalledWith(
      CustomSnackbarComponent,
      {
        data: {
          message: 'test',
        },
      }
    );
  });
  it('should open error translated snackbar', () => {
    service['snackBar'].openFromComponent = jest.fn();
    const msgKey = 'test';
    const items = [{ key: '2', value: 3 }];
    service.errorTranslated(msgKey, 'detail', items);

    expect(service['snackBar'].openFromComponent).toBeCalledWith(
      CustomSnackbarComponent,
      {
        data: {
          message: 'test',
          detail: {
            message: 'detail',
            items,
          },
        },
      }
    );
  });
});

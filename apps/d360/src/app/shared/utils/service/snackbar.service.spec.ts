import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let spectator: SpectatorService<SnackbarService>;
  let service: SnackbarService;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: SnackbarService,
    imports: [MatSnackBarModule],
    providers: [SnackbarService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(SnackbarService);
    snackBar = spectator.inject(MatSnackBar);
  });

  it('should open snackbar with provided message, action and duration', () => {
    const openMatSnackBar = jest.spyOn(snackBar, 'open');
    service.openSnackBar('Test message', 'Test action', 3000);
    expect(openMatSnackBar).toBeCalledWith('Test message', 'Test action', {
      duration: 3000,
    });
  });

  it('should open snackbar with provided message and default action and duration', () => {
    const openMatSnackBar = jest.spyOn(snackBar, 'open');
    service.openSnackBar('Test message');
    expect(openMatSnackBar).toBeCalledWith('Test message', 'Close', {
      duration: 5000,
    });
  });

  it('should open snackbar with empty message and default action and duration', () => {
    const openMatSnackBar = jest.spyOn(snackBar, 'open');
    service.openSnackBar('');
    expect(openMatSnackBar).toBeCalledWith('', 'Close', { duration: 5000 });
  });
});

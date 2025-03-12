import { MatSnackBar } from '@angular/material/snack-bar';

import { MockProvider } from 'ng-mocks';

import { Stub } from '../../test/stub.class';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    service = Stub.get<SnackbarService>({
      component: SnackbarService,
      providers: [MockProvider(MatSnackBar)],
    });
    snackBar = service['snackBar'];
  });

  it('should open snackbar with provided message, action and duration', () => {
    const openMatSnackBar = jest.spyOn(snackBar, 'open');
    service.openSnackBar('Test message', 'Test action', 3000);
    expect(openMatSnackBar).toHaveBeenCalledWith(
      'Test message',
      'Test action',
      {
        duration: 3000,
      }
    );
  });

  it('should open snackbar with provided message and default action and duration', () => {
    const openMatSnackBar = jest.spyOn(snackBar, 'open');
    service.openSnackBar('Test message');
    expect(openMatSnackBar).toHaveBeenCalledWith('Test message', 'Close', {
      duration: 5000,
    });
  });

  it('should open snackbar with empty message and default action and duration', () => {
    const openMatSnackBar = jest.spyOn(snackBar, 'open');
    service.openSnackBar('');
    expect(openMatSnackBar).toHaveBeenCalledWith('', 'Close', {
      duration: 5000,
    });
  });
});

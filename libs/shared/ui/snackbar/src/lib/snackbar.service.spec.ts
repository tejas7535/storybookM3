import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { SnackBarData } from './snackbar-data.model';
import { SnackBarType } from './snackbar-type.enum';
import { SnackBarComponent } from './snackbar.component';
import { SnackBarModule } from './snackbar.module';
import { SnackBarService } from './snackbar.service';

describe('SnackBarService', () => {
  let snackBarService: SnackBarService;
  let snackBar: MatSnackBar;

  let spectator: SpectatorService<SnackBarService>;

  const createService = createServiceFactory({
    service: SnackBarService,
    imports: [NoopAnimationsModule, SnackBarModule],
    providers: [
      {
        provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
        useValue: { duration: 100 },
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    snackBarService = spectator.inject(SnackBarService);
    snackBar = spectator.inject(MatSnackBar);
  });

  test('should be created', () => {
    expect(snackBarService).toBeTruthy();
  });

  describe('#showSuccessMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      snackBarService['showMessage'] = jest.fn();

      message = 'Success';
      expectedConfig = {
        panelClass: 'success-message',
        data: new SnackBarData('Success', undefined, SnackBarType.SUCCESS),
        duration: 3000,
      };

      snackBarService.showSuccessMessage(message);

      expect(snackBarService['showMessage']).toHaveBeenCalledWith(
        expectedConfig
      );
    });

    test('should set default success message', () => {
      snackBarService['showMessage'] = jest.fn();

      expectedConfig = {
        panelClass: 'success-message',
        data: new SnackBarData(
          'Changes are saved successfully',
          undefined,
          SnackBarType.SUCCESS
        ),
        duration: 3000,
      };

      snackBarService.showSuccessMessage();

      expect(snackBarService['showMessage']).toHaveBeenCalledWith(
        expectedConfig
      );
    });
  });

  describe('#showWarningMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      snackBarService['showMessage'] = jest.fn();

      message = 'Warning';
      expectedConfig = {
        panelClass: 'warning-message',
        data: new SnackBarData('Warning', undefined, SnackBarType.WARNING),
      };

      snackBarService.showWarningMessage(message);

      expect(snackBarService['showMessage']).toHaveBeenCalledWith(
        expectedConfig
      );
    });
  });

  describe('#showErrorMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      snackBarService['showMessage'] = jest.fn();

      message = 'Error';
      expectedConfig = {
        panelClass: 'error-message',
        data: new SnackBarData('Error', undefined, SnackBarType.ERROR),
      };

      snackBarService.showErrorMessage(message);

      expect(snackBarService['showMessage']).toHaveBeenCalledWith(
        expectedConfig
      );
    });

    test('should have infinite duration if shouldStay is set', () => {
      snackBarService['showMessage'] = jest.fn();

      message = 'Error';
      expectedConfig = {
        panelClass: 'error-message',
        data: new SnackBarData('Error', undefined, SnackBarType.ERROR),
        duration: Number.POSITIVE_INFINITY,
      };

      snackBarService.showErrorMessage(message, undefined, true);

      expect(snackBarService['showMessage']).toHaveBeenCalledWith(
        expectedConfig
      );
    });
  });

  describe('#showInfoMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      snackBarService['showMessage'] = jest.fn();

      message = 'Info';
      expectedConfig = {
        panelClass: 'info-message',
        data: new SnackBarData('Info', undefined, SnackBarType.INFORMATION),
      };

      snackBarService.showInfoMessage(message);

      expect(snackBarService['showMessage']).toHaveBeenCalledWith(
        expectedConfig
      );
    });
  });

  describe('#dismiss()', () => {
    test('should call MatSnackBar dismiss', () => {
      const spy = jest.spyOn(snackBar, 'dismiss');
      snackBarService.dismiss();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#showMessage()', () => {
    test('should call openComponent with SnackBarComponent and given config', () => {
      const spy = jest.spyOn(snackBar, 'openFromComponent');

      const snackBarConfig: MatSnackBarConfig = {
        panelClass: 'info-message',
        data: new SnackBarData('Info', 'ok', SnackBarType.INFORMATION),
      };

      snackBarService['showMessage'](snackBarConfig);

      expect(spy).toHaveBeenCalledWith(SnackBarComponent, snackBarConfig);
    });

    test.skip('should return dismissed as Observable after dismissed', (done) => {
      const snackBarConfig: MatSnackBarConfig = {
        panelClass: 'success-message',
        data: new SnackBarData('message', 'action', SnackBarType.SUCCESS),
        // duration: 100
      };

      snackBarService['showMessage'](snackBarConfig).subscribe((result) => {
        expect(result).toEqual('dismissed');
        done();
      });
    });
  });
});

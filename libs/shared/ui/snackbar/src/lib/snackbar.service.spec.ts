import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { SnackBarData } from './snackbar-data.model';
import { SnackBarType } from './snackbar-type.enum';
import { SnackBarComponent } from './snackbar.component';
import { SnackBarModule } from './snackbar.module';
import { SnackBarService } from './snackbar.service';

@NgModule({
  imports: [SnackBarModule],
})
class SnackBarTestModule {}

describe('SnackBarService', () => {
  let snackBarService: SnackBarService;
  let snackBar: MatSnackBar;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, BrowserAnimationsModule, SnackBarTestModule],
      providers: [SnackBarService],
    });
  });

  beforeEach(() => {
    snackBar = TestBed.inject(MatSnackBar);
    snackBarService = TestBed.inject(SnackBarService);
  });

  test('should be created', () => {
    expect(snackBarService).toBeTruthy();
  });

  describe('#showSuccessMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      const spy = spyOn<any>(snackBarService, 'showMessage');

      message = 'Success';
      expectedConfig = {
        panelClass: 'success-message',
        data: new SnackBarData('Success', undefined, SnackBarType.SUCCESS),
        duration: 3000,
      };

      snackBarService.showSuccessMessage(message);

      expect(spy).toHaveBeenCalledWith(expectedConfig);
    });

    test('should set default success message', () => {
      const spy = spyOn<any>(snackBarService, 'showMessage');

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

      expect(spy).toHaveBeenCalledWith(expectedConfig);
    });
  });

  describe('#showWarningMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      const spy = spyOn<any>(snackBarService, 'showMessage');

      message = 'Warning';
      expectedConfig = {
        panelClass: 'warning-message',
        data: new SnackBarData('Warning', undefined, SnackBarType.WARNING),
      };

      snackBarService.showWarningMessage(message);

      expect(spy).toHaveBeenCalledWith(expectedConfig);
    });
  });

  describe('#showErrorMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      const spy = spyOn<any>(snackBarService, 'showMessage');

      message = 'Error';
      expectedConfig = {
        panelClass: 'error-message',
        data: new SnackBarData('Error', undefined, SnackBarType.ERROR),
      };

      snackBarService.showErrorMessage(message);

      expect(spy).toHaveBeenCalledWith(expectedConfig);
    });
  });

  describe('#showInfoMessage()', () => {
    let message;
    let expectedConfig: MatSnackBarConfig;

    test('should call showMessage with correct config', () => {
      const spy = spyOn<any>(snackBarService, 'showMessage');

      message = 'Info';
      expectedConfig = {
        panelClass: 'info-message',
        data: new SnackBarData('Info', undefined, SnackBarType.INFORMATION),
      };

      snackBarService.showInfoMessage(message);

      expect(spy).toHaveBeenCalledWith(expectedConfig);
    });
  });

  describe('#showMessage()', () => {
    test('should call openComponent with SnackBarComponent and given config', () => {
      const spy = spyOn(snackBar, 'openFromComponent').and.callThrough();

      const snackBarConfig: MatSnackBarConfig = {
        panelClass: 'info-message',
        data: new SnackBarData('Info', 'ok', SnackBarType.INFORMATION),
      };

      snackBarService['showMessage'](snackBarConfig);

      expect(spy).toHaveBeenCalledWith(SnackBarComponent, snackBarConfig);
    });

    test('should return dismissed as Observable after dismissed', async(() => {
      snackBarService.showSuccessMessage().subscribe((result) => {
        expect(result).toEqual('dismissed');
      });
    }));
  });
});

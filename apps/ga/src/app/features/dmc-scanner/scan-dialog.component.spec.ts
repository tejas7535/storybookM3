import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BarcodeScannerFacade } from './barcode-scanner.facade';
import {
  cameraPermissionGranted,
  mockBarcode,
  scannerAvailableResult,
} from './barcode-scanning.facade.mock';
import { ScanDialogComponent } from './scan-dialog.component';

jest.mock('@capacitor-mlkit/barcode-scanning', () => ({
  BarcodeFormat: {
    DataMatrix: 'DATA_MATRIX',
  },
}));

jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: jest.fn(() => true),
  },
}));

const dialogMock = {
  close: jest.fn(),
  addPanelClass: jest.fn(),
  config: {},
};

describe('ScanDialog', () => {
  const createComponent = createComponentFactory({
    component: ScanDialogComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), CommonModule],
    providers: [
      provideHttpClientTesting(),
      provideHttpClient(),
      {
        provide: DialogRef,
        useValue: dialogMock,
      },
      MockProvider(BarcodeScannerFacade, {
        stopScan: jest.fn(() => of()),
        removeAllListeners: jest.fn(() => of()),
        scan: jest.fn(() => of({ barcodes: [mockBarcode] })),
        checkPermissions: jest.fn(() => of(cameraPermissionGranted)),
        requestPermissions: jest.fn(() => of(cameraPermissionGranted)),
        installGoogleBarcodeScannerModule: jest.fn(() => of()),
        isGoogleBarcodeScannerModuleAvailable: jest.fn(() =>
          of(scannerAvailableResult)
        ),
      }),
    ],
  });

  let component: ScanDialogComponent;
  let spectator: Spectator<ScanDialogComponent>;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Scanning', () => {
    it('intro should skip to scanned and loading', () => {
      expect(component.state().name).toEqual('Loading');
    });

    it('should show the scanner and load when the permission is granted', waitForAsync(async () => {
      const permissionCheck = await component.handlePermissionRequest();
      expect(permissionCheck).toEqual(true);
      expect(component.state().name).toEqual('Loading');
    }));

    it('should show the intro state when the permission is pending', waitForAsync(async () => {
      (
        component['scanningFacade'].requestPermissions as jest.Mock
      ).mockReturnValue(of({ camera: 'prompt' }));
      component['scanService'].nativePermissionGranted = jest.fn(() =>
        Promise.resolve(false)
      );
      const granted = await component.handlePermissionRequest();
      expect(granted).toBe(false);
      component['scanService'].reset();

      spectator.detectChanges();
      expect(component.state().name).toEqual('Intro');
    }));

    it('should show the error state when the permission is denied', waitForAsync(async () => {
      (
        component['scanningFacade'].requestPermissions as jest.Mock
      ).mockReturnValue(of({ camera: 'denied' }));
      component['scanService'].nativePermissionGranted = jest.fn(() =>
        Promise.resolve(false)
      );
      component['scanService'].pushError = jest.fn();

      const granted = await component.handlePermissionRequest();
      expect(granted).toBe(false);

      component['scanService'].reset();
      await component.showNativeScanner();
      expect(component['scanService'].pushError).toHaveBeenCalledWith(
        'nopermissions'
      );
    }));
  });
});

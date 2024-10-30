import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { environment } from '@ga/environments/environment';

import { BarcodeScannerFacade } from './barcode-scanner.facade';
import {
  cameraPermissionGranted,
  mockBarcode,
  scannerAvailableResult,
} from './barcode-scanning.facade.mock';
import { EABackendVerificationResponse } from './scan.models';
import { ScanService } from './scan.service';

jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: jest.fn(() => true),
    getPlatform: jest.fn(() => 'ios'),
  },
}));

jest.mock('@capacitor-mlkit/barcode-scanning', () => ({
  BarcodeFormat: {
    DataMatrix: 'DATA_MATRIX',
  },
}));

describe('ScanService', () => {
  let spectator: SpectatorService<ScanService>;
  let service: ScanService;

  let httpTesting: HttpTestingController;

  const createService = createServiceFactory({
    service: ScanService,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      MockProvider(TranslocoService, {
        getActiveLang: jest.fn(() => 'de'),
        translate: jest.fn(),
      }),
      {
        provide: BarcodeScannerFacade,
        useValue: {
          checkPermissions: jest.fn(() => of()),
          requestPermissions: jest.fn(() => of()),
        } as Partial<BarcodeScannerFacade>,
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

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ScanService);
    httpTesting = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkAuthenticity', () => {
    let subjectSpy: jest.SpyInstance;
    beforeEach(() => {
      subjectSpy = jest.spyOn(service['error$'], 'next');
    });

    it('should forward any known error codes', waitForAsync(() => {
      service.checkAuthenticity('abcdefghjk').subscribe((resp) => {
        expect(resp).toBeUndefined();
      });

      const req = httpTesting.expectOne(
        `${environment.dmcBackendUrl}/verify`,
        'Request to the verification backend'
      );

      expect(req.request.method).toBe('POST');
      expect(req.request.body.bearingCode).toBe(btoa('abcdefghjk'));
      expect(req.cancelled).toBeFalsy();

      expect(service['translocoService'].getActiveLang).toHaveBeenCalled();

      req.flush(
        {
          detail: {
            message: 'samplemessage',
            code: 'sample',
          },
        },
        {
          status: 400,
          statusText: 'Bad Request',
        }
      );

      expect(subjectSpy).toHaveBeenCalledWith('sample');
    }));

    it('return any valid result', (done) => {
      service.checkAuthenticity('abcdefghjk').subscribe((response) => {
        expect(response).toBeTruthy();
        done();
      });

      const req = httpTesting.expectOne(
        `${environment.dmcBackendUrl}/verify`,
        'Request to the verification backend'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body.bearingCode).toBe(btoa('abcdefghjk'));
      expect(req.cancelled).toBeFalsy();

      expect(service['translocoService'].getActiveLang).toHaveBeenCalled();
      expect(subjectSpy).not.toHaveBeenCalled();

      req.flush({
        flag: 'GREEN',
        pim: '1234',
        designation: '6226',
        imageUrl: 'none',
        upstreamMessages: 'Verified bearing product',
        greaseAppSupport: true,
      } as EABackendVerificationResponse);

      httpTesting.verify();
    });
  });
});

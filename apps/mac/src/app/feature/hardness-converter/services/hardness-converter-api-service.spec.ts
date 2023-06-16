import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  ConversionResponse,
  Info,
  UnitsResponse,
} from '@mac/feature/hardness-converter/models';
import {
  HARDNESS_CONVERSION_INFO_MOCK,
  HARDNESS_CONVERSION_MOCK,
  HARDNESS_CONVERSION_UNITS_MOCK,
} from '@mac/testing/mocks';

import { HardnessConverterApiService } from './hardness-converter-api.service';

describe('HardnessConverterApiService', () => {
  let spectator: SpectatorService<HardnessConverterApiService>;
  let service: HardnessConverterApiService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: HardnessConverterApiService,
    imports: [HttpClientTestingModule],
    providers: [
      HardnessConverterApiService,
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(HardnessConverterApiService);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInfo', () => {
    it('should fetch the info', (done) => {
      service.getInfo().subscribe((result: Info) => {
        expect(result).toEqual(HARDNESS_CONVERSION_INFO_MOCK);
        done();
      });

      const req = httpMock.expectOne(`${service['BASE_URL']}/info`);
      expect(req.request.method).toBe('GET');
      req.flush(HARDNESS_CONVERSION_INFO_MOCK);
    });
  });

  describe('getUnits', () => {
    it('should fetch the units', (done) => {
      service
        .getUnits({ conversionTable: 'table' })
        .subscribe((result: UnitsResponse) => {
          expect(result).toEqual(HARDNESS_CONVERSION_UNITS_MOCK);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/units`);
      expect(req.request.method).toBe('POST');
      req.flush(HARDNESS_CONVERSION_UNITS_MOCK);
    });
  });

  describe('getConversion', () => {
    it('should fetch the conversion', (done) => {
      service
        .getConversion({ conversionTable: 'table', unit: 'hv', value: 500 })
        .subscribe((result: ConversionResponse) => {
          expect(
            service['applicationInsightService'].logEvent
          ).toHaveBeenCalled();
          expect(result).toEqual(HARDNESS_CONVERSION_MOCK);
          done();
        });

      const req = httpMock.expectOne(`${service['BASE_URL']}/conversion`);
      expect(req.request.method).toBe('POST');
      req.flush(HARDNESS_CONVERSION_MOCK);
    });
  });
});

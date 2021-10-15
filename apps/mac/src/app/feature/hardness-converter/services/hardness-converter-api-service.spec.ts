import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { HARDNESS_CONVERSION_UNITS_MOCK } from '../../../../testing/mocks/hardness-conversion-units.mock';
import { HARDNESS_CONVERSION_MOCK } from '../../../../testing/mocks/hardness-conversion.mock';
import { environment } from './../../../../environments/environment';
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

  it('should return a unit list', () => {
    service.getUnits().subscribe((result: any) => {
      expect(result).toEqual(HARDNESS_CONVERSION_UNITS_MOCK);
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/hardness-conversion/api/score`
    );
    expect(req.request.method).toBe('POST');
    req.flush(HARDNESS_CONVERSION_UNITS_MOCK);
  });

  it('should return a converted value', () => {
    service.getConversionResult('mPa', 1234).subscribe((result: any) => {
      expect(result).toEqual(HARDNESS_CONVERSION_MOCK);
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/hardness-conversion/api/score`
    );
    expect(req.request.method).toBe('POST');
    req.flush(HARDNESS_CONVERSION_MOCK);
  });
});

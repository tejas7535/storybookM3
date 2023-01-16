import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  AQM_CALCULATION_CALCULATION_MOCK,
  AQM_CALCULATION_MATERIALS_MOCK,
  AQM_CALCULATION_MATERIALS_MOCK_PARSED,
} from '@mac/testing/mocks';

import { AQMCalculationRequest } from '../models';
import { environment } from './../../../../environments/environment';
import { AqmCalculatorApiService } from './aqm-calculator-api.service';

describe('AqmCalculatorApiService', () => {
  let spectator: SpectatorService<AqmCalculatorApiService>;
  let service: AqmCalculatorApiService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: AqmCalculatorApiService,
    imports: [HttpClientTestingModule],
    providers: [
      AqmCalculatorApiService,
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
    service = spectator.inject(AqmCalculatorApiService);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the materials data as AQMMaterials', () => {
    service.getMaterialsData().subscribe((result: any) => {
      expect(result).toEqual(AQM_CALCULATION_MATERIALS_MOCK_PARSED);
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/aqm-calculation/api/score`
    );
    expect(req.request.method).toBe('POST');
    req.flush(AQM_CALCULATION_MATERIALS_MOCK);
  });

  it('should return a aqm calculation', () => {
    service
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      .getCalculationResult({} as AQMCalculationRequest)
      .subscribe((result: any) => {
        expect(result).toEqual(AQM_CALCULATION_CALCULATION_MOCK);
      });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/aqm-calculation/api/score`
    );
    expect(req.request.method).toBe('POST');
    req.flush(AQM_CALCULATION_CALCULATION_MOCK);
  });
});

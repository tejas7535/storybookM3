import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { environment } from './../../../../environments/environment';
import { AQM_CALCULATION_CALCULATION_MOCK } from './../../../../testing/mocks/aqm-calculation-calculation.mock';
import { AQM_CALCULATION_MATERIALS_MOCK } from './../../../../testing/mocks/aqm-calculation-materials.mock';
import { AqmCalculatorApiService } from './aqm-calculator-api.service';
import { AQMCalculationRequest } from './aqm-calulator-response.model';

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

  it('should return the materials data', () => {
    service.getMaterialsData().subscribe((result: any) => {
      expect(result).toEqual(AQM_CALCULATION_MATERIALS_MOCK);
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

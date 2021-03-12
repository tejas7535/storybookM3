import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { ENV_CONFIG } from '@schaeffler/http';

import { AQM_CALCULATION_CALCULATION_MOCK } from './../../../../testing/mocks/aqm-calculation-calculation.mock';
import { AQM_CALCULATION_MATERIALS_MOCK } from './../../../../testing/mocks/aqm-calculation-materials.mock';
import { AqmCalculatorApiService } from './aqm-calculator-api.service';
import { AQMCalculationRequest } from './aqm-calulator-response.model';

describe('AqmCalculatorApiService', () => {
  let service: AqmCalculatorApiService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AqmCalculatorApiService,
        {
          provide: ENV_CONFIG,
          useValue: {
            environment: {
              baseUrl: '',
            },
          },
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AqmCalculatorApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the materials data', () => {
    service.getMaterialsData().subscribe((result) => {
      expect(result).toEqual(AQM_CALCULATION_MATERIALS_MOCK);
    });

    const req = httpMock.expectOne('/aqm-calculation/api/score');
    expect(req.request.method).toBe('POST');
    req.flush(AQM_CALCULATION_MATERIALS_MOCK);
  });

  it('should return a aqm calculation', () => {
    service
      // tslint:disable-next-line: no-object-literal-type-assertion
      .getCalculationResult({} as AQMCalculationRequest)
      .subscribe((result) => {
        expect(result).toEqual(AQM_CALCULATION_CALCULATION_MOCK);
      });

    const req = httpMock.expectOne('/aqm-calculation/api/score');
    expect(req.request.method).toBe('POST');
    req.flush(AQM_CALCULATION_CALCULATION_MOCK);
  });
});

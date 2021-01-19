import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENV_CONFIG } from '@schaeffler/http';
import { configureTestSuite } from 'ng-bullet';

import { HARDNESS_CONVERSION_UNITS_MOCK } from '../../../../testing/mocks/hardness-conversion-units.mock';
import {
  HARDNESS_CONVERSION_MOCK,
  hardnessConversionWithSideMock,
} from '../../../../testing/mocks/hardness-conversion.mock';
import { HardnessConverterApiService } from './hardness-converter-api.service';
import { InputSideTypes } from './hardness-converter-response.model';

describe('HardnessConverterApiService', () => {
  let service: HardnessConverterApiService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HardnessConverterApiService,
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
    service = TestBed.inject(HardnessConverterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a unit list', () => {
    service.getUnits().subscribe((result) => {
      expect(result).toEqual(HARDNESS_CONVERSION_UNITS_MOCK);
    });

    const req = httpMock.expectOne('/hardness-conversion/api/score');
    expect(req.request.method).toBe('POST');
    req.flush(HARDNESS_CONVERSION_UNITS_MOCK);
  });

  it('should return a converted value', () => {
    const side = InputSideTypes.from;
    service.getConversionResult('mPa', 'HB', 1234, side).subscribe((result) => {
      expect(result).toEqual(hardnessConversionWithSideMock(side));
    });

    const req = httpMock.expectOne('/hardness-conversion/api/score');
    expect(req.request.method).toBe('POST');
    req.flush(HARDNESS_CONVERSION_MOCK);
  });
});

import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import {
  CALCULATIONS_TYPE_MOCK,
  REFRENCE_TYPE_MOCK,
} from '../../../testing/mocks';
import { ENV_CONFIG } from '../../core/http/environment-config.interface';
import {
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../core/store/reducers/detail/models';
import { CalculationsResultModel } from '../../core/store/reducers/detail/models/calculations-result-model';
import { DetailService } from './detail.service';

describe('DetailService', () => {
  let service: DetailService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DetailService,
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
    service = TestBed.inject(DetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  test('should get detail result', () => {
    const mock = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);
    const expectedParams = new HttpParams()
      .set('material-number', '10000')
      .set('plant', 'IWS');

    service
      .detail(new ReferenceTypeIdModel('10000', 'IWS'))
      .subscribe((response) => {
        expect(response).toEqual(mock);
      });

    const req = httpMock.expectOne(`/detail?${expectedParams.toString()}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params).toEqual(expectedParams);
    req.flush(mock);
  });

  test('should get calculations result', () => {
    const mock = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);

    service.calculations('').subscribe((response) => {
      expect(response).toEqual(mock);
    });

    const req = httpMock.expectOne('/calculations?material-number=');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});

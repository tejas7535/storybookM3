import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { DETAIL_CASE_MOCK } from '../../../testing/mocks/detail-case.mock';
import { MaterialDetailsService } from './material-details.service';

describe('materialDetailsService', () => {
  let service: MaterialDetailsService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MaterialDetailsService,
        DataService,
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
    service = TestBed.inject(MaterialDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('materialDetails', () => {
    test('should call', () => {
      const materialNumber15 = '15015';
      const mock = {
        materialDetails: DETAIL_CASE_MOCK,
      };
      service.loadMaterials(materialNumber15).subscribe((response) => {
        expect(response).toEqual(mock.materialDetails);
      });
      const req = httpMock.expectOne('/materials/15015');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});

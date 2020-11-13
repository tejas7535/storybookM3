import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { CreateCase } from '../../../core/store/models';
import { CreateCaseService } from './create-case.service';

describe('CreateCaseService', () => {
  let service: CreateCaseService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CreateCaseService,
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
    service = TestBed.inject(CreateCaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('createCase', () => {
    test('should call', () => {
      const mockBody: CreateCase = {
        customerId: '1234',
        materialQuantities: [{ materialId: '123', quantity: 10 }],
      };
      service.createCase(mockBody).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne('/quotations');
      expect(req.request.method).toBe('POST');
      req.flush(mockBody);
    });
  });
});

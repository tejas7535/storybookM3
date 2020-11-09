import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { CaseTableItem } from '../../../core/store/models';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let httpMock: HttpTestingController;
  let service: ValidationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ValidationService,
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
    service = TestBed.inject(ValidationService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('validate', () => {
    test('should call', () => {
      const mockTable: CaseTableItem[] = [];
      service.validate(mockTable).subscribe((response) => {
        expect(response).toEqual([]);
      });
      const req = httpMock.expectOne('/materials/validation');
      expect(req.request.method).toBe('POST');
      req.flush(mockTable);
    });
  });
});

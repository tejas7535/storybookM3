import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { AutocompleteSearch, CaseFilterItem } from '../../../core/store/models';
import { AutocompleteService } from './autocomplete.service';

describe('AutocompleteService', (): void => {
  let service: AutocompleteService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AutocompleteService,
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
    service = TestBed.inject(AutocompleteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('autocomplete', () => {
    test('should call ', () => {
      const search: AutocompleteSearch = new AutocompleteSearch(
        'testParam',
        'hallo'
      );
      const mock: CaseFilterItem = {
        filter: 'house',
        options: [{ id: 'test', value: 'test', selected: false }],
      };
      service.autocomplete(search).subscribe((response) => {
        expect(response).toEqual(mock.options);
      });

      const req = httpMock.expectOne(
        '/auto-complete/testparam?search_for=hallo'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService } from '../core/http/data.service';
import { ENV_CONFIG } from '../core/http/environment-config.interface';
import {
  FilterItem,
  FilterItemIdValue,
  IdValue,
  SearchResult,
  TextSearch,
} from '../core/store/reducers/search/models';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchService,
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
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getInitialFiltersSales', () => {
    test('should get initial filters', () => {
      const mock: FilterItem[] = [];

      service.getInitialFiltersSales().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/initial-filter-sales');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('search', () => {
    test('should get search result', () => {
      const mock = new SearchResult([], []);

      service.search([]).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/search-sales');
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });

  describe('autocomplete', () => {
    test('should get autocomplete suggestions', () => {
      const textSearch = new TextSearch('customer', 'Audi');
      const mock = new FilterItemIdValue('customer', [
        new IdValue('audi', 'Audi'),
      ]);

      service.autocomplete(textSearch).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `/possible-filter/${textSearch.field}?search_for=${textSearch.value}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('textSearch', () => {
    test('should get autocomplete suggestions', (done) => {
      const textSearch = {
        field: 'customer',
        value: 'Aud',
      };

      service.textSearch(textSearch).subscribe((response) => {
        expect(response).toEqual(new SearchResult([], []));
        done();
      });
    });
  });
});

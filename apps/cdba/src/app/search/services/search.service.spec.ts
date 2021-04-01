import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ENV_CONFIG } from '@schaeffler/http';

import {
  FilterItem,
  IdValue,
  SearchResult,
  TextSearch,
} from '../../core/store/reducers/search/models';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let spectator: SpectatorService<SearchService>;
  let service: SearchService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: SearchService,
    imports: [HttpClientTestingModule],
    providers: [
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

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(SearchService);
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getInitialFilters', () => {
    test('should get initial filters', () => {
      const mock: FilterItem[] = [];

      service.getInitialFilters().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/initial-filter');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('search', () => {
    test('should get search result', () => {
      const mock = new SearchResult([], [], 0);

      service.search([]).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/search');
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });

  describe('autocomplete', () => {
    test('should get autocomplete suggestions', () => {
      const textSearch = new TextSearch('customer', 'Audi');
      const mock = [new IdValue('audi', 'Audi', true)];

      service['searchUtilities'].mergeOptionsWithSelectedOptions = jest.fn(
        () => mock
      );

      service.autocomplete(textSearch, []).subscribe((response) => {
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
        expect(response).toEqual(new SearchResult([], [], 0));
        done();
      });
    });
  });
});

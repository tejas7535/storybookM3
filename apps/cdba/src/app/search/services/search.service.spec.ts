import { HttpParams, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { withCache } from '@ngneat/cashew';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { StringOption } from '@schaeffler/inputs';

import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import { LocalStorageMock } from '@cdba/testing/mocks/storage/local-storage.mock';

import {
  FilterItem,
  SearchResult,
} from '../../core/store/reducers/search/models';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let spectator: SpectatorService<SearchService>;
  let service: SearchService;
  let httpMock: HttpTestingController;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: SearchService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(SearchService);
    httpMock = spectator.inject(HttpTestingController);

    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;

    localStorage.clear();
    localStorage.setItem('language', 'en');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getInitialFilters', () => {
    it('should get initial filters', () => {
      const mock: FilterItem[] = [];

      service.getInitialFilters().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('api/v1/initial-filter');
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    });
  });

  describe('search', () => {
    it('should get search result', () => {
      const mock = new SearchResult([], [], 0);

      const expectedParams = new HttpParams().set('language', 'en');

      service.search([]).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/search?${expectedParams.toString()}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });

  describe('autocomplete', () => {
    it('should get autocomplete suggestions', () => {
      const searchFor = 'Audi';
      const filterName = 'customer';
      const mock = [{ id: 'audi', title: 'Audi' } as StringOption];

      service.autocomplete(searchFor, filterName).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/possible-filter/${filterName}?search_for=${searchFor}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(mock);
    });
  });

  describe('textSearch', () => {
    it('should get autocomplete suggestions', (done) => {
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

  describe('exportBoms', () => {
    it('should get exported boms', () => {
      const identifiers = [new ReferenceTypeIdentifier('123', '123')];

      const mockedResponse = {
        filename: 'CDBA-Bills-of-Materials.xlsx',
        content: new Blob([''], {
          type: 'application/octet-stream',
        }),
      };

      service.exportBoms(identifiers).subscribe((response) => {
        expect(response.content instanceof Blob).toBeTruthy();
        expect(response.filename).toBe('CDBA-Bills-of-Materials.xlsx');
      });

      const req = httpMock.expectOne('api/v1/bom/export');
      expect(req.request.headers.get('Accept')).toBe(
        'application/octet-stream'
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockedResponse.content, {
        headers: {
          'Content-Disposition':
            'attachment; filename="CDBA-Bills-of-Materials.xlsx"',
        },
      });
    });

    it('should get filename from content-disposition header', () => {
      const input = 'attachements; filename=CDBA-Bills-of-Materials.xlsx';
      const expected = 'CDBA-Bills-of-Materials.xlsx';

      const result = service['getFileName'](input);

      expect(result).toEqual(expected);
    });
  });
});

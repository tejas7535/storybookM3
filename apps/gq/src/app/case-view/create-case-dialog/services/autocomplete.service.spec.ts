import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { AutocompleteSearch, CaseFilterItem } from '../../../core/store/models';
import { FilterNames } from '../../../shared/autocomplete-input/filter-names.enum';
import { AutocompleteService } from './autocomplete.service';

describe('AutocompleteService', (): void => {
  let service: AutocompleteService;
  let spectator: SpectatorService<AutocompleteService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: AutocompleteService,
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

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
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
    test('should call for sapquotation ', () => {
      const search: AutocompleteSearch = new AutocompleteSearch(
        FilterNames.QUOTATION,
        'test'
      );
      const mock: CaseFilterItem = {
        filter: 'house',
        options: [{ id: 'test', value: 'test', selected: false }],
      };
      service.autocomplete(search).subscribe((response) => {
        expect(response).toEqual(mock.options);
      });

      const req = httpMock.expectOne(
        '/auto-complete/sap-quotation?search_for=test'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});

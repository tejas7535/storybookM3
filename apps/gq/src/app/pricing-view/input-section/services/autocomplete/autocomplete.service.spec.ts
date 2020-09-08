import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService } from '../../../../core/http/data.service';
import { ENV_CONFIG } from '../../../../core/http/environment-config.interface';
import { IdValue } from '../../../../core/store/models';
import { AutocompleteService } from './autocomplete.service';

describe('AutocompleteService', (): void => {
  let service: AutocompleteService;

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

  beforeEach((): void => {
    service = TestBed.inject(AutocompleteService);
  });

  test('should be created', (): void => {
    expect(service).toBeTruthy();
  });
  describe('mergeOptionsWithSelectedOptions', () => {
    test('should return IdValue[]', () => {
      const options: IdValue[] = [
        { id: '23', value: 'The customer', selected: false },
        { id: '24', value: 'The customer', selected: false },
      ];
      const selectedOptions: IdValue[] = [
        { id: '23', value: 'The customer', selected: true },
      ];
      const expectedResponse = [
        { id: '23', value: 'The customer', selected: true },
        { id: '24', value: 'The customer', selected: false },
      ];

      const response = service.mergeOptionsWithSelectedOptions(
        options,
        selectedOptions
      );

      expect(response).toEqual(expectedResponse);
    });
  });
});

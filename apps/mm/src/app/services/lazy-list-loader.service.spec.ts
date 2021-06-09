import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../environments/environment';
import {
  BEARING_PREFLIGHT_RESPONSE_MOCK,
  LOAD_OPTIONS_RESPONSE_MOCK,
} from '../../testing/mocks/rest.service.mock';
import { RSY_BEARING } from '../shared/constants/dialog-constant';
import {
  LOAD_OPTIONS_RESPONSE_MOCK_COMPLEX,
  LOAD_OPTIONS_RESPONSE_MOCK_SIMPLE,
} from './../../testing/mocks/rest.service.mock';
import { RestService } from './../core/services/rest/rest.service';
import { LazyListLoaderService } from './lazy-list-loader.service';

describe('LazyListLoaderService testing', () => {
  let service: LazyListLoaderService;
  let spectator: SpectatorService<LazyListLoaderService>;

  const createService = createServiceFactory({
    service: LazyListLoaderService,
    providers: [
      {
        provide: RestService,
        useValue: {
          getLoadOptions: jest.fn((requestUrl) => {
            // for testing purposes url == complex returns complex response
            // url == simple returns simple response
            // other cases return base response
            if (requestUrl === 'complex') {
              return of(LOAD_OPTIONS_RESPONSE_MOCK_COMPLEX);
            } else if (requestUrl === 'simple') {
              return of(LOAD_OPTIONS_RESPONSE_MOCK_SIMPLE);
            }

            return of(LOAD_OPTIONS_RESPONSE_MOCK);
          }),
          getBearingPreflightResponse: jest.fn(() =>
            of(BEARING_PREFLIGHT_RESPONSE_MOCK)
          ),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('#loadOptions', () => {
    it('should call preflight if url ends with preflight', () => {
      const mockUrl = `mockUrl${environment.preflightPath}`;
      const mockValues = [
        {
          name: 'mockName',
          value: 'mockValue',
        },
      ];

      service['preflight'] = jest.fn();

      service.loadOptions(mockUrl, mockValues);

      expect(service['preflight']).toHaveBeenCalledTimes(1);
    });

    it('should call getLoadOptions if no preflight url (complex request)', () => {
      const mockUrl = `complex`;
      const mockValues = [
        {
          name: 'mockName',
          value: 'mockValue',
        },
      ];

      service
        .loadOptions(mockUrl, mockValues)
        .subscribe((response) =>
          expect(response).toEqual(LOAD_OPTIONS_RESPONSE_MOCK_COMPLEX)
        );

      expect(service['restService'].getLoadOptions).toHaveBeenCalledWith(
        mockUrl
      );
    });

    it('should call getLoadOptions if no preflight url (simple request)', () => {
      const mockUrl = `simple`;
      const mockValues = [
        {
          name: 'mockName',
          value: 'mockValue',
        },
      ];

      service
        .loadOptions(mockUrl, mockValues)
        .subscribe((response) =>
          expect(response).toEqual(LOAD_OPTIONS_RESPONSE_MOCK_SIMPLE)
        );

      expect(service['restService'].getLoadOptions).toHaveBeenCalledWith(
        mockUrl
      );
    });
  });

  describe('#preflight', () => {
    it('should call getPreflight response', () => {
      const mock = { data: { input: [] } } as any;
      const mockValues = [
        {
          name: 'mockName',
          value: 'mockValue',
        },
        {
          name: RSY_BEARING,
          value: 'mockValue',
        },
      ];

      service['preflight'](mockValues).subscribe((response) =>
        expect(response).toEqual(mock)
      );

      expect(
        service['restService'].getBearingPreflightResponse
      ).toHaveBeenCalledWith({
        IDCO_DESIGNATION: 'mockValue',
        mockName: 'mockValue',
      });
    });
  });
});

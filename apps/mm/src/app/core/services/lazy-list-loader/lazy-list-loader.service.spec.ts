import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  BEARING_PREFLIGHT_RESPONSE_MOCK,
  LOAD_OPTIONS_RESPONSE_MOCK,
} from '../../../../testing/mocks/rest.service.mock';
import { RestService } from '../rest';
import {
  LOAD_OPTIONS_RESPONSE_MOCK_COMPLEX,
  LOAD_OPTIONS_RESPONSE_MOCK_SIMPLE,
} from './../../../../testing/mocks/rest.service.mock';
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
    it('should call getLoadOptions if no preflight url (complex request)', (done) => {
      const mockUrl = `complex`;
      const mockValues = [
        {
          name: 'mockName',
          value: 'mockValue',
        },
      ];

      service.loadOptions(mockUrl, mockValues).subscribe((response) => {
        expect(response).toEqual([
          {
            id: 'mockId',
            imageUrl: `${service.baseImageURL}/Images/image.png`,
            text: 'mockTitle',
          },
        ]);
        done();
      });

      expect(service['restService'].getLoadOptions).toHaveBeenCalledWith(
        mockUrl
      );
    });

    it('should call getLoadOptions if no preflight url (simple request)', (done) => {
      const mockUrl = `simple`;
      const mockValues = [
        {
          name: 'mockName',
          value: 'mockValue',
        },
      ];

      service.loadOptions(mockUrl, mockValues).subscribe((response) => {
        expect(response).toEqual([
          {
            id: 'mockId',
            imageUrl: `${service.baseImageURL}/Images/image.png`,
            text: 'mockTitle',
          },
          { id: 'mockId2', imageUrl: undefined, text: 'mockTitle2' },
        ]);
        done();
      });

      expect(service['restService'].getLoadOptions).toHaveBeenCalledWith(
        mockUrl
      );
    });

    it('should not break if neither simple nor complex response is returned', (done) => {
      const mockUrl = `base`;
      const mockValues = [
        {
          name: 'mockName',
          value: 'mockValue',
        },
      ];

      service.loadOptions(mockUrl, mockValues).subscribe((response) => {
        expect(response).toEqual([
          {
            id: 'some id',
            text: 'some title',
            imageUrl: undefined,
          },
        ]);
        done();
      });

      expect(service['restService'].getLoadOptions).toHaveBeenCalledWith(
        mockUrl
      );
    });
  });
});

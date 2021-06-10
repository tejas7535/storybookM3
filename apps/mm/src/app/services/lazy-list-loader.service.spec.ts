import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../environments/environment';
import {
  BEARING_PREFLIGHT_EMPTY_MOCK,
  BEARING_PREFLIGHT_RESPONSE_MOCK,
  LOAD_OPTIONS_RESPONSE_MOCK,
} from '../../testing/mocks/rest.service.mock';
import {
  IDMM_HYDRAULIC_NUT_TYPE,
  RSY_BEARING,
} from '../shared/constants/dialog-constant';
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
          { id: 'mockId', imageUrl: 'mockHref', text: 'mockTitle' },
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
          { id: 'mockId', imageUrl: 'testHref', text: 'mockTitle' },
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

  describe('#preflight', () => {
    it('should call getPreflight response', (done) => {
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

      service['preflight'](mockValues).subscribe((response) => {
        expect(response).toEqual([{ id: 'some id', text: 'some text' }]);
        done();
      });

      expect(
        service['restService'].getBearingPreflightResponse
      ).toHaveBeenCalledWith({
        IDCO_DESIGNATION: 'mockValue',
        mockName: 'mockValue',
      });
    });

    it('should throw an error on empty nutfield', async () => {
      service['restService'].getBearingPreflightResponse = jest.fn(() =>
        of(BEARING_PREFLIGHT_EMPTY_MOCK)
      );
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

      await expect(
        service['preflight'](mockValues).toPromise()
      ).rejects.toThrowError(
        new Error(`Cannot find ${IDMM_HYDRAULIC_NUT_TYPE} field`)
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

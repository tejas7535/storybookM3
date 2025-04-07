import { of } from 'rxjs';

import {
  BEARING_SEATS_RESPONSE,
  SIMPLE_LIST_RESPONSE,
} from '@mm/testing/mocks/rest.service.mock';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { RestService } from '../rest';
import { LazyListLoaderService } from './lazy-list-loader.service';

jest.mock('@mm/environments/environment', () => ({
  environment: {
    baseUrl: 'http://mock-base-url/mounting/api/v2/mountingmanager',
  },
}));

describe('LazyListLoaderService', () => {
  let service: LazyListLoaderService;
  let spectator: SpectatorService<LazyListLoaderService>;
  let restService: RestService;

  const createService = createServiceFactory({
    service: LazyListLoaderService,
    providers: [
      {
        provide: RestService,
        useValue: { getLoadOptions: jest.fn() },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    restService = spectator.inject(RestService);
  });

  describe('#loadBearingSeatsOptions', () => {
    it('should call loadBearingSeatsOptions url', (done) => {
      jest
        .spyOn(restService, 'getLoadOptions')
        .mockReturnValue(of(BEARING_SEATS_RESPONSE));
      const mockUrl = `bearingSeatsURL`;

      service.loadBearingSeatsOptions(mockUrl).subscribe((response) => {
        expect(response).toMatchSnapshot();
        done();
      });

      expect(service['restService'].getLoadOptions).toHaveBeenCalledWith(
        mockUrl
      );
    });
  });

  describe('#loadOptions', () => {
    it('should call getLoadOptions simple request', (done) => {
      const mockUrl = `simple`;

      jest
        .spyOn(restService, 'getLoadOptions')
        .mockReturnValue(of(SIMPLE_LIST_RESPONSE));

      service.loadOptions(mockUrl).subscribe((response) => {
        expect(response).toMatchSnapshot();
        done();
      });

      expect(service['restService'].getLoadOptions).toHaveBeenCalledWith(
        mockUrl
      );
    });
  });
});

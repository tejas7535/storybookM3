import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';

import { Region } from '../../feature/global-selection/model';
import { SnackbarService } from '../utils/service/snackbar.service';
import { UserService } from './user.service';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
  },
});

describe('UserService', () => {
  let spectator: SpectatorService<UserService>;
  let httpTesting: SpyObject<HttpTestingController>;
  const createService = createServiceFactory({
    service: UserService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      mockProvider(SnackbarService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    httpTesting = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should return the region from the storage if exists', (done) => {
    jest
      .spyOn(global.localStorage, 'getItem')
      .mockReturnValue('storage region');

    spectator.service.loadRegion().subscribe((returnValue) => {
      expect(returnValue).toEqual('storage region');
      done();
    });
    httpTesting.expectNone('api/user/region', 'Load ther users region');
  });

  it('should load the region from the backend if it does not exist in the backend', (done) => {
    jest.spyOn(global.localStorage, 'getItem').mockReturnValue('');

    spectator.service.loadRegion().subscribe((returnValue) => {
      expect(returnValue).toEqual(Region.Europe);
      done();
    });

    const regionRequest = httpTesting.expectOne(
      'api/user/region',
      'Load ther users region'
    );
    expect(regionRequest.request.method).toEqual('GET');
    regionRequest.flush(Region.Europe);
  });

  it('should show the correct error message when the backend call failed', () => {
    const snackbarService = spectator.inject(SnackbarService);
    jest.spyOn(global.localStorage, 'getItem').mockReturnValue('');

    spectator.service.loadRegion().subscribe();

    const regionRequest = httpTesting.expectOne(
      'api/user/region',
      'Load ther users region'
    );
    expect(regionRequest.request.method).toEqual('GET');
    regionRequest.flush('Failed!', {
      status: 500,
      statusText: 'Internal Server Error',
    });
    expect(snackbarService.openSnackBar).toHaveBeenCalledWith(
      'error.loadingConfigurationFailed'
    );
  });
});

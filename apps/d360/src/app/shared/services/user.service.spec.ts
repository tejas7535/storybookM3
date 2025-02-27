import { BehaviorSubject, Observable } from 'rxjs';

import {
  createHttpFactory,
  HttpMethod,
  mockProvider,
  SpectatorHttp,
} from '@ngneat/spectator/jest';

import { appRoutes } from '../../app.routes';
import { AppRoutePath, AppRouteValue } from '../../app.routes.enum';
import { Region } from '../../feature/global-selection/model';
import { AuthService } from '../utils/auth/auth.service';
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
  let spectator: SpectatorHttp<UserService>;
  let service: UserService;
  const roleSubject = new BehaviorSubject<string[]>([]);
  const createService = createHttpFactory({
    service: UserService,
    providers: [
      mockProvider(SnackbarService),
      mockProvider(AuthService, {
        getUserRoles(): Observable<string[]> {
          return roleSubject;
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    spectator.expectConcurrent([
      { url: 'api/user-settings/general', method: HttpMethod.GET },
      { url: 'api/user/region', method: HttpMethod.GET },
    ]);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('Region', () => {
    it('should return the region from the storage if exists', (done) => {
      jest
        .spyOn(global.localStorage, 'getItem')
        .mockReturnValue('storage region');

      service.loadRegion().subscribe((returnValue) => {
        expect(returnValue).toEqual('storage region');
        expect(service.region()).toEqual('storage region');
        done();
      });
    });

    it('should load the region from the backend, if it does not exist in the local storage', (done) => {
      jest.spyOn(global.localStorage, 'getItem').mockReturnValue('');

      service.loadRegion().subscribe((returnValue) => {
        expect(returnValue).toEqual(Region.Europe);
        expect(service.region()).toEqual(Region.Europe);
        done();
      });
      const request = spectator.expectOne('api/user/region', HttpMethod.GET);
      request.flush(Region.Europe);
    });

    it('should show the correct error message when the backend call for the region failed', () => {
      const snackbarService = spectator.inject(SnackbarService);
      jest.spyOn(global.localStorage, 'getItem').mockReturnValue('');

      service.loadRegion().subscribe();

      const regionRequest = spectator.expectOne(
        'api/user/region',
        HttpMethod.GET
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
  describe('Start page', () => {
    it('should save the startPage on the server and save it in the signal', () => {
      const testPage = AppRoutePath.TodoPage;
      service.saveStartPage(testPage).subscribe();
      const request = spectator.expectOne(
        'api/user-settings/general',
        HttpMethod.POST
      );
      request.flush(null);

      expect(service.startPage()).toEqual(testPage);
      expect(request.request.body).toEqual({ startPage: testPage });
    });

    it('should return the startPage from the backend when it exists and save it in the signal', (done) => {
      const testPage = AppRoutePath.TodoPage;
      service.getStartPage().subscribe((startPage: AppRouteValue) => {
        expect(startPage).toBe(testPage);
        expect(service.startPage()).toEqual(testPage);
        done();
      });

      spectator
        .expectOne('api/user-settings/general', HttpMethod.GET)
        .flush({ startPage: testPage });
    });

    it('should return the european startPage when the settings request fails and europe is returned as a region', (done) => {
      service.getStartPage().subscribe((startPage: AppRouteValue) => {
        expect(startPage).toBe(AppRoutePath.OverviewPage);
        expect(service.startPage()).toBe(AppRoutePath.OverviewPage);
        done();
      });
      spectator.expectOne('api/user-settings/general', HttpMethod.GET).flush({
        status: 500,
        statusText: 'Internal Server Error',
      });
      spectator
        .expectOne('api/user/region', HttpMethod.GET)
        .flush(Region.Europe);
    });

    it('should return the default startPage when both requests fail', (done) => {
      service.getStartPage().subscribe((startPage: AppRouteValue) => {
        expect(startPage).toBe(AppRoutePath.OverviewPage);
        expect(service.startPage()).toBe(AppRoutePath.OverviewPage);
        done();
      });
      spectator.expectOne('api/user-settings/general', HttpMethod.GET).flush({
        status: 500,
        statusText: 'Internal Server Error',
      });
      spectator
        .expectOne('api/user/region', HttpMethod.GET)
        .flush(Region.Europe);
    });
  });
  describe('Visible routes', () => {
    it('should not show any general entry for chinese users without a role', () => {
      service.region.set(Region.GreaterChina);
      const result = service.filterVisibleRoutes(appRoutes.functions.general);
      expect(result.length).toBe(0);
    });
    it('should show the overview menu entry in the general section for EU users', () => {
      service.region.set(Region.Europe);
      const result = service.filterVisibleRoutes(appRoutes.functions.general);
      expect(result.length).toBe(1);
      expect(result[0].path).toEqual(AppRoutePath.OverviewPage);
    });

    it('should not show the alert-rule menu items when the user has no roles', () => {
      service.region.set(Region.GreaterChina);
      expect(service['userRoles']()).toEqual([]);
      const result = service.filterVisibleRoutes(appRoutes.functions.general);
      expect(result.length).toBe(0);
    });

    it('should show the restricted menu items when user has on of the the needed roles', () => {
      service.region.set(Region.GreaterChina);
      roleSubject.next(['SD-D360_RO', 'SD-D360_ADMIN=SW']);
      const result = service.filterVisibleRoutes(appRoutes.functions.general);
      expect(result.length).toBe(1);
      expect(result[0].path).toBe(AppRoutePath.AlertRuleManagementPage);
    });
  });
});

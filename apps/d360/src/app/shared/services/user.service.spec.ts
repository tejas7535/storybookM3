import { BehaviorSubject, of, take, throwError } from 'rxjs';

import { appRoutes } from '../../app.routes';
import { AppRoutePath } from '../../app.routes.enum';
import { Region } from '../../feature/global-selection/model';
import { Stub } from '../test/stub.class';
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
  let service: UserService;
  const roleSubject = new BehaviorSubject<string[]>([]);

  beforeEach(() => {
    service = Stub.get<UserService>({
      component: UserService,
      providers: [Stub.getAuthServiceProvider(roleSubject)],
    });
  });

  describe('Region', () => {
    it('should return the region from the storage if exists', (done) => {
      jest
        .spyOn(global.localStorage, 'getItem')
        .mockReturnValue('storage region');

      service
        .loadRegion()
        .pipe(take(1))
        .subscribe((returnValue) => {
          expect(returnValue).toEqual('storage region');
          expect(service.region()).toEqual('storage region');
          done();
        });
    });

    it('should load the region from the backend, if it does not exist in the local storage', (done) => {
      jest.spyOn(global.localStorage, 'getItem').mockReturnValue('');
      jest.spyOn(service['http'], 'get').mockReturnValue(of(Region.Europe));

      service
        .loadRegion()
        .pipe(take(1))
        .subscribe((returnValue) => {
          expect(returnValue).toEqual(Region.Europe);
          expect(service.region()).toEqual(Region.Europe);
          done();
        });
    });

    it('should show the correct error message when the backend call for the region failed', (done) => {
      jest.spyOn(global.localStorage, 'getItem').mockReturnValue('');
      jest.spyOn(service['snackbarService'], 'openSnackBar');

      jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(throwError(() => new Error('any error')));

      service
        .loadRegion()
        .pipe(take(1))
        .subscribe(() => {
          expect(service['snackbarService'].openSnackBar).toHaveBeenCalledWith(
            'error.loadingConfigurationFailed'
          );

          done();
        });
    });
  });

  describe('Start page', () => {
    it('should save the startPage on the server and save it in the signal', (done) => {
      const testPage = AppRoutePath.TodoPage;
      service
        .saveStartPage(testPage)
        .pipe(take(1))
        .subscribe(() => {
          expect(service.startPage()).toEqual(testPage);
          done();
        });
    });
  });

  describe('Visible routes', () => {
    it('should not show any general entry for chinese users without a role', () => {
      roleSubject.next([]);
      service.region.set(Region.GreaterChina);
      const result = service.filterVisibleRoutes(appRoutes.functions.general);
      expect(result.length).toBe(0);
    });

    it('should show the overview menu entry in the general section for EU users', () => {
      roleSubject.next([]);
      service.region.set(Region.Europe);
      const result = service.filterVisibleRoutes(appRoutes.functions.general);
      expect(result.length).toBe(1);
      expect(result[0].path).toEqual(AppRoutePath.OverviewPage);
    });

    it('should not show the alert-rule menu items when the user has no roles', () => {
      roleSubject.next([]);
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

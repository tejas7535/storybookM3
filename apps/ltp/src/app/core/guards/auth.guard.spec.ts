import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { KeycloakService } from 'keycloak-angular';
import { configureTestSuite } from 'ng-bullet';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let router: Router;
  let guard: AuthGuard;
  let keycloakService: KeycloakService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, KeycloakService]
    });
  });

  beforeEach(() => {
    router = TestBed.get(Router);
    guard = TestBed.get(AuthGuard);
    keycloakService = TestBed.get(KeycloakService);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('#isAccessAllowed', () => {
    let granted: boolean;
    let route: ActivatedRouteSnapshot;

    beforeEach(() => {
      granted = undefined;
      guard['authenticated'] = true;

      keycloakService.login = jest.fn();
    });

    it('should deny access, when user is not authenticated', async () => {
      guard['authenticated'] = false;

      granted = await guard.isAccessAllowed(undefined);

      expect(granted).toEqual(false);
    });

    it('should login the user, when he is not authenticated', async () => {
      guard['authenticated'] = false;

      granted = await guard.isAccessAllowed(undefined);

      expect(keycloakService.login).toHaveBeenCalled();
    });

    it('should grant access, if there is no required role for the path', async () => {
      route = ({ data: {} } as unknown) as ActivatedRouteSnapshot;

      granted = await guard.isAccessAllowed(route);

      expect(granted).toEqual(true);
    });

    it('should grant access, if the length of the required roles for the path is 0', async () => {
      route = ({ data: { roles: [] } } as unknown) as ActivatedRouteSnapshot;

      granted = await guard.isAccessAllowed(route);

      expect(granted).toEqual(true);
    });

    it('should deny access, if the user has no roles', async () => {
      guard['roles'] = undefined;
      route = ({
        data: { roles: ['role'] }
      } as unknown) as ActivatedRouteSnapshot;

      granted = await guard.isAccessAllowed(route);

      expect(granted).toEqual(false);
    });

    it('should deny access, if the user has an empty roles array', async () => {
      guard['roles'] = [];
      route = ({
        data: { roles: ['role'] }
      } as unknown) as ActivatedRouteSnapshot;

      granted = await guard.isAccessAllowed(route);

      expect(granted).toEqual(false);
    });

    it('should deny access if user has not all required roles', async () => {
      guard['roles'] = ['role1'];
      route = ({
        data: { roles: ['role1', 'role2'] }
      } as unknown) as ActivatedRouteSnapshot;

      granted = await guard.isAccessAllowed(route);

      expect(granted).toEqual(false);
    });

    it('should grant access, if user has every role', async () => {
      guard['roles'] = ['role1', 'role2'];
      route = ({
        data: { roles: ['role1', 'role2'] }
      } as unknown) as ActivatedRouteSnapshot;

      granted = await guard.isAccessAllowed(route);

      expect(granted).toEqual(true);
    });

    it('should call method denyAccess, if access is denied', async () => {
      guard['denyAccess'] = jest.fn();
      guard['roles'] = [];
      route = ({
        data: { roles: ['role'] }
      } as unknown) as ActivatedRouteSnapshot;

      await guard.isAccessAllowed(route);

      expect(guard['denyAccess']).toHaveBeenCalled();
    });
  });

  describe('#denyAccess', () => {
    beforeEach(() => {
      router.navigate = jest.fn();
    });

    it('should navigate to correct redirect uri', () => {
      const route = ({
        data: { unauthorized: { redirect: 'redirectUri' } }
      } as unknown) as ActivatedRouteSnapshot;

      guard['denyAccess'](route);

      expect(router.navigate).toHaveBeenCalledWith('redirectUri');
    });

    it('should not navigate if no redirect uri exists', () => {
      // tslint:disable-next-line: no-object-literal-type-assertion
      guard['denyAccess']({ data: {} } as ActivatedRouteSnapshot);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('#signOut', () => {
    beforeEach(() => {
      keycloakService.logout = jest.fn();
      router.navigate = jest.fn();
    });

    it('should logout', () => {
      guard.signOut();

      expect(keycloakService.logout).toHaveBeenCalled();
    });

    it('should navigate to /signout', () => {
      guard.signOut();

      expect(router.navigate).toHaveBeenCalledWith(['signout']);
    });
  });

  describe('#getCurrentProfile', () => {
    beforeEach(() => {
      keycloakService.loadUserProfile = jest.fn();
    });

    it('should return the user profile of keycloakService', async(async () => {
      keycloakService.loadUserProfile = jest.fn(
        async () =>
          new Promise(resolve => ({ firstName: 'Matthias', lastName: 'Funk' }))
      );

      const userProfile = await guard.getCurrentProfile();

      expect(userProfile).toEqual({ firstName: 'Matthias', lastName: 'Funk' });
    }));
  });
});

import { map, Observable, of, pipe, take } from 'rxjs';

import { Store } from '@ngrx/store';
import { MockProvider } from 'ng-mocks';

import * as azureAuth from '@schaeffler/azure-auth';

import { Stub } from '../../test/stub.class';
import { AuthService } from './auth.service';
import { Role } from './roles';

describe('AuthService', () => {
  let service: AuthService;
  let store: Store;

  beforeEach(() => {
    // Fix the getRoles mock by returning an Observable directly
    jest
      .spyOn(azureAuth, 'getRoles')
      .mockReturnValue(pipe(map(() => of(['USER', 'ADMIN']))) as any);

    service = Stub.get<AuthService>({
      component: AuthService,
      providers: [
        MockProvider(
          Store,
          {
            select: jest.fn().mockReturnValue(of([])),
            pipe: jest.fn().mockReturnValue(of([])),
          },
          'useValue'
        ),
      ],
    });

    store = service['store'];

    // Make the store.pipe method return a working observable
    jest.spyOn(store, 'pipe').mockReturnValue(of(['USER', 'ADMIN']));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hasUserAccess', () => {
    it('should return true when user has required roles', (done) => {
      const allowedRoles: Role[] = ['USER'] as any;

      const result$: Observable<boolean> = service
        .hasUserAccess(allowedRoles)
        .pipe(
          map((userRoles) =>
            // Map from array of roles to boolean
            Array.isArray(userRoles)
              ? userRoles.some((role) => allowedRoles.includes(role as Role))
              : userRoles
          )
        );

      result$.pipe(take(1)).subscribe((hasAccess) => {
        expect(hasAccess).toBe(true);
        done();
      });
    });

    it('should return false when user does not have required roles', (done) => {
      jest.spyOn(store, 'pipe').mockReturnValue(of(['GUEST']));

      const allowedRoles: Role[] = ['ADMIN'] as any;

      const result$: Observable<boolean> = service
        .hasUserAccess(allowedRoles)
        .pipe(
          map((userRoles) =>
            // Map from array of roles to boolean
            Array.isArray(userRoles)
              ? userRoles.some((role) => allowedRoles.includes(role as Role))
              : userRoles
          )
        );

      result$.pipe(take(1)).subscribe((hasAccess) => {
        expect(hasAccess).toBe(false);
        done();
      });
    });

    it('should check against multiple allowed roles', (done) => {
      const allowedRoles: Role[] = ['MANAGER', 'ADMIN'] as any;

      const result$: Observable<boolean> = service
        .hasUserAccess(allowedRoles)
        .pipe(
          map((userRoles) =>
            // Map from array of roles to boolean
            Array.isArray(userRoles)
              ? userRoles.some((role) => allowedRoles.includes(role as Role))
              : userRoles
          )
        );

      result$.pipe(take(1)).subscribe((hasAccess) => {
        expect(hasAccess).toBe(true);
        done();
      });
    });
  });

  describe('getUserRoles', () => {
    it('should return user roles from store', (done) => {
      const result$: Observable<string[]> = service.getUserRoles();

      result$.pipe(take(1)).subscribe((roles) => {
        expect(roles).toEqual(['USER', 'ADMIN']);
        expect(roles.length).toBe(2);
        done();
      });
    });

    it('should return empty array when user has no roles', (done) => {
      jest.spyOn(store, 'pipe').mockReturnValue(of([]));

      const result$: Observable<string[]> = service.getUserRoles();

      result$.pipe(take(1)).subscribe((roles) => {
        expect(roles).toEqual([]);
        expect(roles.length).toBe(0);
        done();
      });
    });
  });
});

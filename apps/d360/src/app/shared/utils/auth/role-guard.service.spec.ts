import { Component, DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { of } from 'rxjs';

import { AppRoutePath } from '../../../app.routes.enum';
import { Stub } from '../../test/stub.class';
import { AuthService } from './auth.service';
import { RoleGuard } from './role-guard.service';

@Component({
  selector: 'd360-app-test',
  template: '',
})
class TestComponent {}

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let routeSnapshotMock: Partial<ActivatedRouteSnapshot>;

  beforeEach(() => {
    authServiceMock = {
      hasUserAccess: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    routeSnapshotMock = {
      data: {},
    };

    Stub.getForEffect({
      component: TestComponent,
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: DestroyRef,
          useValue: {
            onDestroy: jest.fn(),
          },
        },
      ],
    });
    roleGuard = Stub.inject(RoleGuard);

    roleGuard = TestBed.inject(RoleGuard);
  });

  describe('canActivate', () => {
    test('should return true when user has access', async () => {
      routeSnapshotMock.data = { allowedRoles: ['ADMIN'] };
      authServiceMock.hasUserAccess.mockReturnValue(of(true));

      const result = roleGuard.canActivate(
        routeSnapshotMock as ActivatedRouteSnapshot,
        {} as any
      );

      const canActivate = await result.toPromise();
      expect(canActivate).toBe(true);
      expect(authServiceMock.hasUserAccess).toHaveBeenCalledWith(['ADMIN']);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    test('should navigate to forbidden page and return false when user does not have access', async () => {
      routeSnapshotMock.data = { allowedRoles: ['ADMIN'] };
      authServiceMock.hasUserAccess.mockReturnValue(of(false));

      const result = roleGuard.canActivate(
        routeSnapshotMock as ActivatedRouteSnapshot,
        {} as any
      );

      const canActivate = await result.toPromise();
      expect(canActivate).toBe(true); // Router.navigate returns a promise that resolves to true
      expect(authServiceMock.hasUserAccess).toHaveBeenCalledWith(['ADMIN']);
      expect(routerMock.navigate).toHaveBeenCalledWith([
        AppRoutePath.ForbiddenPage,
      ]);
    });

    test('should pass empty array when no allowedRoles provided', async () => {
      routeSnapshotMock.data = {}; // No allowedRoles
      authServiceMock.hasUserAccess.mockReturnValue(of(true));

      const result = roleGuard.canActivate(
        routeSnapshotMock as ActivatedRouteSnapshot,
        {} as any
      );

      await result.toPromise();
      expect(authServiceMock.hasUserAccess).toHaveBeenCalledWith([]);
    });
  });
});

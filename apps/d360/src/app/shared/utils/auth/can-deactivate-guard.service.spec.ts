import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { of } from 'rxjs';

import {
  CanComponentDeactivate,
  CanDeactivateGuard,
} from './can-deactivate-guard.service';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;
  let mockRoute: ActivatedRouteSnapshot;
  let mockRouterState: RouterStateSnapshot;

  beforeEach(() => {
    guard = new CanDeactivateGuard();
    mockRoute = {} as ActivatedRouteSnapshot;
    mockRouterState = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when component has no canDeactivate method', () => {
    const mockComponent = {} as CanComponentDeactivate;

    const result = guard.canDeactivate(
      mockComponent,
      mockRoute,
      mockRouterState
    );

    expect(result).toBe(true);
  });

  it('should return true when no component is provided', () => {
    const result = guard.canDeactivate(
      null as unknown as CanComponentDeactivate,
      mockRoute,
      mockRouterState
    );

    expect(result).toBe(true);
  });

  it('should return result of component.canDeactivate when it returns boolean true', () => {
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: jest.fn().mockReturnValue(true),
    };

    const result = guard.canDeactivate(
      mockComponent,
      mockRoute,
      mockRouterState
    );

    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return result of component.canDeactivate when it returns boolean false', () => {
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: jest.fn().mockReturnValue(false),
    };

    const result = guard.canDeactivate(
      mockComponent,
      mockRoute,
      mockRouterState
    );

    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return result of component.canDeactivate when it returns an Observable', () => {
    const mockObservable = of(true);
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: jest.fn().mockReturnValue(mockObservable),
    };

    const result = guard.canDeactivate(
      mockComponent,
      mockRoute,
      mockRouterState
    );

    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(mockObservable);
  });

  it('should return result of component.canDeactivate when it returns a Promise', () => {
    const mockPromise = Promise.resolve(true);
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: jest.fn().mockReturnValue(mockPromise),
    };

    const result = guard.canDeactivate(
      mockComponent,
      mockRoute,
      mockRouterState
    );

    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(mockPromise);
  });

  it('should handle the optional _nextState parameter', () => {
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: jest.fn().mockReturnValue(true),
    };
    const mockNextState = {} as RouterStateSnapshot;

    const result = guard.canDeactivate(
      mockComponent,
      mockRoute,
      mockRouterState,
      mockNextState
    );

    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});

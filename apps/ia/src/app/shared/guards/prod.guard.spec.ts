import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Environment } from '../../../environments/environment.model';
import { EnvironmentEnum } from '../models';
import { prodGuard } from './';

let environment: EnvironmentEnum;

jest.mock('./../../../environments/environments.provider', () => ({
  ...jest.requireActual('./../../../environments/environments.provider'),
  getEnv: jest.fn(() => ({ environment } as Environment)),
}));

describe('prodGuard', () => {
  test('should return true when dev environment', () => {
    environment = EnvironmentEnum.dev;

    expect(
      prodGuard(
        undefined as ActivatedRouteSnapshot,
        undefined as RouterStateSnapshot
      )
    ).toBeTruthy();
  });

  test('should return true when qa environment', () => {
    environment = EnvironmentEnum.qa;

    expect(
      prodGuard(
        undefined as ActivatedRouteSnapshot,
        undefined as RouterStateSnapshot
      )
    ).toBeTruthy();
  });

  test('should return false when prod environment', () => {
    environment = EnvironmentEnum.prod;

    expect(
      prodGuard(
        undefined as ActivatedRouteSnapshot,
        undefined as RouterStateSnapshot
      )
    ).toBeFalsy();
  });
});

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';

import { EnvironmentEnum } from '../../shared/models';
import { getEnv } from './../../../environments/environments.provider';

export const prodGuard: CanActivateFn = (
  _next: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): boolean => {
  const env = getEnv();

  return env.environment !== EnvironmentEnum.prod;
};

import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { EnvironmentEnum } from '@gq/shared/models';

import { AppRoutePath } from '../../app-route-path.enum';
import { Environment } from './../../../environments/environment.model';
import { ENV } from './../../../environments/environments.provider';

@Injectable({
  providedIn: 'root',
})
export class ProdGuard {
  constructor(
    @Inject(ENV) private readonly env: Environment,
    private readonly router: Router
  ) {}
  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (
      this.env.environment === EnvironmentEnum.prod ||
      this.env.environment === EnvironmentEnum['pre-release']
    ) {
      return this.router.navigate([AppRoutePath.ForbiddenPath]);
    }

    return true;
  }
}

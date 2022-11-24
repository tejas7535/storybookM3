import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AppRoutePath } from '../../app-route-path.enum';
import { EnvironmentEnum } from '../../shared/models';
import { Environment } from './../../../environments/environment.model';
import { ENV } from './../../../environments/environments.provider';

@Injectable({
  providedIn: 'root',
})
export class ProdGuard implements CanActivate {
  constructor(
    @Inject(ENV) private readonly env: Environment,
    private readonly router: Router
  ) {}
  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (this.env.environment === EnvironmentEnum.prod) {
      return this.router.navigate([AppRoutePath.ForbiddenPath]);
    }

    return true;
  }
}

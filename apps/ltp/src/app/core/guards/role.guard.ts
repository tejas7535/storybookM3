import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';

import { AuthService } from '../services';

@Injectable()
export class RoleGuard implements CanActivate, CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public canLoad(_route: Route, _segments: UrlSegment[]): boolean {
    return this.isAuthenticated();
  }

  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    if (!this.isAuthenticated()) {
      this.denyAccess(_route);

      return false;
    }
    const roles = this.authService.getAppRoles();
    const required_roles = _route.data.roles ? _route.data.roles : [];

    for (const role of required_roles) {
      if (roles.indexOf(role) < 0) {
        this.denyAccess(_route);

        return false;
      }
    }

    return true;
  }

  private isAuthenticated(): boolean {
    return this.authService.hasValidAccessToken();
  }

  private denyAccess(route: ActivatedRouteSnapshot): void {
    if (route.data.unauthorized && route.data.unauthorized.redirect) {
      this.router.navigate(route.data.unauthorized.redirect);
    }
  }
}

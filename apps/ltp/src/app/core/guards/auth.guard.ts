import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';

import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
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
    if (this.isAuthenticated()) {
      return true;
    }
    this.denyAccess(_route);

    return false;
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

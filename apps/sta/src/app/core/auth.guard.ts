import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private readonly authService: AuthService) {}

  public canLoad(_route: Route, _segments: UrlSegment[]): boolean {
    return this.isAuthenticated();
  }

  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    return this.isAuthenticated();
  }

  private isAuthenticated(): boolean {
    return this.authService.hasValidAccessToken();
  }
}

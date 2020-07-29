import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getIsLoggedIn } from '@schaeffler/auth';

import { AppState } from './store';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private readonly store: Store<AppState>) {}

  public canLoad(_route: Route, _segments: UrlSegment[]): Observable<boolean> {
    return this.isAuthenticated();
  }

  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isAuthenticated();
  }

  private isAuthenticated(): Observable<boolean> {
    return this.store.pipe(select(getIsLoggedIn));
  }
}

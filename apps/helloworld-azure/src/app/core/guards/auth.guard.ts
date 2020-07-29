import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { getIsLoggedIn } from '@schaeffler/auth';

import { AppState } from '../store/reducers/reducer';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store<AppState>) {}

  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store
      .select(getIsLoggedIn)
      .pipe(filter((isLoggedIn) => isLoggedIn));
  }
}

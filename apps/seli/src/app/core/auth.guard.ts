import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getIsLoggedIn } from '@schaeffler/shared/auth';

import { AuthState } from '../../../../../libs/shared/auth/src/lib/store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store<AuthState>) {}

  public canActivate(): Observable<boolean> {
    return this.isAuthenticated();
  }

  public isAuthenticated(): Observable<boolean> {
    return this.store.pipe(select(getIsLoggedIn));
  }
}

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AuthState, getIsLoggedIn } from '@schaeffler/auth';

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

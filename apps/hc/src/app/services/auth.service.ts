import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getAccessToken,
  getIsLoggedIn,
  getProfileImage,
  getUsername,
  login,
  logout,
} from '@schaeffler/azure-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly store: Store) {}

  public isLoggedin() {
    return this.store.select(getIsLoggedIn);
  }

  public login() {
    this.store.dispatch(login());
  }

  public logout() {
    this.store.dispatch(logout());
  }

  public getAccessToken() {
    return this.store.select(getAccessToken);
  }

  public getUsername() {
    return this.store.select(getUsername);
  }

  public getProfilePictureUrl() {
    return this.store.select(getProfileImage);
  }
}

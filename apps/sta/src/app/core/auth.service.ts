import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, share } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isAuthenticatedSubject$ = new BehaviorSubject<boolean>(
    false
  );
  public isAuthenticated$ = this.isAuthenticatedSubject$
    .asObservable()
    .pipe(share());

  private readonly isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  constructor(
    private readonly oauthService: OAuthService,
    private readonly router: Router
  ) {
    this.initConfig();
  }

  public async login(_targetUrl?: string): Promise<void> {
    return this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.oauthService.tryLogin())
      .then(async () => {
        if (this.oauthService.hasValidAccessToken()) {
          this.isAuthenticatedSubject$.next(true);
        }

        return this.silentRefresh(_targetUrl);
      })
      .then(() => {
        this.navigateToState();
        Promise.resolve();
      });
  }

  public async silentRefresh(targetUrl?: string): Promise<boolean> {
    return this.oauthService
      .silentRefresh()
      .then(() => Promise.resolve(true))
      .catch(async _result => {
        this.oauthService.initImplicitFlow(targetUrl || '/');

        return Promise.resolve(true);
      });
  }

  public async configureImplicitFlow(): Promise<void> {
    this.oauthService.setStorage(sessionStorage);

    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.navigateToState();
        }
        this.isDoneLoadingSubject$.next(true);
        this.oauthService.setupAutomaticSilentRefresh();
        Promise.resolve();
      })
      .catch(() => {
        this.isDoneLoadingSubject$.next(true);
        Promise.resolve();
      });
  }

  public hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  private navigateToState(): void {
    if (
      this.oauthService.state &&
      this.oauthService.state !== 'undefined' &&
      this.oauthService.state !== 'null'
    ) {
      this.router.navigateByUrl(this.oauthService.state);
    } else {
      this.router.initialNavigation();
    }
  }

  private initConfig(): void {
    window.addEventListener('storage', event => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );

      if (!this.oauthService.hasValidAccessToken()) {
        this.login();
      }
    });

    this.oauthService.events.subscribe(_event => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(_e => {
        this.router.navigateByUrl(String(this.oauthService.state));
      });

    this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
  }
}

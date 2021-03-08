import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  InteractionType,
  PopupRequest,
  RedirectRequest,
} from '@azure/msal-browser';

const GRAPH_PROFILE_IMAGE_ENDPOINT =
  'https://graph.microsoft.com/v1.0/me/photos/48x48/$value';

@Injectable({
  providedIn: 'root',
})
export class AzureAuthService {
  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private readonly msalGuardConfig: MsalGuardConfiguration,
    private readonly authService: MsalService,
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer
  ) {}

  login(): void {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService
          .loginPopup(({
            ...this.msalGuardConfig.authRequest,
          } as unknown) as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService
          .loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect(({
          ...this.msalGuardConfig.authRequest,
        } as unknown) as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getProfileImage(): Observable<string> {
    return this.http
      .get(GRAPH_PROFILE_IMAGE_ENDPOINT, { responseType: 'blob' })
      .pipe(
        map((photoBlob) => {
          const objectUrl = URL.createObjectURL(photoBlob);

          return this.sanitizer.sanitize(
            SecurityContext.URL,
            this.sanitizer.bypassSecurityTrustUrl(objectUrl)
          );
        })
      );
  }

  setActiveAccount(acc: AccountInfo): void {
    this.authService.instance.setActiveAccount(acc);
  }

  handleAccount(): AccountInfo {
    let activeAccount = this.authService.instance.getActiveAccount();

    // take first available account -> could be extended by some other logic
    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      const accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
      activeAccount = accounts[0];
    }

    return activeAccount;
  }
}

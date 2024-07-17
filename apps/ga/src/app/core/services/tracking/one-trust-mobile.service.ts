/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { TranslocoService } from '@jsverse/transloco';

import { environment } from '@ga/environments/environment';

import { ConsentResponse, OneTrustInterface } from './one-trust.interface';

declare const window: Window &
  typeof globalThis & {
    OneTrust: OneTrustInterface;
  };

@Injectable({
  providedIn: 'root',
})
export class OneTrustMobileService {
  public readonly categoryId = this.getCategoryId();
  public consentChanged$: Observable<ConsentResponse> =
    fromEvent<ConsentResponse>(document, this.categoryId);

  constructor(private readonly translocoService: TranslocoService) {}

  public initTracking(): void {
    if (Capacitor.isNativePlatform()) {
      window.OneTrust.observeChanges(this.categoryId);

      window.OneTrust.startSDK(
        environment.oneTrustMobileStorageLocation,
        this.getOneTrustMobileDomainId(),
        this.translocoService.getActiveLang(),
        {},
        () => {
          window.OneTrust.shouldShowBanner((shouldShow: boolean) => {
            if (shouldShow) {
              window.OneTrust.showBannerUI();
            }
          });
        },
        (_error: any) => {
          // no action required, tracking will not be started.
        }
      );
    }
  }

  public showPreferenceCenterUI(): void {
    window.OneTrust.showPreferenceCenterUI();
  }

  private getOneTrustMobileDomainId(): string {
    return Capacitor.getPlatform() === 'ios'
      ? environment.oneTrustiOSId
      : environment.oneTrustAndroidId;
  }

  private getCategoryId(): string {
    return Capacitor.getPlatform() === 'ios'
      ? environment.oneTrustiOSFirebaseCategoryId
      : environment.oneTrustAndroidFirebaseCategoryId;
  }
}

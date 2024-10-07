import { Injectable } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { environment } from '@ea/environments/environment';
import { TranslocoService } from '@jsverse/transloco';

import { AdvertisingIdService } from './advertising-id.service';
import {
  ConsentResponse,
  IdfaStatus,
  OneTrustInterface,
} from './one-trust.interface';

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
  private currentLanguage: string;

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly addvertisingIdService: AdvertisingIdService
  ) {}

  public initTracking(): void {
    if (Capacitor.isNativePlatform()) {
      window.OneTrust.observeChanges(this.categoryId);

      this.startSdk();

      this.translocoService.langChanges$.subscribe((lang) => {
        this.currentLanguage = lang;
        this.startSdk();
      });
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

  private startSdk(): void {
    window.OneTrust.startSDK(
      environment.oneTrustMobileStorageLocation,
      this.getOneTrustMobileDomainId(),
      this.currentLanguage,
      {},
      () => {
        if (Capacitor.getPlatform() === 'ios') {
          this.handleiOSConsentChange();
        } else {
          this.showBanner();
        }
      },
      (_error: any) => {
        // no action required, tracking will not be started.
      }
    );
  }

  private handleiOSConsentChange(): void {
    this.addvertisingIdService.initializeStatusObservable();

    window.OneTrust.showConsentUI(
      window.OneTrust.devicePermission.idfa,
      (_status: IdfaStatus) => {
        if (_status === IdfaStatus.Authorized) {
          this.showBanner();

          return;
        }

        this.addvertisingIdService.getAddStatus().subscribe((status) => {
          if (status === this.addvertisingIdService.authorized) {
            this.showBanner();
          }
        });
      }
    );
  }

  private showBanner(): void {
    window.OneTrust.shouldShowBanner((shouldShow: boolean) => {
      if (shouldShow) {
        window.OneTrust.showBannerUI();
      }
    });
  }

  private getCategoryId(): string {
    return Capacitor.getPlatform() === 'ios'
      ? environment.oneTrustiOSFirebaseCategoryId
      : environment.oneTrustAndroidFirebaseCategoryId;
  }
}

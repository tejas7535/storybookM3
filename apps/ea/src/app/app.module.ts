import { OverlayContainer } from '@angular/cdk/overlay';
import {
  APP_INITIALIZER,
  ApplicationRef,
  DoBootstrap,
  Injector,
  NgModule,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { combineLatest, Observable, tap } from 'rxjs';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { environment } from '@ea/environments/environment';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoDecimalPipe } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
  CustomProps,
} from '@schaeffler/application-insights';
import { BannerModule } from '@schaeffler/banner';
import {
  CUSTOM_DATA_PRIVACY,
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
  TERMS_OF_USE,
} from '@schaeffler/legal-pages';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { AppComponent } from './app.component';
import { AppOverlayContainer } from './app-overlay.container';
import { AppRoutePath } from './app-route-path.enum';
import { CalculationContainerComponent } from './calculation/calculation-container/calculation-container.component';
import { CalculationViewComponent } from './calculation-view/calculation-view.component';
import { CoreModule } from './core/core.module';
import { MobileKeyboardVisibilityService } from './core/services/mobile-keyboard-visibility/mobile-keyboard-visibility.service';
import { ConsentValues } from './core/services/tracking-service/one-trust.interface';
import { OneTrustMobileService } from './core/services/tracking-service/one-trust-mobile.service';
import { SettingsFacade } from './core/store';
import { BearingDesignationProvidedGuard } from './guards/bearing-designation-provided.guard';
import { LanguageGuard } from './guards/language.guard';
import { LegacyAppComponent } from './legacy-app/legacy-app.component';
import { QualtricsInfoBannerComponent } from './shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { SettingsPanelComponent } from './shared/settings-panel/settings-panel.component';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    component: CalculationViewComponent,
    pathMatch: 'full',
    canActivate: [LanguageGuard, BearingDesignationProvidedGuard],
  },
  {
    path: AppRoutePath.LegalPath,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: AppRoutePath.HomePath,
    loadComponent: () =>
      import('./home/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
    canActivate: [LanguageGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export const APP_ROOT = 'engineering-app';

export function DynamicTermsOfUse(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.termsOfUseContent');
}

export function DynamicDataPrivacy(
  translocoService: TranslocoService
): Observable<string> | void {
  return translocoService.selectTranslateObject('legal.schaefflerDataPrivacy');
}

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicStoragePeriod(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.storagePeriod');
}

export function mobileKeyboardVisibilityServiceFactory(
  service: MobileKeyboardVisibilityService
): () => Promise<void> {
  return () => service.initialize();
}

export function mobileOneTrustInitializer(
  oneTrustMobileService: OneTrustMobileService
) {
  if (Capacitor.isNativePlatform()) {
    FirebaseAnalytics.setCollectionEnabled({
      enabled: false,
    });

    oneTrustMobileService.initTracking();

    oneTrustMobileService.consentChanged$.subscribe((consentChange) => {
      const trackingEnabled =
        consentChange.consentStatus === ConsentValues.ConsentGiven &&
        !Capacitor.DEBUG;
      FirebaseAnalytics.setCollectionEnabled({
        enabled: trackingEnabled,
      });

      if (consentChange.consentStatus === ConsentValues.ConsentNotGiven) {
        FirebaseAnalytics.reset();
      }
    });
  }

  return () => {};
}

let tracking = [
  OneTrustModule.forRoot({
    cookiesGroups: COOKIE_GROUPS,
    domainScript: environment.oneTrustId,
  }),
  ApplicationInsightsModule.forRoot(environment.applicationInsights),
];

let providers = [
  {
    provide: APP_INITIALIZER,
    deps: [ApplicationInsightsService, SettingsFacade, OneTrustService],
    useFactory: (
      appInsightService: ApplicationInsightsService,
      settingsFacade: SettingsFacade,
      oneTrustService: OneTrustService
    ) => {
      const customProps: CustomProps = {
        tag: 'application',
        value: '[Medias - EasyCalc]',
      };

      return () =>
        combineLatest([settingsFacade.isStandalone$]).pipe(
          tap(([standalone]) => {
            if (standalone) {
              oneTrustService.loadOneTrust();
              appInsightService.initTracking(
                oneTrustService.consentChanged$(),
                customProps
              );
            }
          })
        );
    },
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: mobileOneTrustInitializer,
    deps: [OneTrustMobileService],
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: mobileKeyboardVisibilityServiceFactory,
    deps: [MobileKeyboardVisibilityService],
    multi: true,
  },
  TranslocoDecimalPipe,
  { provide: OverlayContainer, useClass: AppOverlayContainer },
  {
    provide: PERSON_RESPONSIBLE,
    useValue: 'Schaeffler Technologies AG & Co. KG',
  },
  {
    provide: TERMS_OF_USE,
    useFactory: DynamicTermsOfUse,
    deps: [TranslocoService],
  },
  {
    provide: PURPOSE,
    useFactory: DynamicPurpose,
    deps: [TranslocoService],
  },
  {
    provide: STORAGE_PERIOD,
    useFactory: DynamicStoragePeriod,
    deps: [TranslocoService],
  },
  {
    provide: CUSTOM_DATA_PRIVACY,
    useFactory: DynamicDataPrivacy,
    deps: [TranslocoService],
  },
];

// needed for mobile app and medias
if (Capacitor.isNativePlatform()) {
  tracking = [];
  providers = providers.slice(1); // Removes OneTrust Provider
}

@NgModule({
  declarations: [AppComponent],
  providers: [...providers],
  imports: [
    BrowserModule,
    CoreModule,
    PushPipe,
    BrowserAnimationsModule,
    CalculationContainerComponent,
    SharedTranslocoModule,
    RouterModule.forRoot(appRoutePaths, { enableTracing: false }),
    // UI Modules
    AppShellModule,
    BannerModule,
    SettingsPanelComponent,
    LanguageSelectModule,
    QualtricsInfoBannerComponent,
    LegacyAppComponent,
    ...tracking,
  ],
})
export class AppModule implements DoBootstrap {
  constructor(readonly injector: Injector) {
    // check if app is already initialized. It should prevent from intialization called multiple times
    if (!customElements.get(APP_ROOT)) {
      const webComponent = createCustomElement(AppComponent, { injector });
      customElements.define(APP_ROOT, webComponent);
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngDoBootstrap(_appRef: ApplicationRef) {
    // this function is required by Angular but not actually necessary since we create a web component here
  }
}

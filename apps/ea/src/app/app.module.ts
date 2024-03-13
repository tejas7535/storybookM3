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

import { TranslocoService } from '@ngneat/transloco';
import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { BannerModule } from '@schaeffler/banner';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
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
import { BearingDesignationProvidedGuard } from './guards/bearing-designation-provided.guard';
import { LegacyAppComponent } from './legacy-app/legacy-app.component';
import { QualtricsInfoBannerComponent } from './shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { SettingsPanelComponent } from './shared/settings-panel/settings-panel.component';
import { environment } from '@ea/environments/environment';
import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  CustomProps,
} from '@schaeffler/application-insights';
import { combineLatest, of, tap } from 'rxjs';
import { CookiesGroups } from '@altack/ngx-onetrust';
import { SettingsFacade } from './core/store';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    component: CalculationViewComponent,
    pathMatch: 'full',
    canActivate: [BearingDesignationProvidedGuard],
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

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicStoragePeriod(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.storagePeriod');
}

@NgModule({
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [ApplicationInsightsService, SettingsFacade],
      useFactory: (
        appInsightService: ApplicationInsightsService,
        settingsFacade: SettingsFacade
      ) => {
        const customProps: CustomProps = {
          tag: 'application',
          value: '[Medias - EasyCalc]',
        };
        const dummyCookieGroup = new Map([
          [CookiesGroups.PerformanceCookies, true],
        ]);

        return () =>
          combineLatest([settingsFacade.isStandalone$]).pipe(
            tap(([standalone]) => {
              if (standalone && !environment.localDev) {
                appInsightService.initTracking(
                  of(dummyCookieGroup),
                  customProps
                );
              }
            })
          );
      },
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
  ],
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

    ApplicationInsightsModule.forRoot(environment.applicationInsights),
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

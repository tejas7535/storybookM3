import { CommonModule, DecimalPipe } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@jsverse/transloco';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { HttpHostMappingInterceptor } from '@mm/shared/interceptors/http-host-mapping.interceptor';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
  CustomProps,
} from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { environment } from '../../environments/environment';
import { HttpLocaleInterceptor } from '../shared/interceptors/http-locale.interceptor';
import { SharedModule } from '../shared/shared.module';
import { PagesStepperModule } from './components/pages-stepper/pages-stepper.module';
import { SettingsComponent } from './components/settings/settings.component';

export class DynamicLocaleId extends String {
  public constructor(protected translocoService: TranslocoService) {
    super('');
  }

  public toString() {
    return this.translocoService.getActiveLang();
  }
}

export function appInitializer(
  oneTrustService: OneTrustService,
  applicationInsightsService: ApplicationInsightsService
) {
  const customProps: CustomProps = {
    tag: 'application',
    value: '[Bearinx - MountingManager]',
  };

  applicationInsightsService.initTracking(
    oneTrustService.consentChanged$(),
    customProps
  );

  return () => oneTrustService.loadOneTrust();
}

let Tracking = [
  ApplicationInsightsModule.forRoot(environment.applicationInsights),
  OneTrustModule.forRoot({
    cookiesGroups: COOKIE_GROUPS,
    domainScript: environment.oneTrustId,
  }),
];

let providers = [
  // OneTrust Provider must be first entry
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializer,
    deps: [OneTrustService, ApplicationInsightsService],
    multi: true,
  },
  {
    provide: LOCALE_ID,
    useClass: DynamicLocaleId,
    deps: [TranslocoService],
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLocaleInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHostMappingInterceptor,
    multi: true,
  },
  provideTranslocoPersistLang({
    storageKey: 'language',
    storage: {
      useValue: localStorage,
    },
  }),
  DecimalPipe,
];

if (
  window.self !== window.top ||
  window.origin.includes('capacitor://') ||
  window.origin === 'http://localhost'
) {
  Tracking = [];
  providers = providers.slice(1); // Removes OneTrust Provider
}

@NgModule({
  declarations: [SettingsComponent],
  exports: [SettingsComponent, PagesStepperModule],
  imports: [
    CommonModule,
    RouterModule,
    AppShellModule,
    // UI Modules
    PagesStepperModule,
    SharedModule,
    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      [
        { id: 'de', label: 'Deutsch' },
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' },
        { id: 'fr', label: 'Français' },
        { id: 'ru', label: 'русский' },
        { id: 'zh', label: '中文' },
      ],
      undefined, // default -> undefined would lead to browser detection
      'en',
      'language',
      true,
      !environment.localDev
    ),
    LanguageSelectModule,
    // Monitoring
    ...Tracking,
    HttpCacheInterceptorModule.forRoot(),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), ...providers],
})
export class CoreModule {}

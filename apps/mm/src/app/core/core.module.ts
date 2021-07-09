import { CommonModule, DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  CookiesGroups,
  OneTrustModule,
  OneTrustService,
} from '@altack/ngx-onetrust';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { TranslocoService } from '@ngneat/transloco';

import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { HeaderModule } from '@schaeffler/header';
import { HttpModule } from '@schaeffler/http';
import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { HttpLocaleInterceptor } from '../shared/interceptors/http-locale.interceptor';
import { SharedModule } from '../shared/shared.module';
import { PagesStepperModule } from './components/pages-stepper/pages-stepper.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';

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
  oneTrustService.consentChanged$().subscribe((cookiesGroups) => {
    applicationInsightsService.startTracking(
      cookiesGroups.get(CookiesGroups.PerformanceCookies) || false
    );
  });

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
  DecimalPipe,
];

if (window.self !== window.top) {
  Tracking = [];
  providers = providers.slice(1); // Removes OneTrust Provider
}

@NgModule({
  declarations: [AppComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,

    // UI Modules
    HeaderModule,
    FooterTailwindModule,
    IconsModule,

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
        { id: 'zh', label: '中国' },
      ],
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),
    // Monitoring
    ...Tracking,

    // HTTP
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    HttpModule.forRoot({ environment }),
  ],
  exports: [AppComponent, SidebarComponent, PagesStepperModule],
  providers,
})
export class CoreModule {}

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { PushPipe } from '@ngrx/component';

import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppRoutePath } from '../app-route-path.enum';
import { BaseHttpInterceptor } from '../shared/http/base-http.interceptor';
import { HttpHeaderInterceptor } from '../shared/http/http-header.interceptor';
import { PERSON_ALERT_ICON, TALL_HAT_GENTLEMAN } from '../shared/models/svg';
import { StoreModule } from './store';

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/api/*', [environment.appScope]),
  ]),
  new MsalGuardConfig(`/${AppRoutePath.ForbiddenPath}`, [environment.appScope])
);

export function appInitializer(
  oneTrustService: OneTrustService,
  applicationInsightsService: ApplicationInsightsService
) {
  applicationInsightsService.initTracking(oneTrustService.consentChanged$());

  return () => oneTrustService.loadOneTrust();
}

@NgModule({
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    PushPipe,
    RouterModule,
    LoadingSpinnerModule,

    // UI Modules
    MatButtonModule,
    MatSnackBarModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      [{ id: 'en', label: 'English' }],
      'en', // default -> undefined would lead to browser detection
      'en',
      undefined, // language storage key -> language is not persisted in this app
      true,
      !environment.localDev
    ),

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
    OneTrustModule.forRoot({
      cookiesGroups: COOKIE_GROUPS,
      domainScript: environment.oneTrustId,
    }),
  ],
  providers: [
    // OneTrust Provider must be first entry
    provideAppInitializer(() => {
      const initializerFn = appInitializer(
        inject(OneTrustService),
        inject(ApplicationInsightsService)
      );

      return initializerFn();
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
  ],
})
export class CoreModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral(
      'person-alert',
      sanitizer.bypassSecurityTrustHtml(PERSON_ALERT_ICON)
    );
    iconRegistry.addSvgIconLiteral(
      'tall-hat-gentleman',
      sanitizer.bypassSecurityTrustHtml(TALL_HAT_GENTLEMAN)
    );
  }
}

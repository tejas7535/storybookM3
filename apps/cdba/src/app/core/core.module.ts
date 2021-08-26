import { PlatformModule } from '@angular/cdk/platform';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import de from '@angular/common/locales/de';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import { FooterModule } from '@schaeffler/footer';
import { HttpErrorInterceptor, HttpModule } from '@schaeffler/http';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { environment } from '@cdba/environments/environment';
import { LoadingSpinnerModule } from '@cdba/shared/components';

import i18nChecksumsJson from '../../i18n-checksums.json';
import { AppComponent } from '../app.component';
import { StoreModule } from './store/store.module';

const locale = 'de-DE';
registerLocaleData(de, locale);

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/api/*', [environment.appScope]),
  ]),
  new MsalGuardConfig(`${AppRoutePath.ForbiddenPath}`, [environment.appScope])
);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    ReactiveComponentModule,

    // UI Modules
    AppShellModule,
    FooterModule,
    MatButtonModule,
    LoadingSpinnerModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true,
      i18nChecksumsJson
    ),

    // HTTP
    HttpModule.forRoot({ environment }),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // Notifications
    SnackBarModule,

    // Platform required for detecting the browser engine
    PlatformModule,

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: locale },
  ],
  exports: [AppComponent],
})
export class CoreModule {}

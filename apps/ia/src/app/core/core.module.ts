import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
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
import * as i18nChecksumsJson from '../../i18n-checksums.json';
import { AppRoutePath } from '../app-route-path.enum';
import { FilterSectionModule } from '../filter-section/filter-section.module';
import { BaseHttpInterceptor } from '../shared/http/base-http.interceptor';
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
  new MsalGuardConfig(`/${AppRoutePath.Forbidden}`, [environment.appScope])
);

@NgModule({
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    ReactiveComponentModule,
    RouterModule,
    LoadingSpinnerModule,

    // UI Modules
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      [{ id: 'en', label: 'English' }],
      'en', // default -> undefined would lead to browser detection
      'en',
      true,
      !environment.localDev,
      i18nChecksumsJson
    ),

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),

    // filter section at the top
    FilterSectionModule,

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseHttpInterceptor,
      multi: true,
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
  ],
})
export class CoreModule {}

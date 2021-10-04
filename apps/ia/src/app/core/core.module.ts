import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
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
import { HeaderModule } from '@schaeffler/header';
import { HttpModule } from '@schaeffler/http';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppRoutePath } from '../app-route-path.enum';
import { AppComponent } from '../app.component';
import { FilterSectionModule } from '../filter-section/filter-section.module';
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
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    ReactiveComponentModule,
    RouterModule,

    // UI Modules
    HeaderModule,
    MatButtonModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),

    // http
    HttpModule.forRoot({ environment }),

    // filter section at the top
    FilterSectionModule,

    // Tabs
    MatTabsModule,

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // Loading Spinner
    LoadingSpinnerModule,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
  ],
  exports: [AppComponent],
})
export class CoreModule {}

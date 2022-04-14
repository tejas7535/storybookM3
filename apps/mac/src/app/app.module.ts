import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { TranslocoService } from '@ngneat/transloco';
import {
  DATA_SOURCE,
  PURPOSE,
} from 'libs/shared/ui/legal-pages/src/lib/legal.model';

import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import { PERSON_RESPONSIBLE } from '@schaeffler/legal-pages';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// eslint-disable-next-line import/no-extraneous-dependencies
const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.azureClientId,
    environment.azureTenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('*/api/*', [environment.appId]),
  ]),
  new MsalGuardConfig('/login-failed', [environment.appId])
);

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicDataSource(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.dataSource');
}

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    SharedAzureAuthModule.forRoot(azureConfig),
    SharedTranslocoModule.forRoot(
      environment.production,
      ['de', 'en'],
      undefined,
      'en',
      true,
      !environment.localDev
    ),
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Dr. Johannes Möller',
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    {
      provide: DATA_SOURCE,
      useFactory: DynamicDataSource,
      deps: [TranslocoService],
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}

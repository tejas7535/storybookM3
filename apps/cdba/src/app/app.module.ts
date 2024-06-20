import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { Observable } from 'rxjs';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { TranslocoService } from '@jsverse/transloco';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  CUSTOM_DATA_PRIVACY,
  PERSON_RESPONSIBLE,
  TERMS_OF_USE,
} from '@schaeffler/legal-pages';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CoreModule } from '@cdba/core';
import { ENV, getEnv } from '@cdba/environments/environment.provider';
import {
  BetaFeatureModule,
  BrowserSupportModule,
  LoadingSpinnerModule,
  RoleDescriptionsModule,
  UserSettingsModule,
} from '@cdba/shared/components';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

export function DynamicDataPrivacy(
  translocoService: TranslocoService
): Observable<string> {
  return translocoService.selectTranslate('legal.customDataPrivacy');
}

export function DynamicTermsOfUse(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.customTermsOfUse');
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent, MsalRedirectComponent],
  imports: [
    HttpCacheInterceptorModule.forRoot(),
    PushPipe,
    CommonModule,
    // core and routing modules
    AppRoutingModule,
    CoreModule,
    // ui and app root modules
    MatDividerModule,
    LoadingSpinnerModule,
    BetaFeatureModule,
    BrowserSupportModule,
    AppShellModule,
    UserSettingsModule,
    RoleDescriptionsModule,
    SharedTranslocoModule,
  ],
  providers: [
    {
      provide: ENV,
      useFactory: getEnv,
    },
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Stefan Giehl',
    },
    {
      provide: CUSTOM_DATA_PRIVACY,
      useFactory: DynamicDataPrivacy,
      deps: [TranslocoService],
    },
    {
      provide: TERMS_OF_USE,
      useFactory: DynamicTermsOfUse,
      deps: [TranslocoService],
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}

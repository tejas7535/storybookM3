/* eslint @nx/enforce-module-boundaries: 1 */
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { TranslocoService } from '@jsverse/transloco';

import {
  DATA_SOURCE,
  PERSON_RESPONSIBLE,
  PURPOSE,
} from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicDataSource(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.dataSource');
}

@NgModule({
  bootstrap: [AppComponent, MsalRedirectComponent],
  imports: [AppRoutingModule, CoreModule, SharedModule],
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
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}

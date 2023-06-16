import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';

import { Observable } from 'rxjs';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { TranslocoService } from '@ngneat/transloco';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  CUSTOM_DATA_PRIVACY,
  PERSON_RESPONSIBLE,
  TERMS_OF_USE,
} from '@schaeffler/legal-pages';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { FilterSectionModule } from './filter-section/filter-section.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

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
  imports: [
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    SharedModule,

    AppRoutingModule,
    CoreModule,
    MatTabsModule,
    SharedTranslocoModule,

    LoadingSpinnerModule,
    AppShellModule,
    UserModule,
    FilterSectionModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Marius Rößner',
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
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
